
// Export specific items instead of using star exports to avoid conflicts
// This file should be the main entry point for auth exports
import { refreshSession } from './refreshManager';
import { resendVerificationEmail, validateEmailFormat, checkIfEmailExists, clearEmailExistsCache } from './emailUtils';

// Export everything from auth.ts except what we're explicitly exporting here
// to prevent duplicate exports
export * from './auth';

// Explicitly export these to avoid conflicts
export {
  refreshSession,
  resendVerificationEmail,
  validateEmailFormat,
  checkIfEmailExists,
  clearEmailExistsCache
};

// Don't re-export handleRateLimitError here since it's already exported via refreshManager
