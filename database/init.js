import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'griefguide.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

export const initializeDatabase = async () => {
  try {
    // Ensure database directory exists
    const dbDir = path.dirname(dbPath);
    await fs.mkdir(dbDir, { recursive: true });

    // Enable foreign keys
    await db.runAsync('PRAGMA foreign_keys = ON');

    // Create tables
    await createTables();
    
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const createTables = async () => {
  // Users table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      username TEXT,
      is_anonymous BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      preferences TEXT DEFAULT '{}',
      is_active BOOLEAN DEFAULT 1
    )
  `);

  // Chat sessions table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      is_anonymous BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Chat messages table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      user_id TEXT,
      message_text TEXT NOT NULL,
      is_user_message BOOLEAN NOT NULL,
      is_voice_message BOOLEAN DEFAULT 0,
      audio_url TEXT,
      ai_model TEXT,
      is_personalized BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Journal entries table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
      is_private BOOLEAN DEFAULT 1,
      tags TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Mood entries table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
      note TEXT,
      triggers TEXT DEFAULT '[]',
      coping_strategies TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Memory uploads table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS memory_uploads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      original_filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER,
      memory_type TEXT CHECK (memory_type IN ('letter', 'voice', 'chat')) NOT NULL,
      processed BOOLEAN DEFAULT 0,
      processing_status TEXT DEFAULT 'pending',
      extracted_text TEXT,
      ai_analysis TEXT,
      emotional_tone TEXT,
      communication_patterns TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // AI personality profiles table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS ai_personality_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      loved_one_name TEXT,
      communication_style TEXT,
      emotional_patterns TEXT,
      common_phrases TEXT DEFAULT '[]',
      voice_characteristics TEXT,
      personality_traits TEXT,
      relationship_context TEXT,
      confidence_score REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Creative activities table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS creative_activities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      activity_type TEXT CHECK (activity_type IN ('letter', 'art_prompt', 'candle', 'memory_capsule')) NOT NULL,
      content TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // User analytics table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS user_analytics (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_data TEXT DEFAULT '{}',
      session_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions (user_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages (session_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries (user_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries (user_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_memory_uploads_user_id ON memory_uploads (user_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_ai_personality_profiles_user_id ON ai_personality_profiles (user_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_creative_activities_user_id ON creative_activities (user_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics (user_id)');
};

export { db };