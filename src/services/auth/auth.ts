
// Export specific modules to avoid circular dependencies

// Core authentication exports (excluding the ones that might cause conflicts)
export * from './authCore';

// Export other modules
export * from './authOperations';
export * from './dataProcessor';
export * from './dataRecovery';
export * from './profileManager';
export * from './sessionManagement';
export * from './types';
export * from './userDataProcessor';
export * from './errorHandler';

// Don't re-export emailUtils or refreshManager from here
// they'll be exported directly from the main index.ts
