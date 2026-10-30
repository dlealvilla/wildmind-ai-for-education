import type { AIProvider } from './types';

class APIAIProvider implements AIProvider {
  async generateResponse(prompt: string, chatHistory: Array<{ role: string; content: string }>): Promise<string> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        chatHistory,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (typeof data?.error === 'string' && data.error) ||
        (typeof data?.message === 'string' && data.message) ||
        'The AI assistant is temporarily unavailable. Please try again in a moment.';
      throw new Error(message);
    }

    if (typeof data?.response !== 'string' || !data.response.trim()) {
      throw new Error('The AI assistant returned an empty response. Please try again.');
    }

    return data.response;
  }
}

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }
  providerInstance = new APIAIProvider();
  return providerInstance;
}
