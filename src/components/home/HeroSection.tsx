
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, GraduationCap, Scale, BookText, Bookmark } from "lucide-react";
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
      icon: <Scale className="h-5 w-5 text-primary" />,
      text: "Case Brief Generator"
    },
    {
      icon: <BookText className="h-5 w-5 text-primary" />,
      text: "Smart Study Tools"
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      text: "Personalized Learning"
    },
    {
      icon: <Bookmark className="h-5 w-5 text-primary" />,
      text: "Powerful Research"
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
                  Legal Education, Reimagined
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    Master Legal Studies
                  </span>{" "}
                  <br className="hidden md:inline" />
                  <span>With AI-Powered Tools</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your comprehensive legal education platform that simplifies studying, 
                research, and case analysis with intelligent AI assistance.
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
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/chat")}
                className="h-12 px-6 rounded-full"
              >
                Try Law Assistant
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by law students from</p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center">
                <div className="text-muted-foreground/70 font-semibold">Harvard Law</div>
                <div className="text-muted-foreground/70 font-semibold">Stanford Law</div>
                <div className="text-muted-foreground/70 font-semibold">Yale Law</div>
                <div className="text-muted-foreground/70 font-semibold">Columbia Law</div>
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
                    <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                    Your Learning Hub
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-muted/50 border border-border/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Scale className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Case Brief Progress</h4>
                          <p className="text-xs text-muted-foreground mt-1">Constitutional Law · Brown v. Board of Education</p>
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
                          <h4 className="font-medium text-sm">Study Streak</h4>
                          <p className="text-xs text-muted-foreground mt-1">You've been consistently studying for 7 days</p>
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

                    <div className="bg-muted/50 border border-border/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <BookText className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Today's Focus</h4>
                          <p className="text-xs text-muted-foreground mt-1">Complete Constitutional Law case brief</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">3 tasks remaining</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    onClick={() => navigate("/login")}
                  >
                    Get Started
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 bg-card border border-border/40 shadow-lg rounded-lg p-3 w-48">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Case Brief Complete</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
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
