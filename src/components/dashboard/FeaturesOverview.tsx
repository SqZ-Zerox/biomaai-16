
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Apple, Dumbbell, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const FeaturesOverview: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Lab Report Analysis",
      description: "Upload your lab reports to get detailed insights and personalized recommendations",
      route: "/upload",
      buttonText: "Upload Report",
      delay: 0.1
    },
    {
      icon: <Apple className="h-6 w-6 text-primary" />,
      title: "AI-Powered Nutrition Planning",
      description: "Get tailored meal plans based on your lab results and dietary preferences",
      route: "/nutrition",
      buttonText: "Plan Meals",
      delay: 0.2
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      title: "Fitness Planning",
      description: "Create adaptive workout routines optimized for your body's condition",
      route: "/fitness",
      buttonText: "Build Workout",
      delay: 0.3
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "Bioma Bot Chat",
      description: "Ask health questions and get personalized advice from our AI assistant",
      route: "/chat",
      buttonText: "Start Chat",
      delay: 0.4
    }
  ];
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Core Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: feature.delay }}
          >
            <Card className="h-full border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    {feature.icon}
                  </div>
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">{feature.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white"
                  onClick={() => navigate(feature.route)}
                  size={isMobile ? "sm" : "default"}
                >
                  {feature.buttonText}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesOverview;
