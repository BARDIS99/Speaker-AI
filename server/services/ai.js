import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import { PROVIDERS, PERSONAS } from '../config/providers.js';

function getSystemPrompt(personaId) {
  return PERSONAS[personaId]?.system || PERSONAS.default.system;
}

async function* streamGemini(messages, personaId, signal) {
  const apiKey = config.keys.gemini || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');
  const ai = new GoogleGenAI({ apiKey });
  const system = getSystemPrompt(personaId);

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const responseStream = await ai.models.generateContentStream({
    model: PROVIDERS.gemini.model,
    contents,
    config: {
      systemInstruction: system,
    },
  });

  for await (const chunk of responseStream) {
    if (signal?.aborted) break;
    const text = chunk.text;
    if (text) yield text;
  }
}

async function* streamOpenAICompatible(baseUrl, apiKey, model, messages, personaId, signal, extraHeaders = {}) {
  if (!apiKey) throw new Error('API key not configured');
  const system = getSystemPrompt(personaId);
  const body = {
    model,
    messages: [{ role: 'system', content: system }, ...messages.map((m) => ({ role: m.role, content: m.content }))],
    stream: true,
  };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Provider error ${res.status}: ${err.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {}
    }
  }
}

export async function* streamChat({ provider, messages, personaId, signal }) {
  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Unknown provider: ${provider}`);

  switch (provider) {
    case 'gemini':
      yield* streamGemini(messages, personaId, signal);
      break;
    case 'groq':
      yield* streamOpenAICompatible(
        'https://api.groq.com/openai/v1',
        config.keys.groq,
        p.model,
        messages,
        personaId,
        signal
      );
      break;
    case 'openrouter':
      yield* streamOpenAICompatible(
        'https://openrouter.ai/api/v1',
        config.keys.openrouter,
        p.model,
        messages,
        personaId,
        signal,
        { 'HTTP-Referer': 'https://speaker-ai.local', 'X-Title': 'Speaker AI' }
      );
      break;
    case 'mistral':
      yield* streamOpenAICompatible(
        'https://api.mistral.ai/v1',
        config.keys.mistral,
        p.model,
        messages,
        personaId,
        signal
      );
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export function getAvailableModels() {
  const geminiKey = config.keys.gemini || process.env.GEMINI_API_KEY;
  return Object.values(PROVIDERS).map((p) => ({
    id: p.id,
    name: p.name,
    model: p.model,
    supportsImages: p.supportsImages,
    available: p.id === 'gemini' ? !!geminiKey : !!config.keys[p.id],
  }));
}
