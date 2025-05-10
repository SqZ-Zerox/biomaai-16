
// This file is kept for backward compatibility
// Import and re-export all functionality from the new modular structure

import { 
  signUp as signUpCore, 
  signIn as signInCore, 
  signOut as signOutCore, 
  getCurrentSession as getSessionCore, 
  updateUserVerificationStatus as verifyEmailCore 
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
export const signUp = signUpCore;
export const signIn = signInCore;
export const signOut = signOutCore;
export const getCurrentSession = getSessionCore;
export const updateUserVerificationStatus = verifyEmailCore;
export { ensureUserProfile, completeUserProfile };
export { processHealthGoals, processDietaryRestrictions };
