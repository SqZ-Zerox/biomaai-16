
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface StepFourProps {
  location: string;
  setLocation: (location: string) => void;
}

const StepFour: React.FC<StepFourProps> = ({ location, setLocation }) => {
  const [searchTerm, setSearchTerm] = useState(location);
  
  const commonLocations = [
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Paris, France",
    "Berlin, Germany"
  ];

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setSearchTerm(selectedLocation);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Where are you located?</h2>
        <p className="text-muted-foreground">
          This helps us recommend meals with locally available ingredients
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="location" className="text-base">Your Location</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter your location (city, country)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button 
              variant="secondary" 
              onClick={() => setLocation(searchTerm)}
            >
              <Search className="h-4 w-4 mr-2" />
              Set
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your location helps us suggest meals with seasonally available ingredients
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Common Locations</Label>
          <div className="flex flex-wrap gap-2">
            {commonLocations.map((loc) => (
              <Button
                key={loc}
                variant="outline"
                size="sm"
                className={`${
                  location === loc ? "bg-primary/20 border-primary" : ""
                }`}
                onClick={() => handleLocationSelect(loc)}
              >
                {loc}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
