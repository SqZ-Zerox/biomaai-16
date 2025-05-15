
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, Dna, TestTube, Brain, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const yPos = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const features = [
    {
      icon: <TestTube className="h-5 w-5 text-primary" />,
      text: "Lab Test Analysis"
    },
    {
      icon: <Dna className="h-5 w-5 text-primary" />,
      text: "Genetic Analysis",
      badge: "Coming Soon"
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      text: "Holistic Wellness"
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      text: "AI Health Advisor"
    }
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/3 rounded-full filter blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-primary/3 rounded-full filter blur-3xl" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background pointer-events-none" />
      </div>

      <motion.div 
        className="container px-4 md:px-6 mx-auto relative z-10"
        style={{ opacity, y: yPos }}
      >
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-2 text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20 rounded-full">
                  Holistic Health & Wellness
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    AI-powered Health
                  </span>{" "}
                  <br className="hidden md:inline" />
                  <span>For <span className="text-primary">Every Body</span>, Every Day</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Decode your body, optimize your lifestyle, and align your healing journey with personalized 
                AI guidance for your physical, mental, and spiritual health.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 font-medium rounded-full"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/login")}
                className="h-12 px-6 rounded-full"
              >
                Create Account
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by wellness seekers worldwide</p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center">
                <div className="text-muted-foreground/70 font-semibold">WellnessHub</div>
                <div className="text-muted-foreground/70 font-semibold">HolisticLife</div>
                <div className="text-muted-foreground/70 font-semibold">MindfulCare</div>
                <div className="text-muted-foreground/70 font-semibold">VitalBalance</div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1 w-full max-w-xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-lg opacity-50"></div>
              
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/40 rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-primary" />
                    Your Wellness Journey
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-muted/50 border border-border/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TestTube className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Lab Analysis Progress</h4>
                          <p className="text-xs text-muted-foreground mt-1">Comprehensive Health Panel</p>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 border border-border/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Wellness Streak</h4>
                          <p className="text-xs text-muted-foreground mt-1">You've been following your personalized plan for 7 days</p>
                          <div className="flex gap-1 mt-2">
                            {[...Array(7)].map((_, i) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Dna className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">Genetic Analysis</h4>
                            <Badge variant="outline" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/20">Coming Soon</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Our revolutionary DNA analysis capabilities are in development</p>
                          <p className="text-xs text-primary mt-2 font-medium">Join the waitlist →</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    onClick={() => navigate("/login")}
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-muted/30 border-t border-border/20 p-4">
                  <div className="flex flex-wrap gap-2 justify-around">
                    {features.map((feature, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center gap-1.5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.4 + (i * 0.1) }
                        }}
                      >
                        {feature.icon}
                        <span className="text-xs font-medium">{feature.text}</span>
                        {feature.badge && (
                          <Badge className="text-[8px] h-4 bg-primary/10 text-primary border-primary/20 ml-1">
                            {feature.badge}
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border/40 shadow-lg rounded-lg p-3 w-52">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">AI Health Advisor Ready</p>
                    <p className="text-xs text-muted-foreground">Ask questions about your health</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
