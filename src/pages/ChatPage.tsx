
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AppError, errorHandler } from "@/lib/error";

type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

const SAMPLE_QUESTIONS = [
  "What are the key elements of negligence?",
  "Explain the rule against perpetuities",
  "What is the difference between common law and civil law?",
  "Explain the concept of stare decisis",
];

// Simple mock responses for demo purposes
const MOCK_RESPONSES: Record<string, string> = {
  "negligence": "Negligence has four key elements: duty of care, breach of duty, causation, and damages. The plaintiff must prove all four elements to succeed in a negligence claim.",
  "stare decisis": "Stare decisis is a legal principle that obligates courts to follow historical cases when making a ruling on a similar case. It ensures consistency in judicial decisions and provides predictability in legal interpretation.",
  "common law": "Common law is a body of law derived from judicial precedent rather than written laws (statutes). Civil law, on the other hand, is codified law that is regularly updated. The United States uses a common law system, while many European countries use civil law.",
  "rule against perpetuities": "The Rule Against Perpetuities states that no interest in property is valid unless it must vest, if at all, not later than 21 years after the death of some life in being at the creation of the interest. This rule prevents property from being tied up indefinitely.",
  "default": "That's an interesting legal question. In a full version of this app, I'd provide a detailed answer based on legal resources and educational materials. Can you try asking about negligence, stare decisis, common law, or the rule against perpetuities?",
};

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
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
      if (lowerQuestion.includes(keyword)) {
        return response;
      }
    }
    
    return MOCK_RESPONSES.default;
  };

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
    setIsError(false);
    
    try {
      // Simulate API call with random chance of error
      if (Math.random() < 0.1) {
        throw new AppError("Network error occurred", 500);
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = getMockResponse(input);
      
      const assistantMessage = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const { message } = errorHandler(error);
      setIsError(true);
      setErrorMsg(message);
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      
      // Add system message about the error
      setMessages(prev => [
        ...prev, 
        {
          role: "system",
          content: "Sorry, I'm having trouble processing your request right now. Please try again later.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  const handleRetry = () => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === "user");
      if (lastUserMessage) {
        setInput(lastUserMessage.content);
      }
    }
    setIsError(false);
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
              message.role === "user" 
                ? "justify-end" 
                : message.role === "system" 
                  ? "justify-center" 
                  : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.role === "system"
                    ? "bg-destructive/10 text-destructive border border-destructive/20"
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

      {isError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="text-sm">{errorMsg || "An error occurred while sending your message."}</span>
          <Button variant="outline" size="sm" className="ml-auto" onClick={handleRetry}>Retry</Button>
        </div>
      )}

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
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default ChatPage;
