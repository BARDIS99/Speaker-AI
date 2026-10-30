export const PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-3.8-flash',
    supportsImages: true,
    supportsStreaming: true,
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    model: 'llama-3.3-70b-versatile',
    supportsImages: false,
    supportsStreaming: true,
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    supportsImages: false,
    supportsStreaming: true,
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    model: 'mistral-small-latest',
    supportsImages: false,
    supportsStreaming: true,
  },
};

export const PERSONAS = {
  default: {
    id: 'default',
    name: 'Default Assistant',
    system: 'You are a helpful, accurate, and concise AI assistant. Provide clear and useful responses.',
  },
  tutor: {
    id: 'tutor',
    name: 'Tutor',
    system: 'You are an expert tutor. Explain concepts clearly, step by step. Use simple language, examples, and check understanding. Encourage questions.',
  },
  coding: {
    id: 'coding',
    name: 'Coding Helper',
    system: 'You are an expert software engineer. Help with programming, debugging, architecture, and best practices. Provide clean, well-commented code. Explain trade-offs.',
  },
  business: {
    id: 'business',
    name: 'Business Advisor',
    system: 'You are a seasoned business advisor. Help with strategy, planning, market analysis, operations, and decision-making. Be practical and data-driven.',
  },
  writing: {
    id: 'writing',
    name: 'Writing Coach',
    system: 'You are an expert writing coach. Help improve clarity, structure, style, grammar, and impact. Provide constructive feedback and rewrites when asked.',
  },
};
