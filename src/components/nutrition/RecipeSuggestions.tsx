
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Flame, Clock, Star } from "lucide-react";
import { RecipeSuggestion } from "./types";

interface RecipeSuggestionsProps {
  recipes: RecipeSuggestion[];
  isLoading: boolean;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ 
  recipes, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full overflow-hidden border border-border/40">
            <div className="flex flex-col md:flex-row animate-pulse">
              <div className="w-full md:w-1/4 bg-muted h-48"></div>
              <div className="p-5 flex-1">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (recipes.length === 0) {
    return (
      <Card className="w-full border border-border/40 p-8 text-center">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No recipe suggestions found. Try adjusting your preferences.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Recipe Suggestions</h2>
      <div className="space-y-4">
        {recipes.map((recipe) => {
          const isAIGenerated = recipe.source === "AI Assistant" || recipe.url === "#";
          
          return (
            <Card key={recipe.id} className="w-full overflow-hidden border border-border/40 hover:shadow-sm transition-all duration-200">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 h-48 relative">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name} 
                    className="h-full w-full object-cover"
                  />
                  {isAIGenerated && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/80 text-white">AI Generated</Badge>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5">
                  <CardHeader className="p-0 pb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Flame className="h-3 w-3 mr-1" />{Math.round(recipe.calories)} cal
                      </Badge>
                      {recipe.dietLabels && recipe.dietLabels.map((label, i) => (
                        <Badge key={i} variant="outline">{label}</Badge>
                      ))}
                      {isAIGenerated && (
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                          <Star className="h-3 w-3 mr-1" />AI Recommendation
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{recipe.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">From {recipe.source}</p>
                  </CardHeader>
                  <CardContent className="p-0 pb-4">
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                      {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                          {recipe.ingredients.slice(0, 5).map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                          {recipe.ingredients.length > 5 && (
                            <li>And {recipe.ingredients.length - 5} more...</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          This AI-generated recipe doesn't include detailed ingredients. You can ask the AI for more information.
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 pt-2">
                    {!isAIGenerated ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                          View Recipe
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => {
                        // This would typically navigate to a detail page or open a modal
                        // For now, we'll just show an alert
                        alert(`This is an AI-generated recipe suggestion: ${recipe.name}`);
                      }}>
                        Get More Details
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeSuggestions;
