import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  try {
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    req.supabase = supabase;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
