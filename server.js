import express from 'express';
import { createServer as createViteServer } from 'vite';
import backendApp from './backend/src/app.js';

async function start() {
  const app = express();
  const PORT = 3000; // Dev server must run on port 3000 as per AI Studio environment constraints

  // Mount backend API routes under /api
  app.use(backendApp);

  // Mount Vite development middleware
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Infinity Cinema running at http://localhost:${PORT}`);
  });
}

start();
