export async function fetchModels() {
  const res = await fetch('/api/models');
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
}

export async function checkKeys() {
  const res = await fetch('/api/check-keys');
  if (!res.ok) throw new Error('Failed to check keys');
  return res.json();
}

export async function streamChat({ provider, persona, messages, token, onChunk, onDone, onError, onFallback, signal }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider, persona, messages }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      const lines = part.split('\n');
      let event = 'message';
      let data = '';
      for (const line of lines) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        if (line.startsWith('data:')) data = line.slice(5).trim();
      }
      if (!data) continue;
      try {
        const json = JSON.parse(data);
        if (event === 'chunk') onChunk?.(json.content);
        else if (event === 'done') onDone?.(json);
        else if (event === 'error') onError?.(json.error);
        else if (event === 'fallback') onFallback?.(json);
        else if (event === 'aborted') onDone?.({ aborted: true });
      } catch {}
    }
  }
}
