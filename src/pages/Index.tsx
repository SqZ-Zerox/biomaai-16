
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Upload,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-legal-primary" />,
      title: "Question Generation",
      description: "Generate practice questions from your study materials",
      path: "/study"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-legal-primary" />,
      title: "Legal Chatbot",
      description: "Get answers to your legal questions instantly",
      path: "/chat"
    },
    {
      icon: <Calendar className="h-8 w-8 text-legal-primary" />,
      title: "Study Planning",
      description: "Create personalized study plans for your exams",
      path: "/study-plan"
    },
    {
      icon: <Upload className="h-8 w-8 text-legal-primary" />,
      title: "Upload Materials",
      description: "Upload study materials to generate questions",
      path: "/upload"
    }
  ];

  return (
    <div className="space-y-8 pt-4">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-foreground">Legal Aid for Students</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          AI-powered study assistant to help you ace your law exams
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:shadow-md transition-all border-muted">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="bg-legal-muted p-3 rounded-xl">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                onClick={() => navigate(feature.path)}
                className="text-legal-primary group-hover:translate-x-1 transition-transform"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="bg-legal-muted rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-legal-primary">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="font-bold flex items-center">
              <div className="bg-legal-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">1</div>
              Upload Materials
            </div>
            <p className="text-sm text-muted-foreground">Upload your lecture notes, textbooks, or videos</p>
          </div>
          <div className="space-y-2">
            <div className="font-bold flex items-center">
              <div className="bg-legal-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">2</div>
              Generate Content
            </div>
            <p className="text-sm text-muted-foreground">Our AI generates questions, answers, and study plans</p>
          </div>
          <div className="space-y-2">
            <div className="font-bold flex items-center">
              <div className="bg-legal-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">3</div>
              Study Smarter
            </div>
            <p className="text-sm text-muted-foreground">Practice with questions, use the chatbot, and follow your plan</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
