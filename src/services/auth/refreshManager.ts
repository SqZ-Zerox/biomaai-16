
import { supabase } from "@/integrations/supabase/client";
import { clearAuthCache } from "./sessionManagement";

// Rate limiting configuration
const MAX_ATTEMPTS = 3; // Maximum number of refresh attempts
const COOL_DOWN_PERIOD = 60 * 60; // 1 hour cooldown period in seconds

// State to track refresh attempts and last error
let refreshAttempts = 0;
let lastErrorTime: number | null = null;

/**
 * Refreshes the user session using the refresh token.
 * @returns {Promise<boolean>} - True if the session was refreshed successfully, false otherwise.
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    // Check if rate limit has been exceeded
    if (isRateLimited()) {
      console.warn("Session refresh is rate limited.");
      return false;
    }

    // Attempt to refresh the session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      // Handle refresh error
      console.error("Error refreshing session:", error);
      handleRateLimitError(error);
      return false;
    }

    if (data) {
      // Reset refresh attempts on success
      resetRefreshAttempts();
      console.log("Session refreshed successfully.");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Unexpected error refreshing session:", error);
    handleRateLimitError(error as Error);
    return false;
  }
};

/**
 * Checks if the session refresh is currently rate limited.
 * @returns {boolean} - True if rate limited, false otherwise.
 */
const isRateLimited = (): boolean => {
  if (refreshAttempts >= MAX_ATTEMPTS && lastErrorTime) {
    const timeSinceLastError = (Date.now() - lastErrorTime) / 1000;
    return timeSinceLastError < COOL_DOWN_PERIOD;
  }
  return false;
};

/**
 * Handles rate limit errors by incrementing the attempt count and setting the last error time.
 * @param {Error} error - The error that occurred during session refresh.
 */
export const handleRateLimitError = (error: Error) => {
  refreshAttempts++;
  lastErrorTime = Date.now();

  // Log the error and current state
  console.error("Rate limit error:", error, "Attempts:", refreshAttempts);

  // If max attempts reached, clear auth cache to prevent further attempts
  if (refreshAttempts >= MAX_ATTEMPTS) {
    console.warn("Max refresh attempts reached. Clearing auth cache.");
    clearAuthCache();
  }
};

/**
 * Resets the refresh attempt count and last error time.
 * This should be called after a successful refresh or when the user logs in again.
 */
export const resetRefreshAttempts = () => {
  refreshAttempts = 0;
  lastErrorTime = null;
  console.log("Refresh attempts reset.");
};

/**
 * Resets the refresh state, clearing any tracking variables
 */
export const resetRefreshState = () => {
  // Reset any state related to refresh operations
  resetRefreshAttempts();
  
  // Clear any cached data that might affect refresh operations
  // This ensures we start with a clean slate
  clearSessionCache();
  console.log("Auth refresh state reset");
};

// Add a clearSessionCache helper if it doesn't exist
const clearSessionCache = () => {
  // Clear any local session cache used by refreshManager
  // This should be implemented according to how your caching works
  try {
    // Remove any session-related items from local storage or other caches
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
  } catch (error) {
    console.error("Failed to clear session cache:", error);
  }
};
