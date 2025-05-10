
// Helper function to parse Gemini's response
export const parseGeminiResponse = (response: string) => {
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
  let insightsMatch = response.match(insightsPattern) || response.match(altInsightsPattern);
  let recommendationsMatch = response.match(recommendationsPattern) || response.match(altRecommendationsPattern);
  let warningsMatch = response.match(warningsPattern) || response.match(altWarningsPattern);
  let followUpsMatch = response.match(followUpsPattern) || response.match(altFollowUpsPattern);
  
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
      warnings.length === 0 && followUps.length === 0 && response.trim()) {
    
    // Try to get something meaningful from the text
    const paragraphs = response.split('\n\n').filter(p => p.trim());
    
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
};
