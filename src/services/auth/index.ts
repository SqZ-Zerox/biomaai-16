
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
  extractSupabaseUser
} from "./authCore";

// Export profile management
export {
  ensureUserProfile,
  completeUserProfile,
  getUserProfile,
  updateUserProfile
} from "./profileManager";

// Export operations (for backwards compatibility)
export * from "./authOperations";

// Export data processing utilities
export {
  processHealthGoals,
  processDietaryRestrictions
} from "./dataProcessor";
