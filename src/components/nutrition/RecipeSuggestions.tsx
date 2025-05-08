
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Flame, Clock } from "lucide-react";
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
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="w-full overflow-hidden border border-border/40 hover:shadow-sm transition-all duration-200">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 h-48 relative">
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 p-5">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Flame className="h-3 w-3 mr-1" />{Math.round(recipe.calories)} cal
                    </Badge>
                    {recipe.dietLabels.map((label, i) => (
                      <Badge key={i} variant="outline">{label}</Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl">{recipe.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">From {recipe.source}</p>
                </CardHeader>
                <CardContent className="p-0 pb-4">
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {recipe.ingredients.slice(0, 5).map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                      {recipe.ingredients.length > 5 && (
                        <li>And {recipe.ingredients.length - 5} more...</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="p-0 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                      View Recipe
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipeSuggestions;
