import jwt from 'jsonwebtoken';
import { db } from '../database/init.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Allow anonymous access for certain routes
      if (req.path.includes('/anonymous') || req.method === 'GET') {
        req.user = { id: 'anonymous', isAnonymous: true };
        return next();
      }
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await db.getAsync(
      'SELECT id, email, username, is_anonymous, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = { id: 'anonymous', isAnonymous: true };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.getAsync(
      'SELECT id, email, username, is_anonymous, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    req.user = user || { id: 'anonymous', isAnonymous: true };
    next();
  } catch (error) {
    req.user = { id: 'anonymous', isAnonymous: true };
    next();
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user || req.user.isAnonymous) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};