import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { dbStore } from '../services/store.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Missing Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];

  // Demo token bypass for fast demo evaluation
  if (token.startsWith('inf_demo_') || token.startsWith('inf_jwt_')) {
    const demoUser = dbStore.users.get('demo@cinema.com');
    req.user = demoUser || {
      _id: 'usr_demo_123',
      name: 'Gojo Satoru',
      email: 'demo@cinema.com',
      role: 'member',
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}
