
import React from "react";
import { motion } from "framer-motion";
import { 
  Dna, Apple, Heart, MessageSquare, ChartLine, 
  Smartphone, Package, Brain, Leaf, TestTube, 
  Trophy, BarChart3, CheckCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const FeaturesSection: React.FC = () => {
  const featureCategories = [
    {
      title: "Core Features",
      description: "Available right now to help you on your wellness journey",
      features: [
        {
          icon: <TestTube className="h-6 w-6 text-primary" />,
          title: "Lab Test Analysis",
          description: "Upload your blood work and receive comprehensive insights with biomarkers explained in everyday language.",
          highlight: true
        },
        {
          icon: <MessageSquare className="h-6 w-6 text-primary" />,
          title: "AI Health Advisor",
          description: "Chat with our AI to answer questions about your health data and get personalized advice.",
          highlight: false
        },
        {
          icon: <Apple className="h-6 w-6 text-primary" />,
          title: "Personalized Nutrition",
          description: "Get tailored food recommendations based on your unique biomarkers and health goals.",
          highlight: false
        },
        {
          icon: <Heart className="h-6 w-6 text-primary" />,
          title: "Holistic Wellness",
          description: "Integrate spiritual, mental, and physical health practices in one personalized wellness plan.",
          highlight: false
        },
        {
          icon: <Brain className="h-6 w-6 text-primary" />,
          title: "Mental Clarity",
          description: "Access guided meditations and mental exercises tailored to your cognitive profile and stress patterns.",
          highlight: false
        },
        {
          icon: <Leaf className="h-6 w-6 text-primary" />,
          title: "Spiritual Health",
          description: "Align your wellness journey with your personal beliefs and spiritual practices.",
          highlight: false
        }
      ]
    },
    {
      title: "Coming Soon",
      description: "Exciting new features we're developing for you",
      upcoming: true,
      features: [
        {
          icon: <Dna className="h-6 w-6 text-primary" />,
          title: "Genetic Analysis",
          description: "Unlock insights from your DNA to better understand your health predispositions and optimize your wellness journey.",
          highlight: true
        },
        {
          icon: <ChartLine className="h-6 w-6 text-primary" />,
          title: "BIOMASCORE",
          description: "Track your overall health progress with our proprietary scoring system that gamifies your wellness journey.",
          highlight: false
        },
        {
          icon: <Trophy className="h-6 w-6 text-primary" />,
          title: "Gamified Progress Tracking",
          description: "Turn your health journey into an engaging adventure with achievements, milestones, and rewards.",
          highlight: false
        },
        {
          icon: <Smartphone className="h-6 w-6 text-primary" />,
          title: "Wearable Integration",
          description: "Connect your favorite fitness devices to enhance your health tracking and personalized recommendations.",
          highlight: false
        },
        {
          icon: <Package className="h-6 w-6 text-primary" />,
          title: "Genetic Testing Kit",
          description: "Our future offering will include custom genetic testing kits to unlock your genetic potential.",
          highlight: false
        }
      ]
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
        
        {featureCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-20 last:mb-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-10"
            >
              <div className="relative inline-block">
                <h3 className="text-2xl md:text-3xl font-bold relative z-10">{category.title}</h3>
                {category.upcoming && (
                  <div className="absolute -inset-1 bg-primary/10 rounded-lg blur-sm -z-10"></div>
                )}
              </div>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {category.description}
              </p>
              {category.upcoming && (
                <div className="flex justify-center mt-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    In Development
                  </Badge>
                </div>
              )}
            </motion.div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`}>
              {category.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative ${feature.highlight ? 'lg:col-span-3 md:col-span-2' : ''}`}
                >
                  {feature.highlight && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-lg -z-10"></div>
                  )}
                  <Card className={`h-full border-border/30 hover:border-primary/40 transition-all duration-300 bg-card backdrop-blur-sm p-6 ${feature.highlight ? 'md:flex md:items-center md:gap-8' : ''}`}>
                    <div className={feature.highlight ? 'md:flex-shrink-0' : ''}>
                      <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 ${feature.highlight ? 'md:h-16 md:w-16' : ''}`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-2 flex items-center gap-2 ${feature.highlight ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                        {feature.title}
                        {category.upcoming && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            Coming Soon
                          </Badge>
                        )}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                      
                      {feature.highlight && (
                        <div className="mt-4 flex items-center gap-2">
                          {category.upcoming ? (
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Join Waitlist
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available Now
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
