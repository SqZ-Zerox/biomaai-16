
import React from "react";
import { motion } from "framer-motion";
import { Dna, Apple, Dumbbell, Heart, MessageSquare, ChartLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Dna className="h-6 w-6 text-primary" />,
      title: "Lab Test Analysis",
      description: "Upload your blood work and receive comprehensive insights and health markers explained in plain language.",
      delay: 0
    },
    {
      icon: <Apple className="h-6 w-6 text-primary" />,
      title: "Personalized Nutrition",
      description: "Get tailored food recommendations based on your unique biomarkers and health goals.",
      delay: 0.1
    },
    {
      icon: <Dumbbell className="h-6 w-6 text-primary" />,
      title: "Fitness Recommendations",
      description: "Receive exercise plans calibrated to your physiology and fitness level for optimal results.",
      delay: 0.2
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Health Monitoring",
      description: "Track improvements in your biomarkers over time and get alerts for concerning changes.",
      delay: 0.3
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "AI Health Advisor",
      description: "Chat with our AI to answer questions about your health data and get personalized advice.",
      delay: 0.4
    },
    {
      icon: <ChartLine className="h-6 w-6 text-primary" />,
      title: "Progress Tracking",
      description: "Visualize your health journey with intuitive charts and metrics to stay motivated.",
      delay: 0.5
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="features">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Health Analysis</h2>
          <p className="text-lg text-muted-foreground">
            Our AI analyzes your lab test results to create personalized health recommendations today, 
            with genetic analysis coming soon.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-card border border-border/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              
              {feature.title.includes("Genetic") && (
                <Badge className="mt-3 bg-primary/10 text-primary border-primary/20">
                  Coming Soon
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
