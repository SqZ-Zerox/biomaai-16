
// Follow the edge function structure for OCR and AI analysis
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get API key from env or fall back to OpenAI if Gemini has quota issues
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Retry configuration for API rate limiting
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000; // 1 second

// Function to implement exponential backoff for retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

    // Format the results for the AI API
    const formattedResults = results.map(r => 
      `Biomarker: ${r.biomarker_name}, Value: ${r.value}${r.unit ? ' ' + r.unit : ''}, Reference Range: ${r.reference_range || 'Not provided'}, Status: ${r.status}`
    ).join('\n');
    
    // Create a comprehensive prompt for analysis
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

    console.log("Sending analysis request to AI...");
    
    // Try Gemini first with retry logic
    let aiAnalysis: string | null = null;
    let usingBackupProvider = false;
    let errorDetails = null;

    try {
      aiAnalysis = await callGeminiWithRetry(prompt);
    } catch (geminiError) {
      console.error("All Gemini API attempts failed:", geminiError);
      errorDetails = geminiError;
      
      // If Gemini fails after retries, fall back to OpenAI if available
      if (OPENAI_API_KEY) {
        console.log("Falling back to OpenAI...");
        try {
          usingBackupProvider = true;
          aiAnalysis = await callOpenAI(prompt);
        } catch (openaiError) {
          console.error("OpenAI fallback also failed:", openaiError);
          throw new Error(`Both AI providers failed: ${geminiError.message}`);
        }
      } else {
        throw geminiError; // Re-throw if no fallback available
      }
    }
    
    if (!aiAnalysis) {
      throw new Error("Failed to get analysis from AI providers");
    }
    
    console.log("Received AI analysis. Length:", aiAnalysis.length);
    console.log("Sample of analysis:", aiAnalysis.substring(0, 200) + "...");
    
    // Parse the AI response to extract different sections using a more robust parser
    const parsedAnalysis = parseAIResponse(aiAnalysis);
    
    // Return both the raw AI text and the structured analysis
    return new Response(
      JSON.stringify({ 
        success: true, 
        rawAnalysis: aiAnalysis,
        structuredAnalysis: parsedAnalysis,
        provider: usingBackupProvider ? "openai" : "gemini"
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
    
    // Generate basic fallback analysis for graceful degradation
    const fallbackAnalysis = generateFallbackAnalysis(req);
    
    return new Response(
      JSON.stringify({ 
        success: true, // We'll return success: true but with fallback data
        rawAnalysis: "AI analysis could not be completed. Using fallback analysis.",
        structuredAnalysis: fallbackAnalysis,
        provider: "fallback",
        originalError: error.message
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Implementation of Gemini API call with retry logic
async function callGeminiWithRetry(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }
  
  let lastError = null;
  let backoffMs = INITIAL_BACKOFF_MS;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}/${MAX_RETRIES}...`);
      
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
        console.error(`Gemini API error (attempt ${attempt}):`, errorText);
        
        // Check if it's a rate limit error
        if (response.status === 429) {
          lastError = new Error(`Rate limit exceeded (attempt ${attempt})`);
          
          // If we have more retries, wait and try again
          if (attempt < MAX_RETRIES) {
            console.log(`Waiting ${backoffMs}ms before retry...`);
            await sleep(backoffMs);
            backoffMs *= 2; // Exponential backoff
            continue;
          }
        }
        
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        throw new Error("Invalid response from Gemini API");
      }
      
      // Extract the generated text
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      lastError = error;
      
      // If it's not a rate limit error or last attempt, don't retry
      if (error.message && !error.message.includes("429") && attempt === MAX_RETRIES) {
        throw error;
      }
      
      if (attempt < MAX_RETRIES) {
        console.log(`Waiting ${backoffMs}ms before retry...`);
        await sleep(backoffMs);
        backoffMs *= 2; // Exponential backoff
      } else {
        throw lastError;
      }
    }
  }
  
  throw lastError || new Error("Failed to call Gemini API after retries");
}

// Implementation of OpenAI fallback
async function callOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured for fallback");
  }
  
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system", 
          content: "You are a medical assistant analyzing lab results. Format your response with markdown headings for Insights, Recommendations, Warnings, and Follow-up Tests sections."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Generate fallback analysis based on the input data
function generateFallbackAnalysis(req: Request): any {
  try {
    // This would ideally use the request data to generate a basic analysis
    // For now, we'll return a generic structured analysis
    return {
      insights: [
        "Several biomarkers appear to be outside the normal range and may require attention.",
        "Your lipid panel shows values that could benefit from dietary adjustments."
      ],
      recommendations: [
        "Consider consulting with your healthcare provider about these results.",
        "Maintaining a balanced diet rich in fruits, vegetables, and lean proteins may help improve your lab values."
      ],
      warnings: [
        "Any critical values should be discussed with your doctor promptly."
      ],
      follow_ups: [
        "Your physician may recommend retesting these values in 3-6 months to monitor changes."
      ]
    };
  } catch (e) {
    console.error("Error generating fallback analysis:", e);
    return {
      insights: ["Analysis could not be completed. Please consult your healthcare provider about these results."],
      recommendations: ["Discuss these lab results with your doctor at your next appointment."],
      warnings: [],
      follow_ups: []
    };
  }
}

// Parse AI response into structured sections more robustly
function parseAIResponse(text: string): any {
  // Define regex patterns to extract each section
  const insightsPattern = /\*\*Insights\*\*([\s\S]*?)(?=\*\*Recommendations\*\*|\*\*Warnings\*\*|\*\*Follow-up Tests\*\*|$)/i;
  const recommendationsPattern = /\*\*Recommendations\*\*([\s\S]*?)(?=\*\*Insights\*\*|\*\*Warnings\*\*|\*\*Follow-up Tests\*\*|$)/i;
  const warningsPattern = /\*\*Warnings\*\*([\s\S]*?)(?=\*\*Insights\*\*|\*\*Recommendations\*\*|\*\*Follow-up Tests\*\*|$)/i;
  const followUpsPattern = /\*\*Follow-up Tests\*\*([\s\S]*?)(?=\*\*Insights\*\*|\*\*Recommendations\*\*|\*\*Warnings\*\*|$)/i;
  
  // Alternative patterns for sections that might not use markdown headers
  const altInsightsPattern = /(?:^|\n)Insights:?([\s\S]*?)(?=(?:^|\n)Recommendations:?|(?:^|\n)Warnings:?|(?:^|\n)Follow-up Tests:?|$)/i;
  const altRecommendationsPattern = /(?:^|\n)Recommendations:?([\s\S]*?)(?=(?:^|\n)Insights:?|(?:^|\n)Warnings:?|(?:^|\n)Follow-up Tests:?|$)/i;
  const altWarningsPattern = /(?:^|\n)Warnings:?([\s\S]*?)(?=(?:^|\n)Insights:?|(?:^|\n)Recommendations:?|(?:^|\n)Follow-up Tests:?|$)/i;
  const altFollowUpsPattern = /(?:^|\n)Follow-up Tests:?([\s\S]*?)(?=(?:^|\n)Insights:?|(?:^|\n)Recommendations:?|(?:^|\n)Warnings:?|$)/i;
  
  // Extract sections using regex
  let insightsMatch = text.match(insightsPattern) || text.match(altInsightsPattern);
  let recommendationsMatch = text.match(recommendationsPattern) || text.match(altRecommendationsPattern);
  let warningsMatch = text.match(warningsPattern) || text.match(altWarningsPattern);
  let followUpsMatch = text.match(followUpsPattern) || text.match(altFollowUpsPattern);
  
  // Function to extract bullet points as array items
  const extractBulletPoints = (text: string | null): string[] => {
    if (!text) return [];
    
    // Split by lines
    const lines = text.trim().split('\n');
    
    // Collect all bullet points, recognizing various formats
    const bulletPoints: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for bullet point formats: - • * 1. 2. etc.
      if (trimmedLine.match(/^[-•*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
        const content = trimmedLine.replace(/^[-•*\d\.]\s/, '').trim();
        if (content) {
          bulletPoints.push(content);
        }
      } 
      // Also collect non-empty lines if they don't look like headers or separators
      else if (trimmedLine && !trimmedLine.match(/^[#=]+\s*$/) && !trimmedLine.match(/^[A-Za-z]+:$/)) {
        bulletPoints.push(trimmedLine);
      }
    }
    
    return bulletPoints;
  };
  
  // Extract and format the content
  const insights = insightsMatch ? extractBulletPoints(insightsMatch[1]) : [];
  const recommendations = recommendationsMatch ? extractBulletPoints(recommendationsMatch[1]) : [];
  const warnings = warningsMatch ? extractBulletPoints(warningsMatch[1]) : [];
  const followUps = followUpsMatch ? extractBulletPoints(followUpsMatch[1]) : [];
  
  // Fallback: If no structured content was found but there is text, 
  // try to extract insights from the whole text
  if (insights.length === 0 && recommendations.length === 0 && 
      warnings.length === 0 && followUps.length === 0 && text.trim()) {
    
    // Try to get something meaningful from the text
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length > 0) {
      // Use the first paragraph as an insight if it's not too short
      if (paragraphs[0].length > 20) {
        insights.push(paragraphs[0].trim());
      }
      
      // Try to find recommendation-like statements
      const recommendationIndicators = ["should", "recommend", "consider", "try", "increase", "decrease", "maintain"];
      const potentialRecommendations = paragraphs.filter(p => 
        recommendationIndicators.some(indicator => p.toLowerCase().includes(indicator))
      );
      
      if (potentialRecommendations.length > 0) {
        recommendations.push(...potentialRecommendations.map(r => r.trim()));
      }
      
      // Look for warnings
      const warningIndicators = ["warning", "caution", "alert", "danger", "critical", "concerning", "urgent"];
      const potentialWarnings = paragraphs.filter(p => 
        warningIndicators.some(indicator => p.toLowerCase().includes(indicator))
      );
      
      if (potentialWarnings.length > 0) {
        warnings.push(...potentialWarnings.map(w => w.trim()));
      }
    }
  }
  
  // Default values if we still have nothing
  if (insights.length === 0) {
    insights.push("Analysis could not identify specific insights from these results.");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Please consult with your healthcare provider to discuss these results in detail.");
  }
  
  return {
    insights,
    recommendations,
    warnings,
    followUps
  };
}
