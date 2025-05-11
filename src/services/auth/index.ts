
// Export types
export * from "./types";

// Export core auth functions
export {
  signUp,
  signIn,
  signOut,
  getCurrentSession,
  updateUserVerificationStatus,
  processProfileData,
  extractSupabaseUser,
  cleanupAuthState,
  clearAuthCache
} from "./authCore";

// Export profile management
export {
  ensureUserProfile,
  completeUserProfile,
  getUserProfile,
  updateUserProfile,
  forceProfileRefresh,
  extractHealthGoals,
  extractDietaryRestrictions
} from "./profileManager";

// Export operations (for backwards compatibility)
export * from "./authOperations";

// Export data processing utilities
export {
  processHealthGoals,
  processDietaryRestrictions
} from "./dataProcessor";

// Export email utilities (new addition)
export {
  checkIfEmailExists,
  validateEmailFormat,
  resendVerificationEmail
} from "./emailUtils";
