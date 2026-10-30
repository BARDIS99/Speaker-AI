import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  isProd: process.env.NODE_ENV === 'production',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  keys: {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
  },
};
