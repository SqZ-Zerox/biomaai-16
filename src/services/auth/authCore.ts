
// Import from the specific modules rather than circular importing
import { 
  processProfileData, 
  extractSupabaseUser,
} from "./userDataProcessor";

// Import the type separately with explicit 'type' keyword
import type { UserProfileData } from "./userDataProcessor";

// Import auth-related operations directly from their source modules
// NOT from re-exports that might cause circular dependencies
import {
  signUp,
  signIn,
  signOut
} from "./authOperations";

import {
  getCurrentSession,
  updateUserVerificationStatus,
  cleanupAuthState,
  clearAuthCache
} from "./sessionManagement";

// Import these from their specific modules, but don't re-export them
// to avoid duplicate exports
import {
  checkIfEmailExists,
  validateEmailFormat,
  resendVerificationEmail
} from "./emailUtils";

import {
  forceProfileRefresh,
  getUserProfile
} from "./profileManager";

// Don't import from refreshManager here to avoid circular dependencies

// Re-export core functionality
export {
  // Auth operations
  signUp,
  signIn,
  signOut,
  getCurrentSession,
  updateUserVerificationStatus,
  cleanupAuthState,
  clearAuthCache,
  
  // User data processors
  processProfileData,
  extractSupabaseUser,
  
  // Profile management
  forceProfileRefresh,
  getUserProfile,
  
  // Type definitions
  type UserProfileData
};

// Important: Do NOT re-export email utils or refresh manager functions
