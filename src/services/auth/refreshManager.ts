
import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/error";

// Debounce control for token refreshes
let isRefreshing = false;
let refreshTimeout: NodeJS.Timeout | null = null;
const REFRESH_COOLDOWN = 5000; // 5 seconds minimum between refresh attempts

/**
 * Optimized token refresh with debounce to prevent refresh loops
 */
export const refreshSession = async () => {
  // Prevent multiple concurrent refresh attempts
  if (isRefreshing) {
    console.log("Token refresh already in progress, skipping duplicate request");
    return null;
  }

  try {
    isRefreshing = true;
    
    // Clear any pending refresh attempts
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    console.log("Starting controlled session refresh");
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing session:", error);
      throw new AppError("Failed to refresh auth session", 401);
    }
    
    return data.session;
  } catch (error) {
    console.error("Refresh session error:", error);
    return null;
  } finally {
    // Set cooldown period before allowing another refresh
    refreshTimeout = setTimeout(() => {
      isRefreshing = false;
    }, REFRESH_COOLDOWN);
  }
};

/**
 * Reset refresh state - use when manually handling auth operations
 */
export const resetRefreshState = () => {
  isRefreshing = false;
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};
