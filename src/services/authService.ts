
// Re-export everything from our modular auth services
// but do this explicitly to avoid conflicts
import { 
  // auth operations
  signUp,
  signIn,
  signOut,
  getCurrentSession,
  updateUserVerificationStatus,
  cleanupAuthState,
  clearAuthCache,
  
  // user data processors
  processProfileData,
  extractSupabaseUser,
  
  // profile management
  forceProfileRefresh,
  getUserProfile,
  
  // Types
  type UserProfileData
} from './auth';

import {
  // Email utilities - import directly from emailUtils
  resendVerificationEmail,
  validateEmailFormat,
  checkIfEmailExists,
  clearEmailExistsCache
} from './auth/emailUtils';

import {
  // Refresh management - import directly from refreshManager
  refreshSession,
  resetRefreshAttempts,
  resetRefreshState,
  handleRateLimitError
} from './auth/refreshManager';

// Export everything explicitly to avoid conflicts
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
  
  // Email utilities
  resendVerificationEmail,
  validateEmailFormat,
  checkIfEmailExists,
  clearEmailExistsCache,
  
  // Refresh management
  refreshSession,
  resetRefreshAttempts,
  resetRefreshState,
  handleRateLimitError,
  
  // Types
  type UserProfileData
};
