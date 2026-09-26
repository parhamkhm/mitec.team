import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.json({ ok: true, service: 'mitec-server', time: new Date().toISOString() });
});
