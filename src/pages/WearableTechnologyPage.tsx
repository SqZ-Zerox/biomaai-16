
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Smartphone, Heart, LineChart, Laptop, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const WearableTechnologyPage = () => {
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

  const deviceVariants = {
    hidden: { opacity: 0, x: -10 },
    show: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: {
        delay: i * 0.1
      }
    })
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
            Wearable Technology
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
            Seamlessly connect your favorite fitness trackers and health devices to enhance your wellness journey with real-time data and insights.
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
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                    whileHover={{ rotate: 360, transition: { duration: 1.5 } }}
                  >
                    <Watch className="h-5 w-5 text-primary" />
                  </motion.div>
                  <CardTitle className="text-lg">Device Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Connect your smartwatches, fitness trackers, and health monitors for continuous health tracking.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                    whileHover={{ scale: [1, 1.2, 0.9, 1.1, 1], transition: { duration: 0.5 } }}
                  >
                    <Heart className="h-5 w-5 text-primary" />
                  </motion.div>
                  <CardTitle className="text-lg">Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track heart rate, sleep patterns, activity levels, stress, and other vital health metrics in one place.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="hover-lift">
              <Card className="bg-card/50 backdrop-blur border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                    whileHover={{ y: [0, -5, 0], transition: { duration: 0.5, repeat: 1 } }}
                  >
                    <LineChart className="h-5 w-5 text-primary" />
                  </motion.div>
                  <CardTitle className="text-lg">Smart Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receive AI-driven insights from your continuous health data to optimize your daily activities.
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
            <h3 className="text-xl font-semibold mb-3">Compatible Devices</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                { icon: Watch, name: "Apple Watch" },
                { icon: Watch, name: "Fitbit" },
                { icon: Watch, name: "Garmin" },
                { icon: Smartphone, name: "Google Fit" },
                { icon: Smartphone, name: "Samsung Health" },
                { icon: Watch, name: "Oura Ring" },
              ].map((device, i) => (
                <motion.div 
                  key={device.name}
                  custom={i}
                  variants={deviceVariants}
                  initial="hidden"
                  animate="show"
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40 hover:border-primary/20 transition-colors duration-300"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    <device.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">{device.name}</div>
                </motion.div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              And many more devices to be supported at launch.
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-8 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-lg p-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h3 className="text-xl font-semibold mb-3">How It Will Work</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Connect Your Device</p>
                  <p className="text-sm text-muted-foreground">Easily pair your wearable devices using our secure connection protocol. No technical expertise required.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Automatic Syncing</p>
                  <p className="text-sm text-muted-foreground">Your health data syncs automatically in the background, ensuring your dashboard always shows the latest information.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Comprehensive Dashboard</p>
                  <p className="text-sm text-muted-foreground">View all your wearable data alongside lab results and other health metrics in a unified dashboard.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">AI-Powered Insights</p>
                  <p className="text-sm text-muted-foreground">Receive personalized recommendations based on patterns detected in your continuous health data.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="bg-primary/5 border-primary/20 hover:bg-primary/10 btn-hover-effect">
                <Laptop className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary hover:bg-primary/90 btn-hover-effect">
                <ArrowRight className="h-4 w-4 mr-2" />
                Join Beta
              </Button>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-muted-foreground text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            We're integrating with major wearable technology providers to bring you a seamless experience for monitoring your health in real-time.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default WearableTechnologyPage;
