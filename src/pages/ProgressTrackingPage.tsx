
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ProgressTrackingPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div 
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background to-primary/5 p-10 border border-border/40 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-30 backdrop-blur-sm"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary/5 rounded-full filter blur-xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-primary/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Progress Tracking
          </motion.h1>

          <motion.div 
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium badge-pulse"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Coming Soon
          </motion.div>

          <motion.p 
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Your personalized, gamified progress dashboard to track wellness goals, streaks, points, and milestones.
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Goal Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Set personal wellness targets and visualize your journey with intuitive charts.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Activity Streaks</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Build habits through consistent activity tracking and achievement streaks.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Unlock badges and rewards as you reach important health milestones.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-muted-foreground text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            We're working hard to bring you a comprehensive progress tracking experience that will help you visualize your health journey and stay motivated to achieve your wellness goals.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Badge className="bg-primary/10 text-primary hover:bg-primary/15">
              Coming Q3 2025
            </Badge>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressTrackingPage;
