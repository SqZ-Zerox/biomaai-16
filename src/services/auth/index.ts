
// Export specific items instead of using star exports to avoid conflicts
import { 
  refreshSession, 
  resetRefreshAttempts, 
  resetRefreshState,
  handleRateLimitError 
} from './refreshManager';

import { 
  resendVerificationEmail, 
  validateEmailFormat, 
  checkIfEmailExists, 
  clearEmailExistsCache 
} from './emailUtils';

// Export core auth functionality
export * from './auth';

// Explicitly export these to avoid conflicts
export {
  // Refresh manager exports
  refreshSession,
  resetRefreshAttempts,
  resetRefreshState,
  handleRateLimitError,
  
  // Email utilities exports
  resendVerificationEmail,
  validateEmailFormat,
  checkIfEmailExists,
  clearEmailExistsCache
};
