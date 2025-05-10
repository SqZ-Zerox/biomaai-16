
import { supabase } from "@/integrations/supabase/client";
import { LabReportDetailsResponse, LabReportsResponse } from "./types";

// Get all lab reports for a user
export const getUserLabReports = async (userId: string): Promise<LabReportsResponse> => {
  try {
    const { data, error } = await supabase
      .from('lab_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('upload_date', { ascending: false });

    if (error) {
      return { reports: null, error: error.message };
    }

    return { reports: data, error: null };
  } catch (error: any) {
    return { reports: null, error: error.message };
  }
};

// Get a single lab report with its results and insights
export const getLabReportDetails = async (reportId: string): Promise<LabReportDetailsResponse> => {
  try {
    // Get lab report
    const { data: report, error: reportError } = await supabase
      .from('lab_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError) {
      return { report: null, results: null, insights: null, error: reportError.message };
    }

    // Get lab results
    const { data: results, error: resultsError } = await supabase
      .from('lab_results')
      .select('*')
      .eq('report_id', reportId);

    if (resultsError) {
      return { report, results: null, insights: null, error: resultsError.message };
    }

    // Get lab insights
    const { data: insights, error: insightsError } = await supabase
      .from('lab_insights')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (insightsError && insightsError.code !== 'PGRST116') { // PGRST116 is "No rows returned" which is fine
      return { report, results, insights: null, error: insightsError.message };
    }

    return { report, results, insights, error: null };
  } catch (error: any) {
    return { report: null, results: null, insights: null, error: error.message };
  }
};

// Get the latest lab report with its insights
export const getLatestLabReport = async (userId: string): Promise<LabReportDetailsResponse> => {
  try {
    // Get latest lab report
    const { data: reports, error: reportError } = await supabase
      .from('lab_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .eq('status', 'analyzed') // Only get successfully analyzed reports
      .order('upload_date', { ascending: false })
      .limit(1);

    if (reportError || !reports || reports.length === 0) {
      return { report: null, results: null, insights: null, error: reportError?.message || 'No reports found' };
    }

    const report = reports[0];

    // Get lab results
    const { data: results, error: resultsError } = await supabase
      .from('lab_results')
      .select('*')
      .eq('report_id', report.id);

    if (resultsError) {
      return { report, results: null, insights: null, error: resultsError.message };
    }

    // Get lab insights
    const { data: insights, error: insightsError } = await supabase
      .from('lab_insights')
      .select('*')
      .eq('report_id', report.id)
      .single();

    if (insightsError && insightsError.code !== 'PGRST116') { // PGRST116 is "No rows returned" which is fine
      return { report, results, insights: null, error: insightsError.message };
    }

    return { report, results, insights, error: null };
  } catch (error: any) {
    return { report: null, results: null, insights: null, error: error.message };
  }
};
