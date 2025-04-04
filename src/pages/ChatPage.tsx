
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type MessageType = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const SAMPLE_QUESTIONS = [
  "What are the key elements of negligence?",
  "Explain the rule against perpetuities",
  "What is the difference between common law and civil law?",
  "Explain the concept of stare decisis",
];

const ChatPage = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: "Hello! I'm your legal study assistant. Ask me any questions about law concepts, cases, or study strategies.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      let response = "";
      
      // Simple mock responses
      if (input.toLowerCase().includes("negligence")) {
        response = "Negligence has four key elements: duty of care, breach of duty, causation, and damages. The plaintiff must prove all four elements to succeed in a negligence claim.";
      } else if (input.toLowerCase().includes("stare decisis")) {
        response = "Stare decisis is a legal principle that obligates courts to follow historical cases when making a ruling on a similar case. It ensures consistency in judicial decisions and provides predictability in legal interpretation.";
      } else if (input.toLowerCase().includes("common law")) {
        response = "Common law is a body of law derived from judicial precedent rather than written laws (statutes). Civil law, on the other hand, is codified law that is regularly updated. The United States uses a common law system, while many European countries use civil law.";
      } else {
        response = "That's an interesting legal question. In a full version of this app, I'd provide a detailed answer based on legal resources and educational materials. Can you try asking about negligence, stare decisis, or the difference between common law and civil law?";
      }
      
      const assistantMessage = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)]">
      <h1 className="text-2xl font-bold mb-4">Legal Chatbot Assistant</h1>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-legal-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
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

      <div className="mt-2 mb-2">
        <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSampleQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!input.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPage;
