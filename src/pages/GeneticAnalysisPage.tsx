
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna, FlaskConical, Activity, Zap, Microscope, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const GeneticAnalysisPage = () => {
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
        <div className="absolute top-10 right-10 w-36 h-36 bg-primary/10 rounded-full filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-primary/5 rounded-full filter blur-xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-primary/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Genetic Analysis
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
            Unlock the secrets of your DNA and discover personalized health insights to optimize your wellness journey.
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
                    <Dna className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">DNA Sequencing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Upload your genetic test results or order our DNA test kit to receive comprehensive analysis.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Personalized Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receive detailed reports on health predispositions, ancestry, traits, and wellness factors.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Health Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get AI-powered recommendations tailored to your unique genetic profile and health goals.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-8 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-lg p-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-3">How It Will Work</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">DNA Collection</p>
                  <p className="text-sm text-muted-foreground">Order our at-home DNA collection kit or upload existing genetic test results from services like 23andMe or AncestryDNA.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Secure Analysis</p>
                  <p className="text-sm text-muted-foreground">Our advanced AI securely analyzes your genetic data, identifying key markers related to health, fitness, nutrition, and wellness.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Personalized Insights</p>
                  <p className="text-sm text-muted-foreground">Receive detailed reports about your genetic predispositions, health risks, optimal nutrition, and exercise recommendations.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">Integration with BIOMA</p>
                  <p className="text-sm text-muted-foreground">Your genetic insights will be seamlessly integrated with your lab results and health data to provide a comprehensive wellness plan.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="bg-primary/5 border-primary/20 hover:bg-primary/10 btn-hover-effect">
                <Microscope className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary hover:bg-primary/90 btn-hover-effect">
                <Server className="h-4 w-4 mr-2" />
                Join Waitlist
              </Button>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-muted-foreground text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            We're working to bring you cutting-edge genetic analysis that integrates with your health data for truly personalized wellness recommendations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <Badge variant="outline" className="mt-2 bg-primary/5 text-primary">
              Privacy-First Approach • HIPAA Compliant • Bank-Level Encryption
            </Badge>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GeneticAnalysisPage;
