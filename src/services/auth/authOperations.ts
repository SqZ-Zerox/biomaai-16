
// This file is kept for backward compatibility
// Import and re-export all functionality from the new modular structure

import { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentSession, 
  updateUserVerificationStatus 
} from './authCore';

import { 
  ensureUserProfile, 
  completeUserProfile 
} from './profileManager';

import {
  processHealthGoals,
  processDietaryRestrictions
} from './dataProcessor';

// Re-export all functions for backward compatibility
export {
  signUp,
  signIn,
  signOut,
  getCurrentSession,
  updateUserVerificationStatus,
  ensureUserProfile,
  completeUserProfile,
  processHealthGoals,
  processDietaryRestrictions
};
