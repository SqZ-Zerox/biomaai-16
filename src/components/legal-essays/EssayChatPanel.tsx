
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Bot, UserCircle, RefreshCw, Plus, MessageSquare, PanelRight, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { sendChatCompletion, OpenAIMessage, hasOpenAIKey } from "@/services/openaiService";

type MessageType = 'system' | 'user' | 'assistant';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

const healthTemplates = [
  {
    title: "Nutrition Plan",
    content: "# Personalized Nutrition Plan\n\n## Dietary Goals\n- **Primary Goal**: [Weight management/Muscle gain/Energy boost]\n- **Dietary Restrictions**: [Any allergies or restrictions]\n- **Caloric Target**: [Daily calorie goal]\n\n## Meal Structure\n### Breakfast\n- [Protein source]\n- [Complex carbohydrate]\n- [Healthy fat]\n\n### Lunch\n- [Protein source]\n- [Vegetables/Greens]\n- [Complex carbohydrate]\n\n### Dinner\n- [Lean protein]\n- [Vegetables]\n- [Healthy starch]\n\n### Snacks\n- [Healthy snack option 1]\n- [Healthy snack option 2]\n\n## Hydration\n- [Daily water intake goal]\n\n## Supplementation\n- [Any recommended supplements based on lab results]"
  },
  {
    title: "Fitness Routine",
    content: "# Weekly Fitness Plan\n\n## Training Split\n\n### Monday: [Focus Area]\n- Exercise 1: [Sets] x [Reps]\n- Exercise 2: [Sets] x [Reps]\n- Exercise 3: [Sets] x [Reps]\n\n### Tuesday: [Focus Area]\n- Exercise 1: [Sets] x [Reps]\n- Exercise 2: [Sets] x [Reps]\n- Exercise 3: [Sets] x [Reps]\n\n### Wednesday: [Rest/Active Recovery]\n- [Activity suggestions]\n\n### Thursday: [Focus Area]\n- Exercise 1: [Sets] x [Reps]\n- Exercise 2: [Sets] x [Reps]\n- Exercise 3: [Sets] x [Reps]\n\n### Friday: [Focus Area]\n- Exercise 1: [Sets] x [Reps]\n- Exercise 2: [Sets] x [Reps]\n- Exercise 3: [Sets] x [Reps]\n\n### Saturday/Sunday: [Activity/Rest]\n- [Weekend activity suggestions]\n\n## Cardiovascular Training\n- [Type and frequency of cardio]\n\n## Mobility Work\n- [Stretches and mobility exercises]\n\n## Progress Tracking\n- [Metrics to track]"
  },
  {
    title: "Sleep Improvement Plan",
    content: "# Sleep Optimization Plan\n\n## Current Sleep Metrics\n- **Average Duration**: [Hours per night]\n- **Sleep Efficiency**: [Percentage]\n- **Main Challenges**: [Issues identified]\n\n## Evening Routine\n1. [Activity 1] at [Time]\n2. [Activity 2] at [Time]\n3. [Activity 3] at [Time]\n\n## Bedroom Environment\n- **Temperature**: [Recommended temperature]\n- **Light**: [Light management strategies]\n- **Sound**: [Sound management strategies]\n\n## Nutrition & Supplementation\n- [Evening nutrition recommendations]\n- [Supplement recommendations if applicable]\n\n## Screen Management\n- [Digital device recommendations]\n\n## Morning Routine\n1. [Activity 1] at [Time]\n2. [Activity 2] at [Time]\n\n## Progress Tracking\n- [Sleep metrics to monitor]"
  }
];

interface EssayChatPanelProps {
  onUpdateEssay: (content: string) => void;
}

const BiomaChatPanel = ({ onUpdateEssay }: EssayChatPanelProps) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "system",
      content: "Welcome to the Bioma Health Assistant. You can ask for help with nutrition plans, fitness routines, or sleep optimization strategies based on your health data and goals.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [viewingHistory, setViewingHistory] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, autoScroll]);
  
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('bioma-health-chat', JSON.stringify(messages));
    }
  }, [messages]);
  
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem('bioma-health-chat');
      if (savedChat) {
        const parsedChat = JSON.parse(savedChat);
        const processedChat = parsedChat.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(processedChat);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Check if OpenAI API key is configured
    if (!hasOpenAIKey()) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenAI API key in settings",
        variant: "destructive",
      });
      return;
    }
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      // Prepare messages for OpenAI
      const openAIMessages: OpenAIMessage[] = [
        {
          role: "system",
          content: "You are Bioma AI, a health assistant specialized in creating detailed health plans. You help users with nutrition plans, fitness routines, and sleep optimization strategies. Your responses should be structured, informative, and formatted in Markdown."
        },
        // Add previous context from last 5 messages
        ...messages
          .filter(msg => msg.type !== "system")
          .slice(-5)
          .map(msg => ({ 
            role: msg.type === "user" ? "user" : "assistant" as "user" | "assistant",
            content: msg.content 
          })),
        // Add the latest user message
        { role: "user" as const, content: userMessage.content }
      ];
      
      // Send the request to OpenAI
      const aiResponse = await sendChatCompletion(openAIMessages, {
        temperature: 0.7,
        max_tokens: 1000
      });
      
      if (!aiResponse) {
        throw new Error("Failed to get response from AI");
      }
      
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: "assistant",
        content: aiResponse.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: "system",
        content: "Sorry, I couldn't process your request at this time. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Chat Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "system",
        content: "Welcome to the Bioma Health Assistant. You can ask for help with nutrition plans, fitness routines, or sleep optimization strategies based on your health data and goals.",
        timestamp: new Date()
      }
    ]);
    localStorage.removeItem('bioma-health-chat');
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared"
    });
  };
  
  const applyTemplate = (template: {title: string, content: string}) => {
    onUpdateEssay(template.content);
    toast({
      title: "Template applied",
      description: `Applied the ${template.title} template to your document`
    });
  };
  
  const exportChatHistory = () => {
    const chatText = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleTimeString();
      const sender = msg.type === 'user' ? 'You' : 
                     msg.type === 'assistant' ? 'Bioma AI' : 'System';
      return `[${timestamp}] ${sender}: ${msg.content}`;
    }).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioma-health-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat exported",
      description: "Your chat history has been downloaded as a text file"
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/40 bg-card/80 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Health Assistant
        </h3>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                <span>Auto-scroll</span>
                <Switch
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportChatHistory}>
                Export chat history
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearChat}>
                Clear conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" type="always">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] animate-fade-in ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : message.type === "assistant"
                    ? "bg-muted ml-2"
                    : "bg-card border border-border/60"
                }`}
              >
                {message.type !== "user" && (
                  <div className="flex items-center gap-2 mb-1 pb-1 border-b border-border/40">
                    {message.type === "assistant" ? (
                      <Bot className="w-4 h-4 text-primary" />
                    ) : (
                      <PanelRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium">
                      {message.type === "assistant" ? "Bioma AI" : "System"}
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className="text-xs opacity-60 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.type === "user" && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ml-2">
                  <UserCircle className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border/40 bg-background/30">
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel>Health Templates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {healthTemplates.map((template, index) => (
                <DropdownMenuItem 
                  key={index} 
                  onClick={() => applyTemplate(template)}
                  className="flex items-center gap-2"
                >
                  <span>{template.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <form 
            className="flex-1 flex space-x-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for help with your health plan..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isTyping}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BiomaChatPanel;
