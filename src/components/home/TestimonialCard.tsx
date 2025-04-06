
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  avatar,
  delay = 0
}) => {
  // Extract initials for avatar fallback
  const initials = author
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="mb-4 text-primary/50">
            <QuoteIcon size={24} />
          </div>
          <p className="italic text-muted-foreground mb-4">"{quote}"</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
