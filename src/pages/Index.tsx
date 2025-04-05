
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  MessageSquare,
  Calendar,
  Upload,
  Sparkles,
  BookOpenCheck,
  Lightbulb,
  Gavel,
  BookmarkCheck,
  Library,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    title: "Study Materials",
    description: "Access a comprehensive collection of study resources organized by subject.",
    link: "/study",
    badge: null,
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-primary" />,
    title: "AI Chat Assistant",
    description: "Get instant answers to legal questions and study guidance from our AI.",
    link: "/chat",
    badge: null,
  },
  {
    icon: <Calendar className="h-5 w-5 text-primary" />,
    title: "Productivity Hub",
    description: "Track tasks, set study schedules, and manage your academic calendar.",
    link: "/study-plan",
    badge: null,
  },
  {
    icon: <Upload className="h-5 w-5 text-primary" />,
    title: "Document Upload",
    description: "Upload your notes, cases, and study materials for easy access.",
    link: "/upload",
    badge: null,
  },
  {
    icon: <BookOpenCheck className="h-5 w-5 text-primary" />,
    title: "Legal Essays",
    description: "Create, edit, and manage your legal essays with AI assistance.",
    link: "/legal-essays",
    badge: null,
  },
  {
    icon: <Gavel className="h-5 w-5 text-primary" />,
    title: "Case Brief Generator",
    description: "Easily create and manage structured case briefs for your law studies.",
    link: "/case-brief",
    badge: { text: "New", variant: "default" },
  },
  {
    icon: <BookmarkCheck className="h-5 w-5 text-primary" />,
    title: "Legal Citation Tool",
    description: "Generate properly formatted citations in Bluebook, OSCOLA, AGLC and more.",
    link: "/citation-tool",
    badge: { text: "New", variant: "default" },
  },
  {
    icon: <Library className="h-5 w-5 text-primary" />,
    title: "Flashcards",
    description: "Create and study digital flashcards to memorize legal concepts and cases.",
    link: "/flashcards",
    badge: { text: "New", variant: "default" },
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="neon-border rounded-full p-2 w-12 h-12 flex items-center justify-center bg-primary/10 floating">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to LegalAid</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered study companion for law school success
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button size="lg" onClick={() => navigate("/study")}>
            Start Studying
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/chat")}>
            Chat with AI
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="pt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Features</h2>
          <p className="text-muted-foreground">Tools designed to help you excel in your legal studies</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/40 bg-card/60 backdrop-blur-sm hover-scale">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <Badge variant={feature.badge.variant as "default" | "secondary" | "outline" | "destructive"}>
                      {feature.badge.text}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between" 
                  onClick={() => navigate(feature.link)}
                >
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Why LegalAid?</h2>
          <p className="text-muted-foreground">Designed by law students for law students</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="p-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2">AI-Powered</CardTitle>
              <CardDescription>
                Leverage the power of artificial intelligence to enhance your studies and save time.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="p-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                <BookOpenCheck className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2">Comprehensive</CardTitle>
              <CardDescription>
                All-in-one platform with everything you need to succeed in law school.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="p-2 rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="mt-2">Efficient</CardTitle>
              <CardDescription>
                Study smarter, not harder with our productivity-focused tools and resources.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="pt-8 text-center">
        <Button size="lg" onClick={() => navigate("/study")}>
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export default Index;
