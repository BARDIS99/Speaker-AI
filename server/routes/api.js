import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { validateChat } from '../middleware/validate.js';
import { streamChat, getAvailableModels, checkAllKeys } from '../services/ai.js';
import { PROVIDERS } from '../config/providers.js';

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Rate limit exceeded. Please wait a moment.' },
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/models', (req, res) => {
  res.json({ models: getAvailableModels() });
});

router.get('/check-keys', async (req, res) => {
  try {
    const statuses = await checkAllKeys();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to check keys' });
  }
});

router.post('/chat', requireAuth, chatLimiter, validateChat, async (req, res) => {
  const { provider, persona, messages, compare } = req.validated;
  const controller = new AbortController();

  req.on('close', () => controller.abort());

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    if (compare) {
      const providers = Object.keys(PROVIDERS).filter((p) => getAvailableModels().find((m) => m.id === p && m.available));
      for (const p of providers) {
        send('provider_start', { provider: p });
        try {
          let full = '';
          for await (const chunk of streamChat({ provider: p, messages, personaId: persona, signal: controller.signal })) {
            full += chunk;
            send('chunk', { provider: p, content: chunk });
          }
          send('provider_done', { provider: p, content: full });
        } catch (err) {
          send('provider_error', { provider: p, error: err.message });
        }
      }
      send('done', {});
    } else {
      let full = '';
      try {
        for await (const chunk of streamChat({ provider, messages, personaId: persona, signal: controller.signal })) {
          full += chunk;
          send('chunk', { content: chunk });
        }
        send('done', { content: full, provider });
      } catch (err) {
        if (err.name === 'AbortError') {
          send('aborted', {});
        } else {
          // Simple fallback attempt
          const fallbacks = Object.keys(PROVIDERS).filter((p) => p !== provider && getAvailableModels().find((m) => m.id === p && m.available));
          if (fallbacks.length > 0) {
            const fb = fallbacks[0];
            send('fallback', { from: provider, to: fb, reason: err.message });
            let fullFb = '';
            for await (const chunk of streamChat({ provider: fb, messages, personaId: persona, signal: controller.signal })) {
              fullFb += chunk;
              send('chunk', { content: chunk });
            }
            send('done', { content: fullFb, provider: fb });
          } else {
            send('error', { error: err.message });
          }
        }
      }
    }
  } catch (err) {
    send('error', { error: err.message || 'Internal error' });
  } finally {
    res.end();
  }
});

export default router;
