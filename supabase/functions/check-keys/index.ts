// Supabase Edge Function: check-keys
// Tests API keys stored on the server and returns { gemini, groq, openrouter, mistral } status
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function checkGemini(key: string | undefined): Promise<string> {
  if (!key || !key.trim()) return "missing";
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${encodeURIComponent(key)}`
    );
    return res.ok ? "active" : "inactive";
  } catch {
    return "inactive";
  }
}

async function checkGroq(key: string | undefined): Promise<string> {
  if (!key || !key.trim()) return "missing";
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    return res.ok ? "active" : "inactive";
  } catch {
    return "inactive";
  }
}

async function checkOpenRouter(key: string | undefined): Promise<string> {
  if (!key || !key.trim()) return "missing";
  try {
    const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
      headers: { Authorization: `Bearer ${key}` },
    });
    return res.ok ? "active" : "inactive";
  } catch {
    return "inactive";
  }
}

async function checkMistral(key: string | undefined): Promise<string> {
  if (!key || !key.trim()) return "missing";
  try {
    const res = await fetch("https://api.mistral.ai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    return res.ok ? "active" : "inactive";
  } catch {
    return "inactive";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  const groqKey = Deno.env.get("GROQ_API_KEY");
  const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
  const mistralKey = Deno.env.get("MISTRAL_API_KEY");

  const [gemini, groq, openrouter, mistral] = await Promise.all([
    checkGemini(geminiKey),
    checkGroq(groqKey),
    checkOpenRouter(openrouterKey),
    checkMistral(mistralKey),
  ]);

  const result = {
    gemini,
    groq,
    openrouter,
    mistral,
  };

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
