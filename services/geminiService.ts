
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateTutorResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: string }[]) => {
  if (!API_KEY) {
    return "I'm sorry, I cannot connect to my brain right now. Please ensure the API key is configured.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: [{ text: h.parts }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `You are an expert English Language Tutor at 'Study Link'. 
        Your goal is to help students with grammar, vocabulary, pronunciation tips, and writing. 
        Keep your tone encouraging, professional, and educational. 
        When explaining grammar, provide examples. 
        If asked about center policies, suggest they contact their curator.`,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "I'm processing that. Can you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! I encountered an error while thinking. Let's try again in a moment.";
  }
};
