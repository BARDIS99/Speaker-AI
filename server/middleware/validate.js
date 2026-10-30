import { z } from 'zod';

const chatSchema = z.object({
  provider: z.enum(['gemini', 'groq', 'openrouter', 'mistral']),
  persona: z.enum(['default', 'tutor', 'coding', 'business', 'writing']).default('default'),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1).max(100000),
    })
  ).min(1).max(100),
  chatId: z.string().uuid().optional(),
  compare: z.boolean().optional(),
});

export function validateChat(req, res, next) {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid request', details: result.error.flatten() });
  }
  req.validated = result.data;
  next();
}
