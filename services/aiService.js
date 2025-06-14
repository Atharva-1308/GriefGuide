import OpenAI from 'openai';
import { db } from '../database/init.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateAIResponse = async (userId, userMessage, sessionId) => {
  try {
    // Get user's personality profile
    const profile = await db.getAsync(
      'SELECT * FROM ai_personality_profiles WHERE user_id = ?',
      [userId]
    );

    // Get recent conversation context
    const recentMessages = await db.allAsync(
      `SELECT message_text, is_user_message 
       FROM chat_messages 
       WHERE session_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [sessionId]
    );

    // Build conversation context
    const conversationHistory = recentMessages
      .reverse()
      .map(msg => ({
        role: msg.is_user_message ? 'user' : 'assistant',
        content: msg.message_text
      }));

    // Build system prompt
    let systemPrompt = `You are a compassionate AI grief support companion. Your role is to provide empathetic, gentle, and supportive responses to someone who is grieving. 

Key guidelines:
- Be warm, understanding, and non-judgmental
- Validate their feelings and experiences
- Offer gentle support without trying to "fix" their grief
- Use simple, comforting language
- Avoid clichés or platitudes
- Encourage professional help when appropriate
- Remember that grief is unique to each person`;

    if (profile && profile.confidence_score > 0.3) {
      systemPrompt += `

PERSONALIZATION: You have learned about this person's loved one from their shared memories. Here's what you know:

Communication Style: ${profile.communication_style || 'Not specified'}
Emotional Patterns: ${profile.emotional_patterns || 'Not specified'}
Common Phrases: ${profile.common_phrases || 'None recorded'}
Personality Traits: ${profile.personality_traits || 'Not specified'}
Relationship Context: ${profile.relationship_context || 'Not specified'}

Use this information to provide responses that honor their loved one's memory and communication style. Speak in a way that feels authentic to how their loved one might have offered comfort, while maintaining your role as a grief support companion.`;
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Generate response
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const responseText = completion.choices[0].message.content;

    return {
      text: responseText,
      model: completion.model,
      isPersonalized: profile && profile.confidence_score > 0.3
    };
  } catch (error) {
    console.error('AI response generation error:', error);
    
    // Fallback response
    const fallbackResponses = [
      "I hear you, and what you're feeling is completely valid. Grief is a natural response to loss, and there's no right or wrong way to experience it.",
      "Thank you for sharing that with me. It takes courage to express these feelings. Remember, healing isn't linear - it's okay to have difficult days.",
      "Your feelings matter, and so do you. It's okay to take things one moment at a time. What would feel most helpful for you right now?",
      "I'm honored that you've trusted me with your feelings. Grief can feel overwhelming, but you don't have to carry it alone."
    ];
    
    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      model: 'fallback',
      isPersonalized: false
    };
  }
};

export const updatePersonalityProfile = async (userId) => {
  try {
    // Get all processed memories for the user
    const memories = await db.allAsync(
      `SELECT memory_type, extracted_text, ai_analysis, emotional_tone, communication_patterns 
       FROM memory_uploads 
       WHERE user_id = ? AND processed = 1`,
      [userId]
    );

    if (memories.length === 0) {
      return;
    }

    // Combine all text content
    const allText = memories
      .map(m => m.extracted_text)
      .filter(text => text && text.trim())
      .join('\n\n');

    if (!allText.trim()) {
      return;
    }

    // Analyze communication patterns with OpenAI
    const analysisPrompt = `Analyze the following text from someone's loved one and extract their communication patterns, personality traits, and emotional style. Focus on:

1. Communication style (formal/casual, direct/gentle, etc.)
2. Emotional patterns (how they express care, comfort, encouragement)
3. Common phrases or expressions they use
4. Personality traits that come through in their communication
5. The nature of their relationship with the person

Text to analyze:
${allText}

Please provide a JSON response with the following structure:
{
  "communication_style": "description",
  "emotional_patterns": "description", 
  "common_phrases": ["phrase1", "phrase2"],
  "personality_traits": "description",
  "relationship_context": "description",
  "confidence_score": 0.0-1.0
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: analysisPrompt }],
      max_tokens: 1000,
      temperature: 0.3
    });

    let analysis;
    try {
      analysis = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI analysis:', parseError);
      return;
    }

    // Check if profile exists
    const existingProfile = await db.getAsync(
      'SELECT id FROM ai_personality_profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfile) {
      // Update existing profile
      await db.runAsync(
        `UPDATE ai_personality_profiles 
         SET communication_style = ?, emotional_patterns = ?, common_phrases = ?, 
             personality_traits = ?, relationship_context = ?, confidence_score = ?, 
             updated_at = ?
         WHERE user_id = ?`,
        [
          analysis.communication_style,
          analysis.emotional_patterns,
          JSON.stringify(analysis.common_phrases || []),
          analysis.personality_traits,
          analysis.relationship_context,
          analysis.confidence_score,
          new Date().toISOString(),
          userId
        ]
      );
    } else {
      // Create new profile
      await db.runAsync(
        `INSERT INTO ai_personality_profiles 
         (id, user_id, communication_style, emotional_patterns, common_phrases, 
          personality_traits, relationship_context, confidence_score, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          require('uuid').v4(),
          userId,
          analysis.communication_style,
          analysis.emotional_patterns,
          JSON.stringify(analysis.common_phrases || []),
          analysis.personality_traits,
          analysis.relationship_context,
          analysis.confidence_score,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );
    }

    console.log(`✅ Personality profile updated for user ${userId}`);
  } catch (error) {
    console.error('Personality profile update error:', error);
  }
};