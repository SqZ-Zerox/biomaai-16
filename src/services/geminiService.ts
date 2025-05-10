
import { toast } from "@/hooks/use-toast";
import { SecureKeyManager } from "./securityService";

// Gemini API configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-1.5-pro";

// Use a more reliable API key - same as what we use in the edge function
const DEFAULT_TEST_KEY = "AIzaSyDdPQCvHDo-lQfTaNZPoaziqyUiM9O8pX0";

// API Key Manager (similar to OpenAI implementation)
class APIKeyManager {
  static getApiKey(): string | null {
    return SecureKeyManager.getBestAvailableKey("gemini_api_key");
  }

  static setApiKey(key: string): void {
    if (!SecureKeyManager.validateGeminiKey(key)) {
      toast({
        title: "Invalid API Key",
        description: "The Gemini API key format is invalid",
        variant: "destructive",
      });
      return;
    }
    
    SecureKeyManager.setKey("gemini_api_key", key);
  }

  static clearApiKey(): void {
    SecureKeyManager.removeKey("gemini_api_key");
  }

  static hasApiKey(): boolean {
    return SecureKeyManager.hasKey("gemini_api_key");
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
    apiKey = DEFAULT_TEST_KEY; // Default to the test key
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
          maxOutputTokens: options.maxOutputTokens || 4000,
          topP: 0.95,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `Failed to get response from Gemini (Status: ${response.status})`;
      
      // Handle quota errors specifically with a more user-friendly message
      if (errorMessage.includes("quota") || response.status === 429) {
        toast({
          title: "Gemini API Rate Limit Reached",
          description: "You've reached the API rate limit. Our system will use a fallback analysis method. For the best experience, you may want to use your own API key in Settings.",
          variant: "warning",
          duration: 8000,
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
    console.error("Gemini API error:", error);
    
    // Only show toast for non-rate-limit errors (we handle those specifically above)
    if (!error.message.includes("rate limit") && !error.message.includes("quota")) {
      toast({
        title: "AI Request Failed",
        description: "Using fallback analysis method. " + (error.message || "Failed to communicate with Gemini API"),
        variant: "warning",
      });
    }
    
    return null;
  }
}

// Helper components and functions for UI interaction
export function setGeminiKey(key: string): void {
  APIKeyManager.setApiKey(key);
  toast({
    title: "Gemini API Key Saved",
    description: "Your Gemini API key has been saved securely",
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
