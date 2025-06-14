import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Create anonymous session
router.post('/anonymous', async (req, res) => {
  try {
    const userId = uuidv4();
    
    await db.runAsync(
      'INSERT INTO users (id, is_anonymous, created_at) VALUES (?, ?, ?)',
      [userId, 1, new Date().toISOString()]
    );

    const token = generateToken(userId);

    res.status(201).json({
      message: 'Anonymous session created',
      token,
      user: {
        id: userId,
        isAnonymous: true
      }
    });
  } catch (error) {
    console.error('Anonymous session creation error:', error);
    res.status(500).json({ error: 'Failed to create anonymous session' });
  }
});

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('username').optional().isLength({ min: 2, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    await db.runAsync(
      'INSERT INTO users (id, email, password_hash, username, is_anonymous, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, username || null, 0, new Date().toISOString()]
    );

    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        username,
        isAnonymous: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Get user
    const user = await db.getAsync(
      'SELECT id, email, password_hash, username, is_active FROM users WHERE email = ? AND is_anonymous = 0',
      [email]
    );

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.runAsync(
      'UPDATE users SET last_login = ? WHERE id = ?',
      [new Date().toISOString(), user.id]
    );

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAnonymous: false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Convert anonymous to registered user
router.post('/convert', authenticateToken, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').optional().isLength({ min: 2, max: 50 })
], async (req, res) => {
  try {
    if (!req.user.is_anonymous) {
      return res.status(400).json({ error: 'User is already registered' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    // Check if email already exists
    const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user
    await db.runAsync(
      'UPDATE users SET email = ?, password_hash = ?, username = ?, is_anonymous = 0, updated_at = ? WHERE id = ?',
      [email, passwordHash, username || null, new Date().toISOString(), req.user.id]
    );

    res.json({
      message: 'Account converted successfully',
      user: {
        id: req.user.id,
        email,
        username,
        isAnonymous: false
      }
    });
  } catch (error) {
    console.error('Account conversion error:', error);
    res.status(500).json({ error: 'Account conversion failed' });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      isAnonymous: req.user.is_anonymous
    }
  });
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;