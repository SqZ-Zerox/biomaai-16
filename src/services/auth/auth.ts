
// We need to be explicit about what we're exporting to avoid circular dependencies
export * from './authCore';
export * from './authOperations';
export * from './dataProcessor';
export * from './dataRecovery';
export * from './profileManager';
export * from './sessionManagement';
export * from './types';
export * from './userDataProcessor';
export * from './errorHandler';

// Don't re-export emailUtils or resendVerificationEmail here to avoid ambiguity
