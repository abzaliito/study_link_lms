
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini AI:", error);
}

export const generateTutorResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: string }[]) => {
  if (!ai) return "I'm sorry, I cannot connect to my brain right now. (API Key missing)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `You are an English Tutor. Keep responses concise and helpful.`,
      }
    });
    return response.text || "I'm processing that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating response.";
  }
};

export const generateExercisesFromContent = async (text: string): Promise<any[]> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = `
    You are an expert educational content creator. 
    Analyze the following text and generate 3 English grammar or vocabulary exercises.
    
    The output MUST be a valid JSON array.
    
    Supported types:
    1. 'multiple_choice': Needs a 'question', 'options' (array of 4 strings), and 'correctAnswer' (string).
    2. 'fill_blank': Needs 'instruction', 'textWithBlanks' (use {1}, {2} for blanks), and 'correctAnswer' (array of strings corresponding to blanks in order).

    Example JSON structure:
    [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct synonym.",
        "content": {
          "question": "What is a synonym for 'happy'?",
          "options": ["Sad", "Joyful", "Angry", "Tired"],
          "correctAnswer": "Joyful"
        },
        "points": 10
      },
      {
        "type": "fill_blank",
        "instruction": "Complete the sentence.",
        "content": {
          "textWithBlanks": "The sky is {1} and the grass is {2}.",
          "correctAnswer": ["blue", "green"]
        },
        "points": 10
      }
    ]

    Text to analyze:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [];
  }
};
