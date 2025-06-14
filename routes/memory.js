import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { processMemoryFile } from '../services/memoryService.js';
import { updatePersonalityProfile } from '../services/aiService.js';

const router = express.Router();

// Upload memory files
router.post('/upload', upload.array('memories', 10), handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const userId = req.user.id;
    const uploadedMemories = [];

    for (const file of req.files) {
      const memoryId = uuidv4();
      
      // Determine memory type based on file
      let memoryType = 'letter';
      if (file.mimetype.startsWith('audio/')) {
        memoryType = 'voice';
      } else if (file.originalname.toLowerCase().includes('chat') || 
                 file.originalname.toLowerCase().includes('message')) {
        memoryType = 'chat';
      }

      // Save to database
      await db.runAsync(
        `INSERT INTO memory_uploads 
         (id, user_id, original_filename, file_path, file_type, file_size, memory_type, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          memoryId,
          userId,
          file.originalname,
          file.path,
          file.mimetype,
          file.size,
          memoryType,
          new Date().toISOString()
        ]
      );

      uploadedMemories.push({
        id: memoryId,
        originalName: file.originalname,
        type: memoryType,
        size: file.size
      });

      // Process file asynchronously
      processMemoryFile(memoryId, file.path, memoryType)
        .then(() => updatePersonalityProfile(userId))
        .catch(error => console.error('Memory processing error:', error));
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      memories: uploadedMemories
    });
  } catch (error) {
    console.error('Memory upload error:', error);
    res.status(500).json({ error: 'Failed to upload memories' });
  }
});

// Get user's uploaded memories
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type } = req.query;
    
    let query = `
      SELECT id, original_filename, memory_type, file_size, processed, 
             processing_status, emotional_tone, created_at, processed_at
      FROM memory_uploads 
      WHERE user_id = ?
    `;
    
    const params = [userId];
    
    if (type) {
      query += ' AND memory_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const memories = await db.allAsync(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM memory_uploads WHERE user_id = ?';
    const countParams = [userId];
    
    if (type) {
      countQuery += ' AND memory_type = ?';
      countParams.push(type);
    }
    
    const { total } = await db.getAsync(countQuery, countParams);

    res.json({
      memories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
});

// Get specific memory details
router.get('/:memoryId', async (req, res) => {
  try {
    const { memoryId } = req.params;
    const userId = req.user.id;

    const memory = await db.getAsync(
      `SELECT id, original_filename, memory_type, file_size, processed, 
              processing_status, extracted_text, ai_analysis, emotional_tone, 
              communication_patterns, created_at, processed_at
       FROM memory_uploads 
       WHERE id = ? AND user_id = ?`,
      [memoryId, userId]
    );

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.json({ memory });
  } catch (error) {
    console.error('Get memory details error:', error);
    res.status(500).json({ error: 'Failed to retrieve memory details' });
  }
});

// Delete memory
router.delete('/:memoryId', async (req, res) => {
  try {
    const { memoryId } = req.params;
    const userId = req.user.id;

    // Get memory details first
    const memory = await db.getAsync(
      'SELECT file_path FROM memory_uploads WHERE id = ? AND user_id = ?',
      [memoryId, userId]
    );

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    // Delete from database
    await db.runAsync(
      'DELETE FROM memory_uploads WHERE id = ? AND user_id = ?',
      [memoryId, userId]
    );

    // Delete file from filesystem
    try {
      await fs.unlink(memory.file_path);
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      // Continue even if file deletion fails
    }

    // Update personality profile
    updatePersonalityProfile(userId).catch(error => 
      console.error('Personality profile update error:', error)
    );

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// Get memory processing status
router.get('/:memoryId/status', async (req, res) => {
  try {
    const { memoryId } = req.params;
    const userId = req.user.id;

    const memory = await db.getAsync(
      'SELECT processed, processing_status FROM memory_uploads WHERE id = ? AND user_id = ?',
      [memoryId, userId]
    );

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.json({
      processed: memory.processed,
      status: memory.processing_status
    });
  } catch (error) {
    console.error('Get memory status error:', error);
    res.status(500).json({ error: 'Failed to retrieve memory status' });
  }
});

// Get memory statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await db.getAsync(
      `SELECT 
         COUNT(*) as total_memories,
         COUNT(CASE WHEN memory_type = 'letter' THEN 1 END) as letters,
         COUNT(CASE WHEN memory_type = 'voice' THEN 1 END) as voice_recordings,
         COUNT(CASE WHEN memory_type = 'chat' THEN 1 END) as chat_conversations,
         COUNT(CASE WHEN processed = 1 THEN 1 END) as processed_memories,
         SUM(file_size) as total_size
       FROM memory_uploads 
       WHERE user_id = ?`,
      [userId]
    );

    // Get personality profile confidence
    const profile = await db.getAsync(
      'SELECT confidence_score FROM ai_personality_profiles WHERE user_id = ?',
      [userId]
    );

    res.json({
      ...stats,
      confidence_score: profile?.confidence_score || 0,
      personalization_level: Math.min(100, (stats.processed_memories || 0) * 20)
    });
  } catch (error) {
    console.error('Get memory stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve memory statistics' });
  }
});

export default router;