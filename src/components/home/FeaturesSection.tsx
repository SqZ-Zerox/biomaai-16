
import React from "react";
import { motion } from "framer-motion";
import { Dna, Apple, Dumbbell, Heart, MessageSquare, ChartLine, Smartphone, Package, Brain, Leaf, TestTube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <TestTube className="h-6 w-6 text-primary" />,
      title: "Lab Test Analysis",
      description: "Upload your blood work and receive comprehensive insights with biomarkers explained in everyday language.",
      comingSoon: false,
      delay: 0
    },
    {
      icon: <Dna className="h-6 w-6 text-primary" />,
      title: "Genetic Analysis",
      description: "Unlock insights from your DNA to better understand your health predispositions and optimize your wellness journey.",
      comingSoon: true,
      delay: 0.1
    },
    {
      icon: <Apple className="h-6 w-6 text-primary" />,
      title: "Personalized Nutrition",
      description: "Get tailored food recommendations based on your unique biomarkers and health goals.",
      comingSoon: false,
      delay: 0.2
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Holistic Wellness",
      description: "Integrate spiritual, mental, and physical health practices in one personalized wellness plan.",
      comingSoon: false,
      delay: 0.3
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Mental Clarity",
      description: "Access guided meditations and mental exercises tailored to your cognitive profile and stress patterns.",
      comingSoon: false,
      delay: 0.4
    },
    {
      icon: <Leaf className="h-6 w-6 text-primary" />,
      title: "Spiritual Health",
      description: "Align your wellness journey with your personal beliefs and spiritual practices.",
      comingSoon: false,
      delay: 0.5
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "AI Health Advisor",
      description: "Chat with our AI to answer questions about your health data and get personalized advice.",
      comingSoon: false,
      delay: 0.6
    },
    {
      icon: <ChartLine className="h-6 w-6 text-primary" />,
      title: "BIOMASCORE",
      description: "Track your overall health progress with our proprietary scoring system that gamifies your wellness journey.",
      comingSoon: true,
      delay: 0.7
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Wearable Integration",
      description: "Connect your favorite fitness devices to enhance your health tracking and personalized recommendations.",
      comingSoon: true,
      delay: 0.8
    },
    {
      icon: <Package className="h-6 w-6 text-primary" />,
      title: "Genetic Testing Kit",
      description: "Our future offering will include custom genetic testing kits to unlock your genetic potential.",
      comingSoon: true,
      delay: 0.9
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Holistic Health & Wellness</h2>
          <p className="text-lg text-muted-foreground">
            BIOMA AI bridges the gap between confusing health data and actionable insights,
            creating a holistic, affordable AI-driven health companion that guides you with
            clarity from your biology to your beliefs.
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
              
              {feature.comingSoon && (
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
