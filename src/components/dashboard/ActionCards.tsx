
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Apple, Dumbbell, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ActionCards: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-bold mb-3">Recommended Actions</h2>
      
      {/* Primary CTA Card */}
      <Card className="bg-primary text-primary-foreground mb-4 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-4`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Apple className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Nutrition Plan</h3>
                <p className="text-sm text-primary-foreground/90 mt-1">
                  Get personalized meal plans based on your health data
                </p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="whitespace-nowrap"
              onClick={() => navigate("/nutrition")}
              size={isMobile ? "sm" : "default"}
            >
              Create Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Secondary Card */}
      <Card className="border-border/40 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-4`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fitness Routine Builder</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create workouts optimized for your health goals
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="whitespace-nowrap border-primary/30 text-primary hover:bg-primary hover:text-white"
              onClick={() => navigate("/fitness")}
              size={isMobile ? "sm" : "default"}
            >
              Build Routine
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActionCards;
