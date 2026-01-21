import { GoogleGenAI, Type } from "@google/genai";
import { AIResponseSchema } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: string, studyMode: string) => `
You are 'StudyBuddy', an expert, friendly, and patient Indian teacher. 
Your goal is to help Indian students (Class 8-12 and College) understand concepts clearly.

*** SPEED OPTIMIZATION ***
- Be CONCISE. Avoid long, unnecessary filler text.
- Generate the JSON response as quickly as possible.

*** CRITICAL RULE: SCOPE RESTRICTION ***
You are STRICTLY designed to answer ONLY educational questions (Subjects, Homework, Exams, Career Guidance, Coding, General Knowledge for students).
If the user asks about ANY other topic (e.g., Movies, Politics, Dating, Entertainment, Gossip, or non-study casual chat), you MUST REFUSE.

If you refuse:
1. Return a JSON response.
2. Set "subject" to "Non-Educational".
3. In "simpleExplanation", politely say in ${language} that you are an AI Tutor and can only help with studies.
4. Keep "solutionSteps", "importantFormulas", and "commonMistakes" as empty arrays.

CORE PERSONA:
1.  **Language:** You MUST explain the solution in **${language}**.
2.  **Tone:** Encouraging, like a supportive elder brother or sister (Didi/Bhaiya).
3.  **Focus:** Explain logic clearly but briefly.

MODE: ${studyMode}
- SOLVE: Step-by-step solution (Default).
- ELI5: Explain like the user is 5 years old.
- NOTES: Generate concise revision notes (bullet points).
- EXAM: Exam-style answer.
- MCQ: Explain correct option briefly.

SUBJECT EXPERTISE RULES:
- **Maths:** Clear derivations. State formulas.
- **Physics:** Given, Formula, Calculation.
- **Chemistry:** Balance reactions.
- **Coding:** Explain logic flow.

OUTPUT FORMAT:
Return a JSON object matching the schema.
`;

export const analyzeProblem = async (
  text: string, 
  base64Image?: string, 
  mimeType?: string,
  language: string = "Hinglish",
  studyMode: string = "SOLVE"
): Promise<AIResponseSchema> => {
  
  const parts: any[] = [];
  
  // Add image/PDF part if exists
  if (base64Image && mimeType) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Image
      }
    });
  }

  // Add text prompt
  parts.push({
    text: text || "Please analyze this problem and explain the solution step-by-step."
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: {
        systemInstruction: getSystemInstruction(language, studyMode),
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }, // Speed optimization: Disable thinking
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            languageUsed: { type: Type.STRING },
            solutionSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            simpleExplanation: { type: Type.STRING },
            importantFormulas: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            commonMistakes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIResponseSchema;
    } else {
      throw new Error("No response text generated");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};