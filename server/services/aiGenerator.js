// server/services/aiGenerator.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function cleanGeminiResponse(text) {
  // מנקה תווים מיותרים שה-AI לפעמים מוסיף
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

// 1. יצירת רשימת מילים יומית
export const generateDailyWordList = async () => {
  const prompt = `
    Generate a JSON list of 10 English words for an Israeli student preparing for the "Amirnet" exam.
    - 5 words should be "General" (Upper Intermediate).
    - 5 words should be "Academic" (Advanced).
    
    Output JSON strictly (Array of objects):
    [
      { "term": "diligent", "translation": "חרוץ", "level": "advanced", "definition": "Having or showing care and conscientiousness in one's work." },
      ...
    ]
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const text = cleanGeminiResponse(result.response.text());
    return JSON.parse(text);
  } catch (e) {
    console.error("AI Word Error:", e);
    // החזרת רשימת חירום במקרה של תקלה כדי שהאתר לא יקרוס
    return [{ term: "error", translation: "שגיאה", level: "basic", definition: "Try again later" }];
  }
};

// 2. יצירת סיפור עם הקשר
// server/services/aiGenerator.js


export const generateStoryWithContext = async (wordsArray) => {
  const wordsString = wordsArray.map(w => w.term).join(', ');
  
  const prompt = `
    Write a SHORT, academic-style text (approx 100 words) suitable for Amirnet exam prep.
    You MUST naturally use these words: [${wordsString}].

    Output JSON strictly in this structure:
    {
      "title": "Title of the text",
      "sentences": [
         { "english": "First sentence of the story using a word.", "hebrew": "תרגום מלא של המשפט הראשון לעברית." },
         { "english": "Second sentence...", "hebrew": "תרגום של המשפט השני..." }
      ],
      "glossary": [
         { "word": "difficult word", "translation": "hebrew translation" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    // ... (rest of the cleaning logic)
    return JSON.parse(text);
  } catch (e) {
    console.error("AI Story Error:", e);
    return { title: "Error", sentences: [], glossary: [] };
  }
};