
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Track rate limit and backoff state
interface RateLimitState {
  isRateLimited: boolean;
  attemptCount: number;
  nextAllowedTime: number | null;
  lastErrorTime: number | null;
}

// Initialize rate limit tracking
const rateLimitState: RateLimitState = {
  isRateLimited: false,
  attemptCount: 0,
  nextAllowedTime: null,
  lastErrorTime: null,
};

// Calculate exponential backoff time in milliseconds
const calculateBackoff = (attemptCount: number): number => {
  // Base delay of 2 seconds with exponential increase
  // Cap at 2 minutes
  const maxDelay = 2 * 60 * 1000;
  const delay = Math.min(2000 * Math.pow(1.5, attemptCount), maxDelay);
  // Add some randomness to prevent all clients from retrying simultaneously
  return delay + (Math.random() * 1000);
};

// Check if we're currently rate limited
export const isRateLimited = (): boolean => {
  // If not currently rate limited, return false
  if (!rateLimitState.isRateLimited) return false;
  
  // If we have a next allowed time, check if it's passed
  if (rateLimitState.nextAllowedTime) {
    const now = Date.now();
    if (now > rateLimitState.nextAllowedTime) {
      // Reset rate limit state if backoff period has passed
      resetRateLimitState();
      return false;
    }
    return true;
  }
  
  return false;
};

// Reset rate limit state
export const resetRateLimitState = () => {
  rateLimitState.isRateLimited = false;
  rateLimitState.attemptCount = 0;
  rateLimitState.nextAllowedTime = null;
};

// Export the reset function for the entire refresh state
export const resetRefreshState = () => {
  resetRateLimitState();
  // Add any other refresh state resets here if needed in the future
};

// Handle a rate limit error
export const handleRateLimitError = () => {
  const now = Date.now();
  
  // Update rate limit state
  rateLimitState.isRateLimited = true;
  rateLimitState.lastErrorTime = now;
  rateLimitState.attemptCount++;
  
  // Calculate when we can try again
  const backoffTime = calculateBackoff(rateLimitState.attemptCount);
  rateLimitState.nextAllowedTime = now + backoffTime;
  
  // Show toast with retry information
  const secondsToRetry = Math.ceil(backoffTime / 1000);
  
  toast({
    title: "Rate limit exceeded",
    description: `Too many requests. Please wait ${secondsToRetry} seconds before trying again.`,
    variant: "warning",
  });
  
  return backoffTime;
};

// Get milliseconds until next allowed request
export const getTimeUntilNextAllowed = (): number | null => {
  if (!rateLimitState.nextAllowedTime) return null;
  
  const now = Date.now();
  const timeLeft = rateLimitState.nextAllowedTime - now;
  
  return timeLeft > 0 ? timeLeft : null;
};

/**
 * Refreshes the session token
 * With improved rate limit handling
 */
export const refreshSession = async () => {
  try {
    // Check if we're currently rate limited
    if (isRateLimited()) {
      console.log("Rate limited - skipping refresh attempt");
      return { data: null, error: { message: "Rate limited", status: 429 } };
    }
    
    const { data, error } = await supabase.auth.refreshSession();
    
    // If we get an error that looks like a rate limit
    if (error && (
      error.status === 429 || 
      error.message?.includes("too many requests") ||
      error.message?.includes("rate limit")
    )) {
      // Trigger rate limit handling
      handleRateLimitError();
      return { data: null, error };
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Error refreshing session:", error);
    
    // Check if this is likely a rate limit error
    if (error.message?.includes("too many requests") || 
        error.status === 429) {
      handleRateLimitError();
    }
    
    return { 
      data: null, 
      error: {
        message: error.message || "Failed to refresh session",
        status: error.status || 500
      } 
    };
  }
};
