
// Re-export everything from the modular auth services
export * from './authCore';
export * from './authOperations';
export * from './dataProcessor';
export * from './dataRecovery';
export * from './profileManager';
export * from './sessionManagement';
export * from './types';
export * from './userDataProcessor';
export * from './errorHandler';
// Don't re-export emailUtils here since it's already exported in index.ts

