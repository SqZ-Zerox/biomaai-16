
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface EssayChatPanelProps {
  onUpdateEssay: (content: string) => void;
}

const SAMPLE_PROMPTS = [
  "Help me structure a legal analysis on contract law",
  "Suggest improvements to my introduction",
  "How should I cite legal cases?",
  "Help me craft a conclusion"
];

const EssayChatPanel = ({ onUpdateEssay }: EssayChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your legal essay assistant. Ask me for help with structuring, analyzing, or improving your legal essays.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate a response (since we're not integrating AI yet)
    setTimeout(() => {
      // Mock response
      let responseText = "I understand you're working on a legal essay. While I'm not fully integrated with AI yet, I can offer some general guidance. Would you like help with structure, citations, or analysis?";
      
      if (input.toLowerCase().includes("structure")) {
        responseText = "For legal essays, consider this structure: 1) Introduction with thesis, 2) Legal framework, 3) Case analysis, 4) Application to facts, 5) Conclusion with implications. Would you like me to update your essay with this structure?";
        
        // Simulate updating the essay content
        onUpdateEssay(`# Legal Essay\n\n## 1. Introduction\nIntroduce your legal question and state your thesis.\n\n## 2. Legal Framework\nDiscuss the relevant laws, statutes, and precedents.\n\n## 3. Case Analysis\nAnalyze key cases relevant to your topic.\n\n## 4. Application\nApply the legal principles to the specific facts of your situation.\n\n## 5. Conclusion\nSummarize your analysis and discuss implications.`);
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/40 bg-card/80">
        <h3 className="font-semibold">Essay Assistant</h3>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-border/40 bg-card/80">
          <div className="flex flex-wrap gap-1 mb-2">
            {SAMPLE_PROMPTS.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-background/50 hover:bg-primary/10"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t border-border/40 p-2 bg-background/30">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask for essay assistance..."
              disabled={isLoading}
              className="flex-1 bg-background shadow-sm"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EssayChatPanel;
