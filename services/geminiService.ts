const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Note: Using the stream-generating endpoint with Server-Sent Events
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${API_KEY}`;

interface Content {
  parts: { text: string }[];
  role: 'user' | 'model';
}

interface GenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

interface SafetySetting {
    category: string;
    threshold: string;
}

interface SystemInstruction {
    parts: { text: string }[];
}

export const getGeminiChatResponseStream = async (
  history: Content[],
  systemInstruction: SystemInstruction | undefined,
  generationConfig: GenerationConfig | undefined,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> => {
  if (!API_KEY) {
    onError("Erreur: La clé API Gemini n'est pas configurée.");
    onComplete();
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        contents: history,
        system_instruction: systemInstruction,
        generation_config: generationConfig,
       }),
    });

    if (!response.ok || !response.body) {
      const errorData = await response.json();
      console.error("Erreur de l'API Gemini:", errorData);
      throw new Error(errorData.error.message || `Erreur HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      
      // The response is a stream of JSON objects, sometimes multiple in one chunk, prefixed with "data: ".
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last, possibly incomplete, line

      for (const line of lines) {
        const trimmedLine = line.trim().replace(/^data: /, '');
        if (!trimmedLine) continue; // Skip empty lines (like keep-alives)

        try {
          const parsed = JSON.parse(trimmedLine);
          if (parsed.candidates && parsed.candidates[0].content.parts[0].text) {
            onChunk(parsed.candidates[0].content.parts[0].text);
          }
        } catch (e) {
          console.warn("Could not parse JSON chunk:", trimmedLine);
        }
      }
    }

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini (stream):", error);
    if (error instanceof Error) {
      onError(`Erreur Gemini: ${error.message}`);
    } else {
      onError("Erreur Gemini: Une erreur inconnue est survenue.");
    }
  } finally {
    onComplete();
  }
};
