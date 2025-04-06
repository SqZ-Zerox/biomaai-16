
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
  usageCount?: number;
  isPinned?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  onClick,
  delay = 0,
  usageCount,
  isPinned = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-md relative overflow-hidden">
        {isPinned && (
          <div className="absolute top-0 right-0">
            <Badge className="rounded-none rounded-bl-md bg-primary text-primary-foreground">Pinned</Badge>
          </div>
        )}
        <CardHeader>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
          
          {usageCount !== undefined && (
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <div className="w-full bg-primary/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/40 rounded-full"
                  style={{ width: `${Math.min(100, usageCount * 10)}%` }}
                ></div>
              </div>
              <span className="ml-2">{usageCount} uses</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="gap-1 p-0 h-auto group" 
            onClick={onClick}
          >
            <span className="text-primary transition-all group-hover:mr-1">Explore</span> 
            <ArrowRight className="h-4 w-4 ml-1 text-primary transition-all group-hover:translate-x-1" />
          </Button>
        </CardFooter>
        
        {/* Decorative corner accent */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/5 rounded-tl-xl"></div>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
