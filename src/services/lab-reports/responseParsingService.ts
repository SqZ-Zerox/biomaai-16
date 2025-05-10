
// Helper function to parse AI's response
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
  
  // More variants to increase robustness
  const h1InsightsPattern = /(?:^|\n)# Insights([\s\S]*?)(?=(?:^|\n)# Recommendations|(?:^|\n)# Warnings|(?:^|\n)# Follow-up Tests|$)/i;
  const h1RecommendationsPattern = /(?:^|\n)# Recommendations([\s\S]*?)(?=(?:^|\n)# Insights|(?:^|\n)# Warnings|(?:^|\n)# Follow-up Tests|$)/i;
  const h1WarningsPattern = /(?:^|\n)# Warnings([\s\S]*?)(?=(?:^|\n)# Insights|(?:^|\n)# Recommendations|(?:^|\n)# Follow-up Tests|$)/i;
  const h1FollowUpsPattern = /(?:^|\n)# Follow-up Tests([\s\S]*?)(?=(?:^|\n)# Insights|(?:^|\n)# Recommendations|(?:^|\n)# Warnings|$)/i;
  
  // Extract sections using regex with multiple pattern attempts
  let insightsMatch = response.match(insightsPattern) || 
                       response.match(altInsightsPattern) || 
                       response.match(h1InsightsPattern);
                       
  let recommendationsMatch = response.match(recommendationsPattern) || 
                             response.match(altRecommendationsPattern) ||
                             response.match(h1RecommendationsPattern);
                             
  let warningsMatch = response.match(warningsPattern) || 
                      response.match(altWarningsPattern) ||
                      response.match(h1WarningsPattern);
                      
  let followUpsMatch = response.match(followUpsPattern) || 
                       response.match(altFollowUpsPattern) ||
                       response.match(h1FollowUpsPattern);
  
  // Function to extract bullet points as array items
  const extractBulletPoints = (text: string | null): string[] => {
    if (!text) return [];
    
    // Split by lines
    const lines = text.trim().split('\n');
    
    // Collect all bullet points, recognizing various formats
    const bulletPoints: string[] = [];
    let currentPoint = "";
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check for bullet point formats: - • * 1. 2. etc.
      if (trimmedLine.match(/^[-•*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
        // If we have a current point stored, add it first
        if (currentPoint) {
          bulletPoints.push(currentPoint);
          currentPoint = "";
        }
        
        // Extract the new point
        const content = trimmedLine.replace(/^[-•*\d\.]\s/, '').trim();
        
        // Check if this is a bullet with follow-on text or a standalone point
        if (content.endsWith(':')) {
          currentPoint = content.slice(0, -1); // Remove the trailing colon
        } else if (content) {
          bulletPoints.push(content);
        }
      } 
      // This might be a continuation of the previous bullet point
      else if (currentPoint) {
        currentPoint += " " + trimmedLine;
        
        // Check if this completes the thought
        if (trimmedLine.endsWith('.') || trimmedLine.endsWith('!') || trimmedLine.endsWith('?')) {
          bulletPoints.push(currentPoint);
          currentPoint = "";
        }
      }
      // If not a continuation and not a bullet, it might be a paragraph or standalone text
      else if (trimmedLine && !trimmedLine.match(/^[#=]+\s*$/) && !trimmedLine.match(/^[A-Za-z]+:$/)) {
        // Only add paragraphs that look meaningful - at least 15 chars
        if (trimmedLine.length >= 15) {
          bulletPoints.push(trimmedLine);
        }
      }
    }
    
    // Don't forget any trailing point
    if (currentPoint) {
      bulletPoints.push(currentPoint);
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
    
    console.log("No structured sections found. Using fallback content extraction.");
    
    // Try to get something meaningful from the text
    const paragraphs = response.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length > 0) {
      // Check if the response starts with a general assessment
      const firstParagraph = paragraphs[0].trim();
      if (firstParagraph.length > 30) {
        insights.push(firstParagraph);
      }
      
      // Try to find recommendation-like statements
      const recommendationIndicators = ["should", "recommend", "consider", "try", "increase", "decrease", "maintain", "follow", "avoid"];
      const potentialRecommendations = paragraphs.filter(p => 
        recommendationIndicators.some(indicator => p.toLowerCase().includes(indicator)) && 
        !insights.includes(p.trim())
      );
      
      if (potentialRecommendations.length > 0) {
        recommendations.push(...potentialRecommendations.map(r => r.trim()));
      }
      
      // Look for warnings
      const warningIndicators = ["warning", "caution", "alert", "danger", "critical", "concerning", "urgent", "abnormal"];
      const potentialWarnings = paragraphs.filter(p => 
        warningIndicators.some(indicator => p.toLowerCase().includes(indicator)) && 
        !insights.includes(p.trim()) &&
        !recommendations.includes(p.trim())
      );
      
      if (potentialWarnings.length > 0) {
        warnings.push(...potentialWarnings.map(w => w.trim()));
      }
      
      // Look for follow-up suggestions
      const followUpIndicators = ["follow", "test", "monitor", "check", "retest", "evaluate", "assessment"];
      const potentialFollowUps = paragraphs.filter(p => 
        followUpIndicators.some(indicator => p.toLowerCase().includes(indicator)) && 
        !insights.includes(p.trim()) &&
        !recommendations.includes(p.trim()) &&
        !warnings.includes(p.trim())
      );
      
      if (potentialFollowUps.length > 0) {
        followUps.push(...potentialFollowUps.map(f => f.trim()));
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

/**
 * Helper function to extract meaningful content from unstructured text
 * This is used when regular parsing fails
 */
export const extractMeaningfulContent = (text: string) => {
  if (!text || !text.trim()) return null;
  
  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  if (paragraphs.length === 0) return null;
  
  // First paragraph is often a summary or introduction
  const summary = paragraphs[0].trim();
  
  // Look for key indicators in the text
  const abnormalValues = paragraphs.find(p => 
    p.toLowerCase().includes('abnormal') || 
    p.toLowerCase().includes('outside') ||
    p.toLowerCase().includes('elevated') ||
    p.toLowerCase().includes('low')
  );
  
  const recommendations = paragraphs.find(p => 
    p.toLowerCase().includes('recommend') || 
    p.toLowerCase().includes('suggest') ||
    p.toLowerCase().includes('advise')
  );
  
  const riskFactors = paragraphs.find(p => 
    p.toLowerCase().includes('risk') || 
    p.toLowerCase().includes('concern')
  );
  
  return {
    summary,
    abnormalValues: abnormalValues || null,
    recommendations: recommendations || null,
    riskFactors: riskFactors || null
  };
};
