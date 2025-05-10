
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { LabReport, LabReportResponse } from "./types";
import { analyzeLabReport } from "./analysisService";

// Upload a lab report file to Supabase storage
export const uploadLabReport = async (file: File, userId: string): Promise<LabReportResponse> => {
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
