import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { dbStore } from '../services/store.js';
import { apiResponse } from '../utils/apiResponse.js';

export const AuthController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password) {
        return apiResponse(res, 400, false, 'Name, email, and password are required');
      }

      const lowerEmail = email.toLowerCase();
      if (dbStore.users.has(lowerEmail)) {
        return apiResponse(res, 409, false, 'An account with this email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: lowerEmail,
        phone: phone || '',
        passwordHash,
        role: 'member',
        createdAt: new Date().toISOString(),
      };

      dbStore.users.set(lowerEmail, newUser);

      const token = jwt.sign(
        { _id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_EXPIRES_IN }
      );

      const { passwordHash: _, ...userSafe } = newUser;
      return apiResponse(res, 201, true, 'User registered successfully', {
        user: userSafe,
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return apiResponse(res, 400, false, 'Email and password are required');
      }

      const lowerEmail = email.toLowerCase();
      const user = dbStore.users.get(lowerEmail);

      if (!user) {
        return apiResponse(res, 401, false, 'Invalid email or password');
      }

      // Check password (supports bcrypt hash or demo plaintext)
      let isMatch = false;
      if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.passwordHash);
      } else {
        isMatch = password === user.passwordHash;
      }

      if (!isMatch) {
        return apiResponse(res, 401, false, 'Invalid email or password');
      }

      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role, name: user.name },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_EXPIRES_IN }
      );

      const { passwordHash: _, ...userSafe } = user;
      return apiResponse(res, 200, true, 'Login successful', {
        user: userSafe,
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res) => {
    return apiResponse(res, 200, true, 'Logged out successfully');
  },

  getMe: async (req, res) => {
    if (!req.user) {
      return apiResponse(res, 401, false, 'Not authenticated');
    }
    const user = dbStore.users.get(req.user.email?.toLowerCase());
    if (user) {
      const { passwordHash: _, ...userSafe } = user;
      return apiResponse(res, 200, true, 'Profile fetched', { user: userSafe });
    }
    return apiResponse(res, 200, true, 'Profile fetched', { user: req.user });
  },
};
