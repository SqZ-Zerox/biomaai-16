
import { toast } from "@/hooks/use-toast";

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o";

// Types for OpenAI API
export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAICompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Create a class to manage the API key
class APIKeyManager {
  private static apiKey: string | null = null;

  static getApiKey(): string | null {
    // Try to get from memory first
    if (this.apiKey) return this.apiKey;
    
    // Try to get from localStorage
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      this.apiKey = savedKey;
      return savedKey;
    }
    
    return null;
  }

  static setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem("openai_api_key", key);
  }

  static clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem("openai_api_key");
  }

  static hasApiKey(): boolean {
    return !!this.getApiKey();
  }
}

// OpenAI service functions
export async function sendChatCompletion(
  messages: OpenAIMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<OpenAIMessage | null> {
  const apiKey = APIKeyManager.getApiKey();
  
  if (!apiKey) {
    toast({
      title: "API Key Missing",
      description: "Please set your OpenAI API key in settings",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model || DEFAULT_MODEL,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from OpenAI");
    }
    
    const data: OpenAICompletionResponse = await response.json();
    return data.choices[0].message;
  } catch (error: any) {
    toast({
      title: "AI Request Failed",
      description: error.message || "Failed to communicate with OpenAI API",
      variant: "destructive",
    });
    return null;
  }
}

// Helper components and functions for UI interaction
export function setOpenAIKey(key: string): void {
  APIKeyManager.setApiKey(key);
  toast({
    title: "API Key Saved",
    description: "Your OpenAI API key has been saved",
  });
}

export function hasOpenAIKey(): boolean {
  return APIKeyManager.hasApiKey();
}

export function clearOpenAIKey(): void {
  APIKeyManager.clearApiKey();
  toast({
    title: "API Key Removed",
    description: "Your OpenAI API key has been removed",
  });
}
