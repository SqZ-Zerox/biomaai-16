
import { supabase } from "@/integrations/supabase/client";
import { 
  LabReport,
  LabResult, 
  LabInsight,
  LabReportDetailsResponse
} from "./types";
import { fetchLabReportDetails, fetchUserLabReports } from "./fetchService";

/**
 * Get the latest lab report for a user
 */
export async function getLatestLabReport(userId: string): Promise<LabReportDetailsResponse> {
  try {
    // Fetch all reports for the user
    const { reports, error: reportsError } = await fetchUserLabReports(userId);
    
    if (reportsError || !reports || reports.length === 0) {
      return {
        report: null,
        results: null,
        insights: null,
        error: reportsError || "No lab reports found"
      };
    }
    
    // Find the latest analyzed report
    const latestReport = reports.find(r => r.status === "analyzed") || reports[0];
    
    // Fetch the details for the latest report
    return await fetchLabReportDetails(latestReport.id);
  } catch (error: any) {
    console.error("Error fetching latest lab report:", error);
    return {
      report: null,
      results: null,
      insights: null,
      error: error.message
    };
  }
}

/**
 * Analyze lab results to generate insights
 */
export async function analyzeLabResults(reportId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if the report exists and has results
    const { data: results, error: resultsError } = await supabase
      .from("lab_results")
      .select("*")
      .eq("report_id", reportId);
      
    if (resultsError) throw resultsError;
    
    if (!results || results.length === 0) {
      return { 
        success: false, 
        error: "No lab results found for this report" 
      };
    }
    
    // In a real application, this would call an AI service to analyze the results
    // For now, we'll simulate the analysis with a simple algorithm
    
    // Count abnormal results
    const abnormalResults = results.filter(
      result => result.status === "high" || result.status === "low" || result.status === "critical"
    );
    
    // Generate insights based on abnormal results
    const insights = {
      summary: `Found ${abnormalResults.length} abnormal results out of ${results.length} total biomarkers.`,
      insights: [
        "Your lab results show some biomarkers outside the normal range.",
        "Consider discussing these results with your healthcare provider."
      ],
      recommendations: [
        "Maintain a balanced diet rich in fruits and vegetables.",
        "Stay hydrated and aim for regular physical activity.",
        "Follow up with your doctor to discuss these results in detail."
      ],
      warnings: abnormalResults.length > 0 
        ? ["Some biomarkers require attention."] 
        : [],
      follow_ups: abnormalResults.length > 0 
        ? ["Schedule a follow-up appointment with your healthcare provider."] 
        : []
    };
    
    // Store the insights in the database
    const { error: insertError } = await supabase
      .from("lab_insights")
      .upsert({
        report_id: reportId,
        summary: insights.summary,
        insights: insights.insights,
        recommendations: insights.recommendations,
        warnings: insights.warnings,
        follow_ups: insights.follow_ups,
        created_at: new Date().toISOString()
      });
      
    if (insertError) throw insertError;
    
    // Update the report status to "analyzed"
    const { error: updateError } = await supabase
      .from("lab_reports")
      .update({ status: "analyzed" })
      .eq("id", reportId);
      
    if (updateError) throw updateError;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error analyzing lab results:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get health score based on lab results
 */
export async function calculateHealthScore(reportId: string): Promise<{ score: number; error: string | null }> {
  try {
    // Fetch lab results for the report
    const { data: results, error } = await supabase
      .from("lab_results")
      .select("*")
      .eq("report_id", reportId);
      
    if (error) throw error;
    
    if (!results || results.length === 0) {
      return { score: 0, error: "No lab results found" };
    }
    
    // Calculate health score based on results
    // This is a simplified algorithm - in a real app, this would be more sophisticated
    const totalBiomarkers = results.length;
    const normalBiomarkers = results.filter(result => result.status === "normal").length;
    const slightlyAbnormal = results.filter(
      result => result.status === "high" || result.status === "low"
    ).length;
    const criticalBiomarkers = results.filter(result => result.status === "critical").length;
    
    // Score calculation: 
    // - Normal biomarkers contribute positively
    // - Slightly abnormal biomarkers reduce the score slightly
    // - Critical biomarkers reduce the score significantly
    let score = (normalBiomarkers / totalBiomarkers) * 100;
    score -= (slightlyAbnormal / totalBiomarkers) * 20;
    score -= (criticalBiomarkers / totalBiomarkers) * 40;
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    return { score: Math.round(score), error: null };
  } catch (error: any) {
    console.error("Error calculating health score:", error);
    return { score: 0, error: error.message };
  }
}

/**
 * Compare two lab reports to track changes
 */
export async function compareLabReports(
  reportId1: string, 
  reportId2: string
): Promise<{ 
  improved: LabResult[]; 
  worsened: LabResult[]; 
  unchanged: LabResult[]; 
  error: string | null 
}> {
  try {
    // Fetch results for first report
    const { data: results1, error: error1 } = await supabase
      .from("lab_results")
      .select("*")
      .eq("report_id", reportId1);
      
    if (error1) throw error1;
    
    // Fetch results for second report
    const { data: results2, error: error2 } = await supabase
      .from("lab_results")
      .select("*")
      .eq("report_id", reportId2);
      
    if (error2) throw error2;
    
    if (!results1 || !results2) {
      return { 
        improved: [], 
        worsened: [], 
        unchanged: [], 
        error: "Could not find results for one or both reports" 
      };
    }
    
    // Map results by biomarker name for easy comparison
    const resultsMap1 = new Map(
      results1.map(result => [result.biomarker_name, result])
    );
    
    // Compare results
    const improved: LabResult[] = [];
    const worsened: LabResult[] = [];
    const unchanged: LabResult[] = [];
    
    results2.forEach(newResult => {
      const oldResult = resultsMap1.get(newResult.biomarker_name);
      
      if (!oldResult) {
        // No previous result to compare
        return;
      }
      
      // Determine status change
      const statusValues = {
        "normal": 0,
        "low": 1,
        "high": 1,
        "critical": 2
      };
      
      const oldStatusValue = statusValues[oldResult.status as keyof typeof statusValues] || 0;
      const newStatusValue = statusValues[newResult.status as keyof typeof statusValues] || 0;
      
      if (newStatusValue < oldStatusValue) {
        improved.push(newResult as unknown as LabResult);
      } else if (newStatusValue > oldStatusValue) {
        worsened.push(newResult as unknown as LabResult);
      } else {
        unchanged.push(newResult as unknown as LabResult);
      }
    });
    
    return {
      improved,
      worsened,
      unchanged,
      error: null
    };
  } catch (error: any) {
    console.error("Error comparing lab reports:", error);
    return {
      improved: [],
      worsened: [],
      unchanged: [],
      error: error.message
    };
  }
}

/**
 * Process and analyze a lab report file
 */
export async function analyzeLabReport(report: LabReport, fileUrl: string): Promise<boolean> {
  try {
    console.log("Analyzing lab report:", report.id);
    
    // This would typically call an AI service to extract and analyze lab results
    // For now, just simulate the process with a delay
    
    // Update report status to processing
    const { error: updateError } = await supabase
      .from("lab_reports")
      .update({ status: "processing" })
      .eq("id", report.id);
      
    if (updateError) throw updateError;
    
    // Generate some sample results (in a real app, this would be done by OCR and AI)
    const sampleBiomarkers = [
      { name: "Glucose", value: "95", unit: "mg/dL", range: "70-99", status: "normal" as const, category: "Metabolic" },
      { name: "Cholesterol", value: "210", unit: "mg/dL", range: "< 200", status: "high" as const, category: "Lipids" },
      { name: "HDL", value: "45", unit: "mg/dL", range: "> 40", status: "normal" as const, category: "Lipids" },
      { name: "LDL", value: "140", unit: "mg/dL", range: "< 130", status: "high" as const, category: "Lipids" },
      { name: "Triglycerides", value: "180", unit: "mg/dL", range: "< 150", status: "high" as const, category: "Lipids" },
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.5-17.5", status: "normal" as const, category: "CBC" }
    ];
    
    // Insert sample results into database
    for (const biomarker of sampleBiomarkers) {
      const { error: insertError } = await supabase
        .from("lab_results")
        .insert({
          report_id: report.id,
          biomarker_name: biomarker.name,
          value: biomarker.value,
          unit: biomarker.unit,
          reference_range: biomarker.range,
          status: biomarker.status,
          category: biomarker.category
        });
        
      if (insertError) {
        console.error("Error inserting result:", insertError);
      }
    }
    
    // Set test types detected
    const { error: typeError } = await supabase
      .from("lab_reports")
      .update({ 
        test_types: ["Metabolic", "Lipids", "CBC"],
        status: "analyzed"
      })
      .eq("id", report.id);
      
    if (typeError) throw typeError;
    
    // Generate insights using the analyzeLabResults function
    const { success, error } = await analyzeLabResults(report.id);
    
    if (!success) {
      console.error("Error analyzing results:", error);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error analyzing lab report:", error);
    return false;
  }
}
