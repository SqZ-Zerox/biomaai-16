
import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  GraduationCap, 
  Scale, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Library,
  CaseIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TestimonialCard from "@/components/home/TestimonialCard";
import FeatureCard from "@/components/home/FeatureCard";
import HeroSection from "@/components/home/HeroSection";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Scale className="h-10 w-10 text-primary" />,
      title: "Case Brief Generator",
      description: "Transform complex legal cases into clear, concise briefs in seconds.",
      path: "/case-brief"
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "AI Legal Chat",
      description: "Get instant answers to your legal questions from our AI assistant.",
      path: "/chat"
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Legal Essay Assistant",
      description: "Write better legal essays with AI-powered suggestions and formatting.",
      path: "/legal-essays"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Study Resources",
      description: "Access comprehensive study materials organized by legal subjects.",
      path: "/study"
    },
    {
      icon: <Library className="h-10 w-10 text-primary" />,
      title: "Flashcards",
      description: "Master legal concepts with customizable flashcards and spaced repetition.",
      path: "/flashcards"
    },
    {
      icon: <CheckSquare className="h-10 w-10 text-primary" />,
      title: "Productivity Hub",
      description: "Stay organized with task management tools designed for law students.",
      path: "/study-plan"
    }
  ];

  const testimonials = [
    {
      quote: "LegalAid completely transformed how I prepare for my law classes. The case brief generator alone saved me hours every week.",
      author: "Sarah K.",
      role: "2L Student, Harvard Law",
      avatar: "/avatars/avatar-1.png"
    },
    {
      quote: "The AI chat feature helped me understand complex legal concepts that I was struggling with for weeks. It's like having a tutor available 24/7.",
      author: "James T.",
      role: "1L Student, NYU Law",
      avatar: "/avatars/avatar-2.png"
    },
    {
      quote: "As someone juggling law school and family responsibilities, the productivity tools have been invaluable for keeping me on track.",
      author: "Michelle R.",
      role: "3L Student, UC Berkeley",
      avatar: "/avatars/avatar-3.png"
    }
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Powerful Tools for Law Students
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Everything you need to excel in your legal studies, all in one platform
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => navigate(feature.path)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">How LegalAid Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple process designed to help you learn more efficiently
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Your Tool</h3>
              <p className="text-muted-foreground">
                Select from our suite of specialized legal study tools based on your current need
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Input Your Content</h3>
              <p className="text-muted-foreground">
                Upload your materials or enter your questions to get started
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive instant, high-quality assistance tailored to your specific legal studies needs
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">What Law Students Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by law students at top universities across the country
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div 
          className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Legal Studies?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of law students who are studying smarter, not harder, with LegalAid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/study")} className="px-8">
              Explore Study Tools
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/chat")} className="px-8">
              Try AI Chat <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
