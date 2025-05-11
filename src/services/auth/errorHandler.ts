
import { AppError } from "@/lib/error";

// Rate limiting specific error types
export enum RateLimitErrorTypes {
  TOKEN_REFRESH = "token_refresh",
  AUTH_REQUEST = "auth_request",
  GENERAL = "general"
}

// Track rate limit hits to handle responses appropriately
const rateLimitTracking: Record<string, { count: number, lastHit: number }> = {
  [RateLimitErrorTypes.TOKEN_REFRESH]: { count: 0, lastHit: 0 },
  [RateLimitErrorTypes.AUTH_REQUEST]: { count: 0, lastHit: 0 }, 
  [RateLimitErrorTypes.GENERAL]: { count: 0, lastHit: 0 }
};

/**
 * Handle rate limit errors in a way that prevents cascading failures
 * @param errorType The type of rate limit error encountered
 * @returns Information about the rate limiting status
 */
export const handleRateLimitError = (errorType: RateLimitErrorTypes) => {
  const now = Date.now();
  const tracking = rateLimitTracking[errorType];
  
  // Reset counter if it's been more than 60 seconds since the last hit
  if (now - tracking.lastHit > 60000) {
    tracking.count = 0;
  }
  
  // Update tracking
  tracking.count++;
  tracking.lastHit = now;
  
  // Calculate backoff time based on consecutive hits
  const backoffTime = Math.min(30000, Math.pow(2, tracking.count) * 1000);
  
  // If we're getting a lot of rate limit errors, suggest more drastic action
  const isCritical = tracking.count >= 5;
  
  return {
    backoffTime,
    isCritical,
    hitCount: tracking.count,
    message: isCritical
      ? "Critical rate limiting detected. Consider refreshing the page or clearing browser data."
      : `Rate limit exceeded. Backing off for ${backoffTime/1000} seconds.` 
  };
};

/**
 * Check if an error is related to rate limiting
 */
export const isRateLimitError = (error: any): boolean => {
  if (!error) return false;
  
  // Check various ways rate limit errors might appear
  if (typeof error === 'string') {
    return error.includes('429') || error.includes('rate limit');
  }
  
  if (error instanceof Error) {
    return error.message.includes('429') || 
           error.message.includes('rate limit') ||
           error.message.includes('too many requests');
  }
  
  if (error.status === 429) return true;
  if (error.code === 429) return true;
  if (error.error?.status === 429) return true;
  if (error.message?.includes('429')) return true;
  
  return false;
};

/**
 * Create a standardized auth error from various error formats
 */
export const createAuthError = (error: any): AppError => {
  if (error instanceof AppError) return error;
  
  let message = "Authentication error";
  let statusCode = 500;
  
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error?.message) {
    message = error.message;
    if (error.status) statusCode = error.status;
  }
  
  if (isRateLimitError(error)) {
    statusCode = 429;
    message = "Too many requests. Please try again later.";
  }
  
  return new AppError(message, statusCode);
};
