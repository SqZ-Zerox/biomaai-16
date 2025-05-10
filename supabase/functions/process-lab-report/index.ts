
// Follow the edge function structure for OCR and AI analysis
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyDdPQCvHDo-lQfTaNZPoaziqyUiM9O8pX0";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, results } = await req.json();
    console.log("Processing lab report with file URL:", fileUrl);
    console.log("Lab results for analysis:", results);
    
    if (!results || results.length === 0) {
      throw new Error("No lab results provided for analysis");
    }

    // For a real implementation with OCR:
    // 1. Download the file from the URL
    // 2. Extract text using OCR if image/PDF
    // But for now, we'll use the provided results directly
    
    // Format the results for the Gemini API
    const formattedResults = results.map(r => 
      `Biomarker: ${r.biomarker_name}, Value: ${r.value}${r.unit ? ' ' + r.unit : ''}, Reference Range: ${r.reference_range || 'Not provided'}, Status: ${r.status}`
    ).join('\n');
    
    // Create a comprehensive prompt for Gemini
    const prompt = `
Analyze the following lab results comprehensively:

${formattedResults}

Return a detailed health analysis with the following sections:
1. **Insights**: Detailed observations about the test results, focusing on abnormal values.
2. **Recommendations**: Specific and actionable recommendations based on the abnormal values.
3. **Warnings**: Any critical concerns that require immediate attention.
4. **Follow-up Tests**: Suggested follow-up tests that might be beneficial based on these results.

Format your response with markdown headings for each section. Include scientific context about what each biomarker measures and why it matters. Be specific and personalized in your recommendations. Consider potential interactions between different biomarkers.
`;

    console.log("Sending analysis request to Gemini API");
    
    // Call the Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 4000,
        },
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API");
    }
    
    // Extract the generated text
    const aiAnalysis = data.candidates[0].content.parts[0].text;
    console.log("Received AI analysis:", aiAnalysis);
    
    // Parse the AI response to extract different sections
    const parseAiResponse = (text) => {
      // This is a simple parser - in production, you might want something more robust
      const sections = {
        insights: [],
        recommendations: [],
        warnings: [],
        follow_ups: [] // Using follow_ups to match the database schema
      };
      
      let currentSection = null;
      
      // Split by lines and process each line
      text.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        
        // Check for section headers
        if (trimmedLine.toLowerCase().includes('insight')) {
          currentSection = 'insights';
        } else if (trimmedLine.toLowerCase().includes('recommendation')) {
          currentSection = 'recommendations';
        } else if (trimmedLine.toLowerCase().includes('warning')) {
          currentSection = 'warnings';
        } else if (trimmedLine.toLowerCase().includes('follow-up test')) {
          currentSection = 'follow_ups';
        } 
        // Check if line is a bullet point or numbered item
        else if (currentSection && (trimmedLine.match(/^[-•*]\s/) || trimmedLine.match(/^\d+\.\s/))) {
          const content = trimmedLine.replace(/^[-•*\d\.]\s/, '').trim();
          if (content) {
            sections[currentSection].push(content);
          }
        }
      });
      
      return sections;
    };
    
    // Parse the AI response
    const parsedAnalysis = parseAiResponse(aiAnalysis);
    console.log("Parsed analysis:", parsedAnalysis);
    
    // Return both the raw AI text and the structured analysis
    return new Response(
      JSON.stringify({ 
        success: true, 
        rawAnalysis: aiAnalysis,
        structuredAnalysis: parsedAnalysis
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error("Error processing lab report:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        errorDetails: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
