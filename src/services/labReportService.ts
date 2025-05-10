import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { sendGeminiCompletion, GeminiMessage } from "./geminiService";

// Types
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

// Upload a lab report file to Supabase storage
export const uploadLabReport = async (file: File, userId: string): Promise<{
  report: LabReport | null;
  error: string | null;
}> => {
  try {
    // Create a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('lab_reports')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { report: null, error: uploadError.message };
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('lab_reports')
      .getPublicUrl(filePath);

    // Create a database entry for the lab report
    const { data: report, error: dbError } = await supabase
      .from('lab_reports')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        status: 'processing'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return { report: null, error: dbError.message };
    }

    // Start analysis process without waiting for test type selection
    analyzeLabReport(report as LabReport, publicUrl);

    return { report: report as LabReport, error: null };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { report: null, error: error.message };
  }
};

// Get all lab reports for a user
export const getUserLabReports = async (userId: string): Promise<{
  reports: LabReport[] | null;
  error: string | null;
}> => {
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

    return { reports: data as LabReport[], error: null };
  } catch (error: any) {
    return { reports: null, error: error.message };
  }
};

// Get a single lab report with its results and insights
export const getLabReportDetails = async (reportId: string): Promise<{
  report: LabReport | null;
  results: LabResult[] | null;
  insights: LabInsight | null;
  error: string | null;
}> => {
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
      return { report: report as LabReport, results: null, insights: null, error: resultsError.message };
    }

    // Get lab insights
    const { data: insights, error: insightsError } = await supabase
      .from('lab_insights')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (insightsError && insightsError.code !== 'PGRST116') { // PGRST116 is "No rows returned" which is fine
      return { report: report as LabReport, results: results as LabResult[], insights: null, error: insightsError.message };
    }

    return { 
      report: report as LabReport, 
      results: results as LabResult[], 
      insights: insights as LabInsight, 
      error: null 
    };
  } catch (error: any) {
    return { report: null, results: null, insights: null, error: error.message };
  }
};

// Get the latest lab report with its insights
export const getLatestLabReport = async (userId: string): Promise<{
  report: LabReport | null;
  results: LabResult[] | null;
  insights: LabInsight | null;
  error: string | null;
}> => {
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

    const report = reports[0] as LabReport;

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
      return { report, results: results as LabResult[], insights: null, error: insightsError.message };
    }

    return { 
      report, 
      results: results as LabResult[], 
      insights: insights as LabInsight, 
      error: null 
    };
  } catch (error: any) {
    return { report: null, results: null, insights: null, error: error.message };
  }
};

// Function to analyze lab report using Gemini AI
const analyzeLabReport = async (report: LabReport, fileUrl: string) => {
  try {
    // For real implementation, we'd extract text from the PDF/image here
    // This would typically be done in a Supabase Edge Function
    
    // For this prototype, let's simulate the text extraction with mock data
    const extractedText = 
      "Complete Blood Count (CBC):\n" +
      "Hemoglobin: 11.2 g/dL (Reference Range: 12.0-15.5)\n" +
      "Hematocrit: 34% (Reference Range: 35.5-44.9%)\n" +
      "MCV: 78 fL (Reference Range: 80-96 fL)\n" +
      "Platelet Count: 250 K/uL (Reference Range: 150-450 K/uL)\n\n" +
      "Lipid Panel:\n" +
      "Total Cholesterol: 245 mg/dL (Reference Range: <200 mg/dL)\n" +
      "HDL: 38 mg/dL (Reference Range: >40 mg/dL)\n" +
      "LDL: 160 mg/dL (Reference Range: <100 mg/dL)\n" +
      "Triglycerides: 190 mg/dL (Reference Range: <150 mg/dL)";
    
    // Create prompt for Gemini AI to identify test types and analyze results
    const prompt = `
      You are a health and wellness assistant. First, identify all the specific test types in the provided lab results. 
      Then analyze the results for a fitness-focused individual. Explain what each biomarker means in simple terms, 
      and categorize each as Optimal, Borderline, or Critical based on clinical norms and wellness goals. Then provide:

      1. Key insights – what stands out and why it matters for their health/fitness.
      2. Personalized recommendations – diet, supplements, lifestyle tips to improve any borderline values.
      3. Warnings – any health risks or urgent concerns.
      4. Suggested follow-up tests if needed.

      Keep the tone supportive and user-friendly, not medical or alarming. Present the response in four clear sections:  
      **Insights**, **Recommendations**, **Warnings**, **Follow-up Tests**.

      Lab Test Results:
      ${extractedText}
    `;

    // Send prompt to Gemini
    const messages: GeminiMessage[] = [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ];
    
    const response = await sendGeminiCompletion(messages);
    
    if (!response) {
      throw new Error("Failed to get analysis from Gemini");
    }
    
    // Parse Gemini's response to extract structured data
    const insights = parseGeminiResponse(response);
    
    // Detect test types from the text
    const testTypes = detectTestTypes(extractedText);
    
    // Store results in database - in real implementation, we would extract the biomarker values
    // from the PDF/image or from Gemini's response
    const biomarkers = [
      { name: "Hemoglobin", value: "11.2", unit: "g/dL", reference_range: "12.0-15.5", status: "low" as const, category: "blood" },
      { name: "Hematocrit", value: "34", unit: "%", reference_range: "35.5-44.9", status: "low" as const, category: "blood" },
      { name: "MCV", value: "78", unit: "fL", reference_range: "80-96", status: "low" as const, category: "blood" },
      { name: "Platelet Count", value: "250", unit: "K/uL", reference_range: "150-450", status: "normal" as const, category: "blood" },
      { name: "Total Cholesterol", value: "245", unit: "mg/dL", reference_range: "<200", status: "high" as const, category: "lipids" },
      { name: "HDL", value: "38", unit: "mg/dL", reference_range: ">40", status: "low" as const, category: "lipids" },
      { name: "LDL", value: "160", unit: "mg/dL", reference_range: "<100", status: "high" as const, category: "lipids" },
      { name: "Triglycerides", value: "190", unit: "mg/dL", reference_range: "<150", status: "high" as const, category: "lipids" }
    ];
    
    // Update lab report with automatically detected test types
    await supabase
      .from('lab_reports')
      .update({
        test_types: testTypes,
        status: 'analyzed'
      })
      .eq('id', report.id);
    
    // Insert lab results
    for (const biomarker of biomarkers) {
      await supabase
        .from('lab_results')
        .insert({
          report_id: report.id,
          biomarker_name: biomarker.name,
          value: biomarker.value,
          unit: biomarker.unit,
          reference_range: biomarker.reference_range,
          status: biomarker.status,
          category: biomarker.category
        });
    }
    
    // Insert lab insights
    await supabase
      .from('lab_insights')
      .insert({
        report_id: report.id,
        insights: insights.insights,
        recommendations: insights.recommendations,
        warnings: insights.warnings,
        follow_ups: insights.followUps
      });
    
  } catch (error: any) {
    console.error("Analysis error:", error);
    
    // Update report status to indicate error
    await supabase
      .from('lab_reports')
      .update({
        status: 'error'
      })
      .eq('id', report.id);
  }
};

// Function to detect test types from the text
const detectTestTypes = (text: string): string[] => {
  const testTypes: string[] = [];
  
  // Check for common lab test patterns in the text
  if (text.includes("Complete Blood Count") || text.includes("CBC") || 
      text.match(/Hemoglobin|Hematocrit|RBC|WBC|Platelets|MCV|MCH|MCHC/i)) {
    testTypes.push("CBC");
  }
  
  if (text.includes("Lipid Panel") || text.match(/Cholesterol|HDL|LDL|Triglycerides/i)) {
    testTypes.push("Lipid Panel");
  }
  
  if (text.match(/TSH|T3|T4|Free T4|Thyroid|Thyroxine/i)) {
    testTypes.push("Thyroid Panel");
  }
  
  if (text.match(/Glucose|A1C|Hemoglobin A1C|HbA1c/i)) {
    testTypes.push("Glucose/A1C");
  }
  
  if (text.match(/Vitamin D|25-OH|25-hydroxyvitamin/i)) {
    testTypes.push("Vitamin D");
  }
  
  if (text.match(/Iron|Ferritin|TIBC|Transferrin/i)) {
    testTypes.push("Iron Panel");
  }
  
  if (text.match(/CRP|ESR|Inflammation|Sed Rate/i)) {
    testTypes.push("Inflammation Markers");
  }
  
  if (text.match(/ALT|AST|Bilirubin|Alkaline Phosphatase|Liver/i)) {
    testTypes.push("Liver Function");
  }
  
  if (text.match(/BUN|Creatinine|eGFR|Kidney/i)) {
    testTypes.push("Kidney Function");
  }
  
  if (text.match(/Electrolytes|Sodium|Potassium|Chloride|Magnesium|Calcium/i)) {
    testTypes.push("Electrolytes");
  }
  
  // If no test types detected, add "General Blood Panel" as fallback
  if (testTypes.length === 0) {
    testTypes.push("General Blood Panel");
  }
  
  return testTypes;
};

// Helper function to parse Gemini's response
const parseGeminiResponse = (response: string) => {
  // Define regex patterns to extract each section
  const insightsPattern = /\*\*Insights\*\*([\s\S]*?)(?=\*\*Recommendations\*\*)/;
  const recommendationsPattern = /\*\*Recommendations\*\*([\s\S]*?)(?=\*\*Warnings\*\*)/;
  const warningsPattern = /\*\*Warnings\*\*([\s\S]*?)(?=\*\*Follow-up Tests\*\*)/;
  const followUpsPattern = /\*\*Follow-up Tests\*\*([\s\S]*)/;
  
  // Extract sections using regex
  const insightsMatch = response.match(insightsPattern);
  const recommendationsMatch = response.match(recommendationsPattern);
  const warningsMatch = response.match(warningsPattern);
  const followUpsMatch = response.match(followUpsPattern);
  
  // Function to extract bullet points as array items
  const extractBulletPoints = (text: string | null): string[] => {
    if (!text) return [];
    
    // Split by lines, then filter for bullet points (lines starting with - or •)
    const lines = text.trim().split('\n');
    return lines
      .filter(line => line.trim().match(/^[-•]\s/))
      .map(line => line.trim().replace(/^[-•]\s/, '').trim());
  };
  
  // Extract and format the content
  const insights = insightsMatch ? extractBulletPoints(insightsMatch[1]) : [];
  const recommendations = recommendationsMatch ? extractBulletPoints(recommendationsMatch[1]) : [];
  const warnings = warningsMatch ? extractBulletPoints(warningsMatch[1]) : [];
  const followUps = followUpsMatch ? extractBulletPoints(followUpsMatch[1]) : [];
  
  return {
    insights,
    recommendations,
    warnings,
    followUps
  };
};
