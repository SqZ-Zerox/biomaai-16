
import React from "react";
import { motion } from "framer-motion";
import { Dna, ArrowRight, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GeneticAnalysisBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <Alert className="bg-gradient-to-r from-primary/15 to-background border border-primary/30 shadow-sm shadow-primary/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2.5 bg-primary/15 rounded-full">
            <Dna className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <AlertTitle className="text-lg font-bold">
                Genetic Analysis
              </AlertTitle>
              <Badge variant="outline" className="bg-primary/15 border-primary/30 text-primary font-medium">Coming Soon</Badge>
            </div>
            <AlertDescription className="mt-2">
              <p className="text-muted-foreground mb-2">
                While we're currently showcasing our lab test analysis capabilities, our true potential lies in advanced genetic analysis. 
                Stay tuned as we develop tools to decode your DNA and provide even more personalized health insights.
              </p>
              <p className="text-sm text-muted-foreground/80 italic">
                Experience lab test analysis today to see just a glimpse of what our genetic analysis will offer in the near future.
              </p>
            </AlertDescription>
          </div>
          <Button variant="outline" className="mt-2 sm:mt-0 whitespace-nowrap border-primary/30 text-primary hover:bg-primary hover:text-white">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </motion.div>
  );
};

export default GeneticAnalysisBanner;
