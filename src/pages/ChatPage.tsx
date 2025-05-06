
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Send, 
  Loader2, 
  MessageSquare, 
  History, 
  Plus,
  Trash2,
  PanelLeft,
  Download,
  User,
  Bot
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AppError, errorHandler } from "@/lib/error";

type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

type ChatSession = {
  id: string;
  title: string;
  createdAt: Date;
  messages: MessageType[];
};

const SAMPLE_QUESTIONS = [
  "What should I eat to improve my vitamin D levels?",
  "How can I optimize my sleep schedule?",
  "What exercises are best for lower back pain?",
  "How do stress and cortisol affect weight management?",
];

// Sample chat history
const SAMPLE_CHATS: ChatSession[] = [
  {
    id: '1',
    title: "Nutrition Planning",
    createdAt: new Date(),
    messages: [
      {
        role: "assistant",
        content: "Hello! I'm your Bioma AI health assistant. Ask me any questions about nutrition and dietary needs.",
        timestamp: new Date(),
      },
      {
        role: "user",
        content: "What foods should I eat to improve my iron levels?",
        timestamp: new Date(),
      },
    ]
  },
  {
    id: '2',
    title: "Fitness Routine",
    createdAt: new Date(),
    messages: [
      {
        role: "assistant",
        content: "Hello! I'm your Bioma AI health assistant. Ask me any questions about fitness and exercise.",
        timestamp: new Date(),
      },
    ]
  },
  {
    id: '3',
    title: "Sleep Optimization",
    createdAt: new Date(),
    messages: [
      {
        role: "assistant",
        content: "Hello! I'm your Bioma AI health assistant. Ask me any questions about sleep patterns and optimization.",
        timestamp: new Date(),
      },
    ]
  },
];

// Simple mock responses for demo purposes
const MOCK_RESPONSES: Record<string, string> = {
  "vitamin": "Based on your lab results, I recommend increasing your intake of vitamin D-rich foods like fatty fish, egg yolks, and fortified dairy. Spending 15-20 minutes in morning sunlight can also help your body naturally produce vitamin D.",
  "sleep": "To optimize sleep quality, try maintaining a consistent sleep schedule (even on weekends), avoiding screens 1 hour before bed, keeping your bedroom cool (65-68°F), and limiting caffeine after 2pm. Your recent activity data shows your sleep efficiency could improve with these adjustments.",
  "exercise": "For lower back pain, focus on core-strengthening exercises like planks, gentle yoga poses like cat-cow and child's pose, and low-impact cardio. Your recent fitness metrics indicate that improving core strength could help address your current concerns.",
  "stress": "Chronic stress increases cortisol, which can lead to weight gain particularly around the abdomen. Based on your recent health metrics, I recommend incorporating daily stress-reduction techniques like deep breathing exercises, meditation, or gentle movement practices like tai chi.",
  "default": "That's an interesting health question. In a full version of this app, I'd provide personalized recommendations based on your health data, lab results, and current wellness goals. Can you try asking about vitamins, sleep, exercise, or stress management?",
};

const ChatPage = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Bioma AI health assistant. Ask me any questions about nutrition, fitness, sleep, or stress management based on your personal health data.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(SAMPLE_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("New Chat");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
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
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event propagation
    }
    
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
      if (Math.random() < 0.05) {
        throw new AppError("Network error occurred", 500);
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = getMockResponse(input);
      
      const assistantMessage = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // If this is a new chat, create a new chat session
      if (!activeChatId) {
        const newTitle = input.length > 20 ? `${input.substring(0, 20)}...` : input;
        const newChatId = Date.now().toString();
        
        const newChat: ChatSession = {
          id: newChatId,
          title: newTitle,
          createdAt: new Date(),
          messages: [...messages, userMessage, assistantMessage]
        };
        
        setChatSessions(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
        setChatTitle(newTitle);
      } else {
        // Update existing chat session
        setChatSessions(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? {...chat, messages: [...messages, userMessage, assistantMessage]} 
            : chat
        ));
      }
    } catch (error: any) {
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
      chatInputRef.current?.focus();
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
    chatInputRef.current?.focus();
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

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };
  
  const startNewChat = () => {
    setMessages([{
      role: "assistant",
      content: "Hello! I'm your Bioma AI health assistant. Ask me any questions about nutrition, fitness, sleep, or stress management based on your personal health data.",
      timestamp: new Date(),
    }]);
    setActiveChatId(null);
    setChatTitle("New Chat");
  };
  
  const selectChat = (chatId: string) => {
    const selectedChat = chatSessions.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setActiveChatId(chatId);
      setChatTitle(selectedChat.title);
    }
  };
  
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering selectChat
    
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    
    // If we're deleting the active chat, start a new one
    if (activeChatId === chatId) {
      startNewChat();
    }
    
    toast({
      title: "Chat deleted",
      description: "The conversation has been removed.",
    });
  };

  // Prevent default on key down to stop page scrolling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportChatHistory = () => {
    // Find the current active chat
    const currentChat = activeChatId 
      ? chatSessions.find(chat => chat.id === activeChatId)
      : {
          title: chatTitle,
          messages
        };

    if (!currentChat) return;

    // Format the chat for export
    const chatExport = currentChat.messages.map(msg => 
      `${msg.role.toUpperCase()} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`
    ).join('\n\n');

    const exportData = `# ${currentChat.title}\n\n${chatExport}`;
    
    // Create a blob and download
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentChat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat exported",
      description: "Your conversation has been downloaded as a text file.",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-15rem)] max-h-[calc(100vh-15rem)] bg-background/30 p-4 rounded-lg" ref={chatContainerRef}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Bioma <span className="text-primary">Chat</span></h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Export Conversation</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Do you want to download this conversation as a text file?
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => document.body.click()}>
                    Cancel
                  </Button>
                  <Button onClick={exportChatHistory}>
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleSidebar}
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
        >
          <PanelLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {showSidebar && (
          <div className="w-64 flex-shrink-0 overflow-hidden rounded-lg border border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
            <div className="p-3 font-medium text-sm border-b border-border/40">
              <span className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" /> Chat History
              </span>
            </div>
            <div className="p-2">
              <Button variant="default" size="sm" className="w-full flex items-center gap-2" onClick={startNewChat}>
                <Plus className="h-4 w-4" /> New Chat
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-6rem)] pb-4">
              <div className="space-y-1 p-2">
                {chatSessions.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={cn(
                      "p-2 rounded-md hover:bg-accent/20 cursor-pointer text-sm flex items-start justify-between group transition-all",
                      activeChatId === chat.id ? "bg-accent/30 text-accent-foreground" : ""
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                      <span className="line-clamp-2">{chat.title}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => deleteChat(chat.id, e)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="flex-1 flex flex-col bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-semibold truncate flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              {chatTitle}
            </h3>
          </div>
          
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" 
                      ? "justify-end" 
                      : message.role === "system" 
                        ? "justify-center" 
                        : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2 shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.role === "system"
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-muted"
                    )}
                  >
                    {message.role !== "user" && message.role !== "system" && (
                      <div className="flex items-center gap-2 mb-1 pb-1 border-b border-border/40">
                        <Bot className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">Bioma AI</span>
                      </div>
                    )}
                    {message.role === "user" && (
                      <div className="flex items-center gap-2 mb-1 pb-1 border-b border-border/40">
                        <User className="w-4 h-4" />
                        <span className="text-xs font-medium">You</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
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
                  <div className="bg-muted max-w-[80%] rounded-lg px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>

          {isError && (
            <div className="mx-4 mb-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm">{errorMsg || "An error occurred while sending your message."}</span>
              <Button variant="outline" size="sm" className="ml-auto" onClick={handleRetry}>Retry</Button>
            </div>
          )}

          <div className="p-2 border-t border-border/40 bg-card/80">
            <div className="flex flex-wrap gap-1 mb-2">
              {SAMPLE_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-background/50 hover:bg-primary/10"
                  onClick={() => handleSampleQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-border/40 p-3 bg-background/30">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                ref={chatInputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your health, nutrition, or fitness..."
                disabled={isLoading}
                className="flex-1 bg-background shadow-sm"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

