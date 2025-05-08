
import { setOpenAIKey } from "./openaiService";
import { setGeminiKey } from "./geminiService";

/**
 * Initialize API keys that the user has provided
 * This is called on app startup to ensure API keys are available
 */
export const initializeAPIKeys = () => {
  // Set the OpenAI API key if not already set
  // In production, this should be stored in Supabase secrets or environment variables
  const DEFAULT_OPENAI_KEY = "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";
  
  // Set the key if it's not already set
  if (localStorage.getItem("openai_api_key") === null) {
    setOpenAIKey(DEFAULT_OPENAI_KEY);
    console.log("OpenAI API key initialized automatically");
  }
  
  // Set the Gemini API key if not already set
  const DEFAULT_GEMINI_KEY = "AIzaSyBaXu3nq5i_WJ0cw7P6Itk-FCNyj_JmYJU";
  
  // Set the key if it's not already set
  if (localStorage.getItem("gemini_api_key") === null) {
    setGeminiKey(DEFAULT_GEMINI_KEY);
    console.log("Gemini API key initialized automatically");
  }
};
