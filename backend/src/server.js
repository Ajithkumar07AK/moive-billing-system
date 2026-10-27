import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

async function startServer() {
  await connectDB();

  const PORT = ENV.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🎬 Infinity Cinema Backend running on http://localhost:${PORT}`);
  });
}

startServer();
