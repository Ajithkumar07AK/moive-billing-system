import { ENV } from './env.js';

export async function connectDB() {
  try {
    // If running in an environment with MongoDB cluster
    if (process.env.USE_MONGOOSE === 'true') {
      const mongoose = await import('mongoose');
      await mongoose.default.connect(ENV.MONGODB_URI);
      console.log('MongoDB connected successfully:', ENV.MONGODB_URI);
      return mongoose.default.connection;
    } else {
      console.log('Infinity Cinema initialized with resilient in-memory database store.');
      return null;
    }
  } catch (err) {
    console.warn('MongoDB connection fallback to in-memory store:', err.message);
    return null;
  }
}
