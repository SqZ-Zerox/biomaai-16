
import React from "react";
import { motion } from "framer-motion";
import { Dna, TestTube, Microscope, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const GeneticFeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Dna className="h-8 w-8 text-primary" />,
      title: "DNA Analysis",
      description: "Unlock insights from your genetic makeup to understand predispositions and optimize health decisions.",
      comingSoon: true
    },
    {
      icon: <TestTube className="h-8 w-8 text-primary" />,
      title: "Lab Test Analysis",
      description: "Interpret your lab results with AI-powered insights to better understand your current health status.",
      comingSoon: false
    },
    {
      icon: <Microscope className="h-8 w-8 text-primary" />,
      title: "Genetic Risk Assessment",
      description: "Identify potential health risks based on your unique genetic profile and take preventative action.",
      comingSoon: true
    }
  ];

  return (
    <div className="py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold">Our Analysis Capabilities</h3>
          <p className="text-muted-foreground mt-1">
            Currently showcasing lab test analysis, with genetic analysis coming soon
          </p>
        </div>
        <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-white">
          Join Waitlist for Genetic Analysis <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            <Card className="h-full border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-lg">
                  {feature.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                  {feature.comingSoon && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Coming Soon</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full mt-1">
            <Dna className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Why we're focusing on Genetic Analysis</h4>
            <p className="text-sm text-muted-foreground mt-1">
              While our current lab test analysis provides valuable insights, genetic analysis represents the future of personalized healthcare. 
              By understanding your unique genetic makeup, we can provide significantly more tailored health recommendations and identify potential 
              issues before they manifest as symptoms. Our lab test analysis showcases the power of our AI, but genetic analysis will transform how 
              you understand and manage your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneticFeatureSection;
