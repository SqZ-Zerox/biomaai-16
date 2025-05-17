
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Search, Check } from "lucide-react";

interface StepFourProps {
  location: string;
  setLocation: (location: string) => void;
}

const StepFour: React.FC<StepFourProps> = ({ location, setLocation }) => {
  const [searchTerm, setSearchTerm] = useState(location);
  
  const commonLocations = [
    "New York, USA", "Los Angeles, USA", "London, UK", "Paris, France", 
    "Berlin, Germany", "Tokyo, Japan", "Sydney, Australia", "Toronto, Canada"
  ];

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setSearchTerm(selectedLocation);
  };

  const handleSetCustomLocation = () => {
    setLocation(searchTerm.trim());
  }

  return (
    <div className="space-y-4"> {/* Reduced space-y-8 to space-y-4 */}
      {/* Removed redundant title section, now handled by NutritionPlanCreator */}

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Enter Your Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., City, Country"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
            <Button 
              onClick={handleSetCustomLocation}
              disabled={!searchTerm.trim() || searchTerm.trim() === location}
              size="lg"
            >
              <Search className="h-4 w-4 mr-2" />
              Set
            </Button>
          </div>
          <CardDescription className="text-xs">
            Providing your location helps us suggest meals with ingredients that are more likely to be seasonally available near you.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Or Select a Common Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {commonLocations.map((loc) => (
              <Button
                key={loc}
                variant={location === loc ? "default" : "outline"}
                size="sm"
                className={`transition-all duration-150 ease-in-out ${
                  location === loc ? "ring-2 ring-primary ring-offset-2 shadow-md" : "hover:bg-accent"
                }`}
                onClick={() => handleLocationSelect(loc)}
              >
                {location === loc && <Check className="mr-2 h-4 w-4" />}
                {loc}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFour;
