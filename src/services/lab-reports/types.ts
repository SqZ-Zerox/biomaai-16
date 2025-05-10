
// Types for lab report data
export type LabReport = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  upload_date: string;
  test_types: string[] | null;
  status: 'processing' | 'analyzed' | 'error';
  is_deleted: boolean;
};

export type LabResult = {
  id: string;
  report_id: string;
  biomarker_name: string;
  value: string;
  unit: string | null;
  reference_range: string | null;
  status: 'normal' | 'low' | 'high' | 'critical';
  category: string | null;
};

export type LabInsight = {
  id: string;
  report_id: string;
  insights: any[];
  recommendations: any[];
  warnings: any[];
  follow_ups: any[];
  created_at: string;
};

// Types for API responses
export type LabReportResponse = {
  report: LabReport | null;
  error: string | null;
};

export type LabReportsResponse = {
  reports: LabReport[] | null;
  error: string | null;
};

export type LabReportDetailsResponse = {
  report: LabReport | null;
  results: LabResult[] | null;
  insights: LabInsight | null;
  error: string | null;
};
