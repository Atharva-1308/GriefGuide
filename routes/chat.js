import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';
import { optionalAuth } from '../middleware/auth.js';
import { generateAIResponse } from '../services/aiService.js';
import { analyzeUserInput } from '../services/analyticsService.js';

const router = express.Router();

// Create new chat session
router.post('/sessions', optionalAuth, async (req, res) => {
  try {
    const sessionId = uuidv4();
    const userId = req.user.id;
    const isAnonymous = req.user.isAnonymous || false;

    await db.runAsync(
      'INSERT INTO chat_sessions (id, user_id, is_anonymous, created_at) VALUES (?, ?, ?, ?)',
      [sessionId, userId, isAnonymous, new Date().toISOString()]
    );

    res.status(201).json({
      sessionId,
      message: 'Chat session created'
    });
  } catch (error) {
    console.error('Chat session creation error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Get chat sessions for user
router.get('/sessions', optionalAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await db.allAsync(
      `SELECT id, title, created_at, updated_at 
       FROM chat_sessions 
       WHERE user_id = ? 
       ORDER BY updated_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json({ sessions });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat sessions' });
  }
});

// Get messages for a chat session
router.get('/sessions/:sessionId/messages', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Verify session belongs to user
    const session = await db.getAsync(
      'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const messages = await db.allAsync(
      `SELECT id, message_text, is_user_message, is_voice_message, audio_url, 
              is_personalized, created_at 
       FROM chat_messages 
       WHERE session_id = ? 
       ORDER BY created_at ASC`,
      [sessionId]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Send message
router.post('/sessions/:sessionId/messages', optionalAuth, [
  body('message').notEmpty().trim().isLength({ max: 5000 }),
  body('isVoiceMessage').optional().isBoolean(),
  body('audioUrl').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId } = req.params;
    const { message, isVoiceMessage = false, audioUrl } = req.body;
    const userId = req.user.id;

    // Verify session belongs to user
    const session = await db.getAsync(
      'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Save user message
    const userMessageId = uuidv4();
    await db.runAsync(
      `INSERT INTO chat_messages 
       (id, session_id, user_id, message_text, is_user_message, is_voice_message, audio_url, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userMessageId, sessionId, userId, message, 1, isVoiceMessage, audioUrl, new Date().toISOString()]
    );

    // Analyze user input for insights
    analyzeUserInput(userId, message, { isVoiceMessage, sessionId });

    // Generate AI response
    const aiResponse = await generateAIResponse(userId, message, sessionId);

    // Save AI response
    const aiMessageId = uuidv4();
    await db.runAsync(
      `INSERT INTO chat_messages 
       (id, session_id, user_id, message_text, is_user_message, ai_model, is_personalized, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [aiMessageId, sessionId, userId, aiResponse.text, 0, aiResponse.model, aiResponse.isPersonalized, new Date().toISOString()]
    );

    // Update session timestamp
    await db.runAsync(
      'UPDATE chat_sessions SET updated_at = ? WHERE id = ?',
      [new Date().toISOString(), sessionId]
    );

    res.json({
      userMessage: {
        id: userMessageId,
        message,
        isVoiceMessage,
        audioUrl,
        timestamp: new Date().toISOString()
      },
      aiResponse: {
        id: aiMessageId,
        text: aiResponse.text,
        isPersonalized: aiResponse.isPersonalized,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete chat session
router.delete('/sessions/:sessionId', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const result = await db.runAsync(
      'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({ error: 'Failed to delete chat session' });
  }
});

// Update session title
router.patch('/sessions/:sessionId', optionalAuth, [
  body('title').notEmpty().trim().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    const result = await db.runAsync(
      'UPDATE chat_sessions SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      [title, new Date().toISOString(), sessionId, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ message: 'Session title updated successfully' });
  } catch (error) {
    console.error('Update session title error:', error);
    res.status(500).json({ error: 'Failed to update session title' });
  }
});

export default router;