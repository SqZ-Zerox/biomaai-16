
// Import and re-export from the new modular files
import { 
  processProfileData, 
  extractSupabaseUser,
} from "./userDataProcessor";

// Import the type separately with explicit 'type' keyword
import type { UserProfileData } from "./userDataProcessor";

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
