
import { toast } from "@/hooks/use-toast";

// Gemini API configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-1.5-pro";

// API Key Manager (similar to OpenAI implementation)
class APIKeyManager {
  private static apiKey: string | null = null;

  static getApiKey(): string | null {
    // Try to get from memory first
    if (this.apiKey) return this.apiKey;
    
    // Try to get from localStorage
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      this.apiKey = savedKey;
      return savedKey;
    }
    
    return null;
  }

  static setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem("gemini_api_key", key);
  }

  static clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem("gemini_api_key");
  }

  static hasApiKey(): boolean {
    return !!this.getApiKey();
  }
}

// Types for Gemini API
export interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

export interface GeminiCompletionRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
  };
}

export interface GeminiCompletionResponse {
  candidates: {
    content: {
      role: string;
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: any[];
  };
}

// Gemini service functions
export async function sendGeminiCompletion(
  messages: GeminiMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
  } = {}
): Promise<string | null> {
  let apiKey = APIKeyManager.getApiKey();
  
  // Use the provided test API key if no key is set
  if (!apiKey) {
    apiKey = "AIzaSyBaXu3nq5i_WJ0cw7P6Itk-FCNyj_JmYJU"; // Default to the test key
    setGeminiKey(apiKey); // Save it for future use
  }
  
  try {
    const model = options.model || DEFAULT_MODEL;
    const url = `${GEMINI_API_URL}/models/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxOutputTokens || 8000, // Increased from 1000 to 8000
          topP: 0.95,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `Failed to get response from Gemini (Status: ${response.status})`;
      
      // Handle quota errors specifically
      if (errorMessage.includes("quota") || response.status === 429) {
        toast({
          title: "Gemini API Rate Limit Reached",
          description: "You've reached the API rate limit. Please try again later or use your own API key in Settings.",
          variant: "destructive",
        });
      }
      
      throw new Error(errorMessage);
    }
    
    const data: GeminiCompletionResponse = await response.json();
    
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    toast({
      title: "AI Request Failed",
      description: error.message || "Failed to communicate with Gemini API",
      variant: "destructive",
    });
    console.error("Gemini API error:", error);
    return null;
  }
}

// Helper components and functions for UI interaction
export function setGeminiKey(key: string): void {
  APIKeyManager.setApiKey(key);
  toast({
    title: "Gemini API Key Saved",
    description: "Your Gemini API key has been saved",
  });
}

export function hasGeminiKey(): boolean {
  return APIKeyManager.hasApiKey();
}

export function clearGeminiKey(): void {
  APIKeyManager.clearApiKey();
  toast({
    title: "API Key Removed",
    description: "Your Gemini API key has been removed",
  });
}

// Convert between Gemini and OpenAI message formats
export function convertToGeminiMessages(openaiMessages: Array<{role: string; content: string}>): GeminiMessage[] {
  return openaiMessages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));
}

export function convertFromGeminiMessage(text: string): {role: string; content: string} {
  return {
    role: "assistant",
    content: text
  };
}
