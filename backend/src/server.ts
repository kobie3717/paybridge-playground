import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { config } from './config.js';
import { demoRouter } from './routes/demo.js';
import { healthRouter } from './routes/health.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));

app.use('/api/health', healthRouter);
app.use('/api/demo', demoRouter);

const frontendDist = path.resolve(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`paybridge-playground listening on :${config.port}`);
});
