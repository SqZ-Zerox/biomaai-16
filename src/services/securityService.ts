

import { toast } from "@/hooks/use-toast";

/**
 * Secure API Key Management System
 * Handles encryption, storage, and validation of API keys
 */
export class SecureKeyManager {
  private static encryptKey(key: string): string {
    // Simple obfuscation - in a production environment, 
    // consider using more robust encryption methods
    return btoa(`secure-prefix:${key}`);
  }
  
  private static decryptKey(encryptedKey: string): string {
    try {
      const decoded = atob(encryptedKey);
      return decoded.replace('secure-prefix:', '');
    } catch (error) {
      console.error("Error decrypting key:", error);
      return '';
    }
  }

  static getKey(keyName: string): string | null {
    const encryptedKey = localStorage.getItem(keyName);
    if (!encryptedKey) return null;
    
    return this.decryptKey(encryptedKey);
  }

  static setKey(keyName: string, key: string): void {
    const encryptedKey = this.encryptKey(key);
    localStorage.setItem(keyName, encryptedKey);
  }

  static removeKey(keyName: string): void {
    localStorage.removeItem(keyName);
  }

  static hasKey(keyName: string): boolean {
    return Boolean(localStorage.getItem(keyName));
  }

  static validateGeminiKey(key: string): boolean {
    // Basic validation for Gemini API key format (starts with "AIza")
    return typeof key === 'string' && key.startsWith('AIza');
  }
  
  static getBestAvailableKey(keyName: string, defaultKey?: string): string | null {
    // Try to get the user's configured key first
    const userKey = this.getKey(keyName);
    if (userKey) return userKey;
    
    // If user hasn't set a key, use the default if provided
    if (defaultKey) return defaultKey;
    
    // No keys available
    return null;
  }
}

/**
 * Enhanced hCaptcha verification service
 */
export const CaptchaVerificationService = {
  /**
   * Verify a captcha token against expected parameters
   */
  validateToken: (token: string | null): boolean => {
    if (!token) return false;
    
    // Basic validation - token should be a non-empty string
    // In production, you should verify this token with hCaptcha's API
    return typeof token === 'string' && token.length > 10;
  },
  
  /**
   * Get the appropriate sitekey based on environment
   */
  getSiteKey: (): string => {
    // Using import.meta.env instead of process.env for Vite
    const configuredKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
    
    // Return configured key or fallback to test key
    return configuredKey || "10000000-ffff-ffff-ffff-000000000001";
  }
};

