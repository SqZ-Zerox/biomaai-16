import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BookOpen, 
  Scale, 
  MessageSquare, 
  GraduationCap,
  FileText,
  CheckSquare,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary">Student Dashboard</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Welcome to Your <span className="text-primary">Legal Study</span> Hub
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Continue your legal studies journey with personalized tools and resources designed for your success.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" onClick={() => navigate("/chat")} className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md">
                Continue Learning <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/study")} className="border-primary/20 hover:bg-primary/5">
                My Study Hub
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">Case Briefs</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">Study Notes</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">Legal AI Chat</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm">Study Progress</span>
              </div>
            </motion.div>
          </div>
          
          {/* Hero image with recent activity */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl transform rotate-3 scale-105"></div>
              <div className="relative bg-card border border-border/40 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  
                  {/* Recent activity items */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contract Law Notes</p>
                        <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Scale className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Brown v. Board of Education Brief</p>
                        <p className="text-xs text-muted-foreground">Created yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/20">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <CheckSquare className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Prepare for Constitutional Law Exam</p>
                        <p className="text-xs text-muted-foreground">Due in 5 days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full text-primary" onClick={() => navigate("/study-plan")}>
                      View All Activities
                    </Button>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-4 border-t border-border/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Today's Focus</h4>
                      <p className="text-xs text-muted-foreground">Constitutional Law</p>
                    </div>
                    <div className="bg-primary/10 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-primary">3 tasks remaining</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                className="absolute -top-4 -left-4 bg-card shadow-lg p-3 rounded-lg border border-border/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Scale className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Case Brief</p>
                    <p className="text-xs text-muted-foreground">Generated in seconds</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-card shadow-lg p-3 rounded-lg border border-border/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Study Streak</p>
                    <p className="text-xs text-muted-foreground">7 days</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
