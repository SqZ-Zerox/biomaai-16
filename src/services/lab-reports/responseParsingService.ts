
// Helper function to parse Gemini's response
export const parseGeminiResponse = (response: string) => {
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
