
import { supabase } from "@/integrations/supabase/client";
import { 
  LabReport, 
  LabResult, 
  LabInsight, 
  LabReportsResponse, 
  LabReportResponse, 
  LabReportDetailsResponse 
} from "./types";
import { toast } from "@/hooks/use-toast";

/**
 * Helper function to cast database types to our defined types
 */
function castLabReport(report: any): LabReport {
  return {
    ...report,
    status: report.status as "processing" | "analyzed" | "error"
  };
}

function castLabResult(result: any): LabResult {
  return {
    ...result,
    status: result.status as "normal" | "low" | "high" | "critical"
  };
}

function castLabInsight(insight: any): LabInsight {
  return {
    ...insight,
    insights: Array.isArray(insight.insights) ? insight.insights : [],
    recommendations: Array.isArray(insight.recommendations) ? insight.recommendations : [],
    warnings: Array.isArray(insight.warnings) ? insight.warnings : [],
    follow_ups: Array.isArray(insight.follow_ups) ? insight.follow_ups : []
  };
}

/**
 * Fetch all lab reports for a user
 */
export async function fetchUserLabReports(userId: string): Promise<LabReportsResponse> {
  try {
    const { data: reports, error } = await supabase
      .from("lab_reports")
      .select("*")
      .eq("user_id", userId)
      .eq("is_deleted", false)
      .order("upload_date", { ascending: false });
      
    if (error) throw error;
    
    return {
      reports: reports.map(report => castLabReport(report)),
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching lab reports:", error);
    return {
      reports: null,
      error: error.message
    };
  }
}

/**
 * Fetch a specific lab report by ID
 */
export async function fetchLabReport(reportId: string): Promise<LabReportResponse> {
  try {
    const { data: report, error } = await supabase
      .from("lab_reports")
      .select("*")
      .eq("id", reportId)
      .single();
      
    if (error) throw error;
    
    return {
      report: castLabReport(report),
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching lab report:", error);
    return {
      report: null,
      error: error.message
    };
  }
}

/**
 * Fetch lab report details including results and insights
 */
export async function fetchLabReportDetails(reportId: string): Promise<LabReportDetailsResponse> {
  try {
    // Fetch the report
    const { data: report, error: reportError } = await supabase
      .from("lab_reports")
      .select("*")
      .eq("id", reportId)
      .single();
      
    if (reportError) throw reportError;
    
    // Fetch lab results for the report
    const { data: results, error: resultsError } = await supabase
      .from("lab_results")
      .select("*")
      .eq("report_id", reportId);
      
    if (resultsError) throw resultsError;
    
    // Fetch insights for the report
    const { data: insight, error: insightError } = await supabase
      .from("lab_insights")
      .select("*")
      .eq("report_id", reportId)
      .maybeSingle();
    
    if (insightError) throw insightError;
    
    return {
      report: castLabReport(report),
      results: results.map(result => castLabResult(result)),
      insights: insight ? castLabInsight(insight) : null,
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching lab report details:", error);
    return {
      report: null,
      results: null,
      insights: null,
      error: error.message
    };
  }
}

/**
 * Delete a lab report (soft delete)
 */
export async function deleteLabReport(reportId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("lab_reports")
      .update({ is_deleted: true })
      .eq("id", reportId);
      
    if (error) throw error;
    
    toast({
      title: "Report Deleted",
      description: "Lab report has been successfully deleted",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting lab report:", error);
    
    toast({
      title: "Deletion Failed",
      description: error.message,
      variant: "destructive",
    });
    
    return { success: false, error: error.message };
  }
}
