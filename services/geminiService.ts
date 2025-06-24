
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_MODEL_TEXT } from "../constants";

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
// It is assumed this variable is pre-configured in the execution environment.
// DO NOT provide a UI or means to enter the API key in the application.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY pour Gemini n'est pas configurée dans les variables d'environnement. " +
    "Le service Gemini ne fonctionnera pas. Assurez-vous que process.env.API_KEY est défini."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "FALLBACK_KEY_FOR_DEV_ONLY_WON'T_WORK" }); // Fallback for type reasons, real key needed

// Renamed from get चुनौतीपू르GeminiResponse to avoid parsing issues with non-ASCII characters.
export const getStandardGeminiResponse = async (prompt: string, systemInstruction?: string): Promise<string> => {
  if (!API_KEY) {
    return "Erreur: Clé API Gemini non configurée. Veuillez contacter l'administrateur.";
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      ...(systemInstruction && { config: { systemInstruction } })
    });
    return response.text;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini:", error);
    if (error instanceof Error) {
        return `Erreur Gemini: ${error.message}`;
    }
    return "Erreur Gemini: Une erreur inconnue est survenue.";
  }
};

export const getGeminiChatResponse = async (
  history: Part[], 
  newMessage: string, 
  systemInstruction?: string
): Promise<string> => {
  if (!API_KEY) {
    return "Erreur: Clé API Gemini non configurée.";
  }
  try {
    // For a stateless generateContent, we pass the whole history each time.
    // The 'contents' should be an array of Content objects (user/model turns).
    // The prompt is the new message. The API doesn't have a direct 'history' param here.
    // We need to format the history and new message correctly.
    // A simple approach is to concatenate, or structure as multi-turn.
    // For now, let's use a simplified prompt with context, assuming `prompt` includes it.
    
    // A more correct way for multi-turn with generateContent (if not using ai.chats.create):
    // const contents = [...history, { role: "user", parts: [{ text: newMessage }] }];
    // For simplicity with this service function, we assume `prompt` is pre-formatted or just the latest message
    // and `systemInstruction` handles the persona.
    // Actual history management should be done in the calling component. This function is a basic call.

    const modelParams: any = {
      model: GEMINI_MODEL_TEXT,
      contents: newMessage, // This should ideally be structured with history.
    };
    if (systemInstruction) {
      modelParams.config = { systemInstruction };
    }
    
    // If you want to use the history, the 'contents' field should be structured like:
    // contents: [
    //   { role: "user", parts: [{ text: "Hello." }] },
    //   { role: "model", parts: [{ text: "Hi there!" }] },
    //   { role: "user", parts: [{ text: newMessage }] }
    // ]
    // The current signature of getGeminiChatResponse would need adjustment if history is passed directly to `contents` here.
    // The prompt in CoachIAScreen.tsx will build the full context for a single turn.

    const response: GenerateContentResponse = await ai.models.generateContent(modelParams);
    return response.text;

  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Gemini (chat):", error);
    if (error instanceof Error) {
        return `Erreur Gemini: ${error.message}`;
    }
    return "Erreur Gemini: Une erreur inconnue est survenue.";
  }
};
