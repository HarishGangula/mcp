import axios from 'axios';

export async function generateWithOllama(model: string, prompt: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt,
      stream: false,
    });

    return response.data.response.trim();
  } catch (error) {
    console.error('🛑 Ollama error:', error);
    return '[Error generating response from model]';
  }
}
