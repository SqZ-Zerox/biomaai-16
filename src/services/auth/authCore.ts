
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

import {
  checkIfEmailExists,
  validateEmailFormat,
  resendVerificationEmail
} from "./emailUtils";

import {
  forceProfileRefresh,
  getUserProfile
} from "./profileManager";

import {
  resetRefreshAttempts
} from "./refreshManager";

// Re-export all functionality
export {
  // Auth operations
  signUp,
  signIn,
  signOut,
  getCurrentSession,
  updateUserVerificationStatus,
  cleanupAuthState,
  clearAuthCache,
  resetRefreshAttempts,
  
  // User data processors
  processProfileData,
  extractSupabaseUser,
  
  // Email utilities
  checkIfEmailExists,
  validateEmailFormat,
  resendVerificationEmail,
  
  // Profile management
  forceProfileRefresh,
  getUserProfile,
  
  // Type definitions
  type UserProfileData
};
