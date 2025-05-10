
// Export all lab report services from a single entry point
export * from "./types";
export * from "./uploadService";
export * from "./fetchService";
export * from "./analysisService";
export * from "./testDetectionService";
export * from "./responseParsingService";

// Add aliases for renamed functions to maintain backwards compatibility
import { fetchLabReportDetails, fetchUserLabReports } from "./fetchService";

export const getLabReportDetails = fetchLabReportDetails;
export const getUserLabReports = fetchUserLabReports;
