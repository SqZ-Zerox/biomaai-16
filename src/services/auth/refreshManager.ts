
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Constants for rate limit handling
const RATE_LIMIT_ERRORS = [
  "too many requests",
  "rate limit",
  "timeout",
  "too_many_attempts",
  "429"
];

// Track rate limit status
let isRateLimited = false;
let rateLimitResetTime = 0;
let consecutiveErrors = 0;
let lastErrorTime = 0;
const ERROR_THRESHOLD = 3; // Number of errors before triggering protection
const ERROR_WINDOW = 10000; // Time window in ms (10 seconds)
const DEFAULT_BACKOFF = 30000; // Default backoff time in ms (30 seconds)

/**
 * Handles token refresh with rate limiting protection
 */
export const refreshToken = async () => {
  try {
    // Check if we're currently rate limited
    if (isRateLimited) {
      const now = Date.now();
      if (now < rateLimitResetTime) {
        // Still in backoff period, don't attempt refresh
        console.log(`Rate limit in effect. Try again in ${Math.ceil((rateLimitResetTime - now) / 1000)}s`);
        return { error: { message: "Rate limited", isRateLimit: true } };
      } else {
        // Backoff period has passed, reset rate limit state
        isRateLimited = false;
        consecutiveErrors = 0;
      }
    }

    // Check for error burst pattern
    const now = Date.now();
    if (now - lastErrorTime > ERROR_WINDOW) {
      // Reset error count if outside window
      consecutiveErrors = 0;
    }

    // Attempt to refresh the session
    const { data, error } = await supabase.auth.refreshSession();
    
    // Reset error tracking on success
    if (!error) {
      consecutiveErrors = 0;
      return { data, error: null };
    }
    
    // Handle potential rate limit error
    lastErrorTime = Date.now();
    consecutiveErrors++;
    
    // Check if this is a rate limit error
    const isRateLimitError = RATE_LIMIT_ERRORS.some(text => 
      error.message?.toLowerCase().includes(text)
    );
    
    // Implement circuit breaker
    if (isRateLimitError || consecutiveErrors >= ERROR_THRESHOLD) {
      // Calculate backoff time - exponential backoff based on consecutive errors
      const backoffTime = isRateLimitError ? DEFAULT_BACKOFF : Math.min(DEFAULT_BACKOFF * (2 ** (consecutiveErrors - ERROR_THRESHOLD)), 300000);
      
      isRateLimited = true;
      rateLimitResetTime = Date.now() + backoffTime;
      
      // Show toast message only once when we hit rate limit
      if (consecutiveErrors === ERROR_THRESHOLD || isRateLimitError) {
        toast({ 
          title: "Rate limit detected", 
          description: `Too many auth requests. Please wait ${Math.ceil(backoffTime/1000)} seconds.`,
          variant: "warning"
        });
      }
      
      console.warn(`Rate limit activated. Backoff for ${backoffTime}ms due to ${isRateLimitError ? 'explicit rate limit' : 'error burst pattern'}`);
      
      // Return error with rate limit flag
      return { 
        error: { 
          ...error, 
          isRateLimit: true,
          backoffMs: backoffTime,
          retryAfter: new Date(rateLimitResetTime)
        } 
      };
    }
    
    // Return normal error
    return { error };
  } catch (unexpectedError) {
    console.error("Unexpected error in refresh token:", unexpectedError);
    
    // Increment consecutive error count
    lastErrorTime = Date.now();
    consecutiveErrors++;
    
    return { 
      error: {
        message: "Unexpected error during token refresh",
        originalError: unexpectedError
      }
    };
  }
};

/**
 * Gets information about the current rate limit status
 */
export const getRateLimitStatus = () => {
  if (!isRateLimited) return { isRateLimited: false };
  
  const now = Date.now();
  const remainingMs = Math.max(0, rateLimitResetTime - now);
  const remainingSec = Math.ceil(remainingMs / 1000);
  
  return {
    isRateLimited,
    remainingMs,
    remainingSec,
    resetTime: new Date(rateLimitResetTime)
  };
};

/**
 * Reset rate limit status manually if needed
 */
export const resetRateLimit = () => {
  isRateLimited = false;
  consecutiveErrors = 0;
  rateLimitResetTime = 0;
  
  return { success: true };
};
