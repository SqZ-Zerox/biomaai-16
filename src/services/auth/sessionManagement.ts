
import { supabase } from "@/integrations/supabase/client";

// Track token refresh attempts to implement backoff
let refreshAttempts = 0;
let lastRefreshTime = 0;
const COOLDOWN_PERIOD = 5000; // 5 seconds minimum between refresh attempts
const MAX_REFRESH_ATTEMPTS = 5;
const SESSION_CACHE_KEY = 'bioma_auth_session_cache';
const SESSION_CACHE_TTL = 60000; // 1 minute cache TTL

/**
 * Get the current session from Supabase with caching to reduce API calls
 * @param {boolean} bypassCache - Set to true to bypass the cache and force a fresh session fetch
 */
export const getCurrentSession = async (bypassCache = false) => {
  try {
    // Check if we have a cached session that's still valid
    if (!bypassCache) {
      const cachedSessionData = localStorage.getItem(SESSION_CACHE_KEY);
      
      if (cachedSessionData) {
        try {
          const { session, timestamp } = JSON.parse(cachedSessionData);
          const now = Date.now();
          
          // Use cached session if it's still within TTL
          if (now - timestamp < SESSION_CACHE_TTL && session) {
            console.log("Using cached session");
            return session;
          }
        } catch (e) {
          // Invalid cache data, ignore and proceed with fresh fetch
          console.warn("Invalid cache data, fetching fresh session");
          localStorage.removeItem(SESSION_CACHE_KEY);
        }
      }
    } else {
      console.log("Bypassing cache for fresh session");
    }
    
    console.log("Fetching fresh session from Supabase");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting fresh session:", error);
      throw error;
    }
    
    // Cache the session with timestamp
    if (data.session) {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
        session: data.session,
        timestamp: Date.now()
      }));
      console.log("Fresh session cached");
    } else {
      console.warn("No session returned from Supabase");
    }
    
    return data.session;
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
};

/**
 * Update the user's email verification status with rate limiting and backoff
 */
export const updateUserVerificationStatus = async () => {
  try {
    const now = Date.now();
    
    // Implement cooldown to prevent excessive API calls
    if (now - lastRefreshTime < COOLDOWN_PERIOD) {
      console.log("Token refresh on cooldown, skipping request");
      return { updated: false, verified: false };
    }
    
    // Implement exponential backoff if we've had multiple attempts
    if (refreshAttempts > 0) {
      const backoffTime = Math.min(30000, Math.pow(2, refreshAttempts) * 1000); // Max 30 seconds
      if (now - lastRefreshTime < backoffTime) {
        console.log(`Backing off token refresh for ${backoffTime}ms`);
        return { updated: false, verified: false };
      }
    }
    
    // Update last refresh time and increment attempts counter
    lastRefreshTime = now;
    
    const session = await getCurrentSession(true); // Always get fresh session here
    
    if (!session) {
      return { updated: false, verified: false };
    }
    
    // Check if the user's email has been verified
    try {
      // Only refresh if we haven't exceeded max attempts
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.log(`Max refresh attempts (${MAX_REFRESH_ATTEMPTS}) reached. Using current session.`);
        const verified = session?.user?.email_confirmed_at ? true : false;
        return { updated: false, verified };
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        // Check specifically for rate limiting error
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          console.warn("Rate limit reached for token refresh, backing off");
          refreshAttempts++;
          return { updated: false, verified: session?.user?.email_confirmed_at ? true : false };
        }
        
        throw error;
      }
      
      // Success - reset attempts counter
      refreshAttempts = 0;
      const verified = data.session?.user?.email_confirmed_at ? true : false;
      return { updated: true, verified };
    } catch (refreshError) {
      console.error("Error refreshing session:", refreshError);
      refreshAttempts++;
      return { updated: false, verified: session?.user?.email_confirmed_at ? true : false };
    }
  } catch (error) {
    console.error("Error updating verification status:", error);
    refreshAttempts++;
    return { updated: false, verified: false };
  }
};

/**
 * Clear all auth related cache data
 */
export const clearAuthCache = () => {
  localStorage.removeItem(SESSION_CACHE_KEY);
  console.log("Auth cache cleared");
};

/**
 * Clean up auth state in localStorage
 * Only cleans specific Supabase keys to avoid performance issues
 */
export const cleanupAuthState = () => {
  try {
    // Define the keys we want to clean up instead of iterating through all localStorage
    const supabaseKeysToClean = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'sb-refresh-token',
      'sb-access-token',
      SESSION_CACHE_KEY
    ];
    
    // Only remove specific keys instead of iterating through all localStorage
    supabaseKeysToClean.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Cleaned up key: ${key}`);
      }
    });
  } catch (error) {
    console.error("Error cleaning up auth state:", error);
  }
};
