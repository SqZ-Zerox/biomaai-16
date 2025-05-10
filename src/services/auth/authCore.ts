
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
  cleanupAuthState
} from "./sessionManagement";

import {
  checkIfEmailExists,
  validateEmailFormat
} from "./emailUtils";

// Re-export all functionality
export {
  // Auth operations
  signUp,
  signIn,
  signOut,
  getCurrentSession,
  updateUserVerificationStatus,
  cleanupAuthState,
  
  // User data processors
  processProfileData,
  extractSupabaseUser,
  
  // Email utilities
  checkIfEmailExists,
  validateEmailFormat,
  
  // Type definitions
  type UserProfileData
};
