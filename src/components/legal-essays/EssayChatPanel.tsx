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

type MessageType = 'system' | 'user' | 'assistant';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

const essayTemplates = [
  {
    title: "Legal Case Analysis",
    content: "# Legal Case Analysis\n\n## Case Information\n- **Case Name**: [Case Name]\n- **Citation**: [Citation]\n- **Court Name**: [Court Name]\n- **Year**: [Year]\n\n## Facts of the Case\n[Summarize the key facts of the case]\n\n## Legal Issues\n1. [First legal issue]\n2. [Second legal issue]\n\n## Court's Decision\n[Describe the court's holding and reasoning]\n\n## Analysis\n### Legal Principles Applied\n[Discuss the legal principles the court applied]\n\n### Implications\n[Discuss the implications of this decision]\n\n## Conclusion\n[Your concluding thoughts on the case]"
  },
  {
    title: "Legal Memo",
    content: "# MEMORANDUM\n\n**TO**: [Recipient]\n**FROM**: [Your Name]\n**DATE**: [Date]\n**RE**: [Subject Matter]\n\n## Question Presented\n[Concise statement of the legal question]\n\n## Brief Answer\n[Short answer to the question presented]\n\n## Facts\n[Relevant facts that inform your analysis]\n\n## Discussion\n### Applicable Law\n[Discussion of relevant statutes, cases, and legal principles]\n\n### Analysis\n[Application of law to the facts of this situation]\n\n## Conclusion\n[Final conclusion based on your analysis]"
  },
  {
    title: "Legal Research Paper",
    content: "# Title: [Your Paper Title]\n\n## Abstract\n[Brief summary of your paper - typically 150-250 words]\n\n## Introduction\n[Introduce your topic and why it matters]\n\n## Literature Review\n[Review of existing scholarship on this topic]\n\n## Theoretical Framework\n[The legal theories that inform your analysis]\n\n## Analysis\n### [First Major Section]\n[Your analysis]\n\n### [Second Major Section]\n[Your analysis]\n\n## Implications\n[Legal and policy implications of your findings]\n\n## Conclusion\n[Summary of your arguments and findings]\n\n## References\n[List of sources in appropriate legal citation format]"
  }
];

interface EssayChatPanelProps {
  onUpdateEssay: (content: string) => void;
}

const EssayChatPanel = ({ onUpdateEssay }: EssayChatPanelProps) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "system",
      content: "Welcome to the Legal Essay Assistant. You can ask for help with structuring your essay, get tips on legal writing, or request specific sections be drafted. What would you like help with today?",
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
      localStorage.setItem('legal-essay-chat', JSON.stringify(messages));
    }
  }, [messages]);
  
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem('legal-essay-chat');
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
  
  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    setIsTyping(true);
    
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: "assistant",
        content: "I'm a simulated assistant. In the full version, I would help you with your essay. Try using the essay templates from the '+' menu to get started.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "system",
        content: "Welcome to the Legal Essay Assistant. You can ask for help with structuring your essay, get tips on legal writing, or request specific sections be drafted. What would you like help with today?",
        timestamp: new Date()
      }
    ]);
    localStorage.removeItem('legal-essay-chat');
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared"
    });
  };
  
  const applyTemplate = (template: {title: string, content: string}) => {
    onUpdateEssay(template.content);
    toast({
      title: "Template applied",
      description: `Applied the ${template.title} template to your essay`
    });
  };
  
  const exportChatHistory = () => {
    const chatText = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleTimeString();
      const sender = msg.type === 'user' ? 'You' : 
                     msg.type === 'assistant' ? 'Assistant' : 'System';
      return `[${timestamp}] ${sender}: ${msg.content}`;
    }).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-essay-chat-${new Date().toISOString().slice(0, 10)}.txt`;
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
          Essay Assistant
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
                      {message.type === "assistant" ? "Assistant" : "System"}
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
              <DropdownMenuLabel>Essay Templates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {essayTemplates.map((template, index) => (
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
              placeholder="Ask for help with your essay..."
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

export default EssayChatPanel;
