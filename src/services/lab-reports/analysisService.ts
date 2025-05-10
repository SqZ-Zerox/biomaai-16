
import { supabase } from "@/integrations/supabase/client";
import { sendGeminiCompletion, GeminiMessage } from "../geminiService";
import { LabReport } from "./types";
import { detectTestTypes } from "./testDetectionService";
import { parseGeminiResponse } from "./responseParsingService";

// Function to analyze lab report using Gemini AI
export const analyzeLabReport = async (report: LabReport, fileUrl: string) => {
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
