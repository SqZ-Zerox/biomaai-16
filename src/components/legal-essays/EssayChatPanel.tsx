
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Sparkles, Wand2, FileText, ListPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const ESSAY_TEMPLATES = [
  {
    name: "Case Analysis",
    content: "# Case Analysis\n\n## Case Information\n- **Case Name**: [Case Name]\n- **Citation**: [Citation]\n- **Court**: [Court]\n- **Year**: [Year]\n\n## Facts of the Case\n[Summarize the key facts]\n\n## Legal Issues\n[List the key legal issues]\n\n## Court's Decision\n[Explain the court's holding]\n\n## Legal Reasoning\n[Analyze the court's reasoning]\n\n## Implications\n[Discuss the implications of this decision]\n\n## Critical Analysis\n[Provide your critical analysis]"
  },
  {
    name: "Legal Memo",
    content: "# Legal Memorandum\n\n## Issue\nWhether [state the legal question]\n\n## Brief Answer\n[Provide a concise answer]\n\n## Facts\n[Present the relevant facts]\n\n## Discussion\n### Applicable Law\n[Explain the applicable law]\n\n### Analysis\n[Apply the law to the facts]\n\n## Conclusion\n[State your conclusion]"
  },
  {
    name: "Legal Argument",
    content: "# Legal Argument\n\n## Introduction\n[Introduce your position and thesis statement]\n\n## Legal Framework\n[Explain the relevant laws and precedents]\n\n## Argument I\n[Present your first argument]\n\n## Argument II\n[Present your second argument]\n\n## Counterarguments\n[Address potential counterarguments]\n\n## Conclusion\n[Summarize your position]"
  }
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
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      let essayUpdate = null;
      
      if (input.toLowerCase().includes("structure")) {
        responseText = "For legal essays, consider this structure: 1) Introduction with thesis, 2) Legal framework, 3) Case analysis, 4) Application to facts, 5) Conclusion with implications. I've updated your essay with this structure.";
        
        // Simulate updating the essay content
        essayUpdate = `# Legal Essay\n\n## 1. Introduction\nIntroduce your legal question and state your thesis.\n\n## 2. Legal Framework\nDiscuss the relevant laws, statutes, and precedents.\n\n## 3. Case Analysis\nAnalyze key cases relevant to your topic.\n\n## 4. Application\nApply the legal principles to the specific facts of your situation.\n\n## 5. Conclusion\nSummarize your analysis and discuss implications.`;
      } else if (input.toLowerCase().includes("cite") || input.toLowerCase().includes("citation")) {
        responseText = "For legal citations, follow these formats:\n\n• Case: *Name v. Name*, Volume Reporter Page (Court Year)\nExample: *Brown v. Board of Education*, 347 U.S. 483 (1954)\n\n• Statute: Title/Code § Section (Year)\nExample: 17 U.S.C. § 107 (2018)\n\n• Law Review: Author, Title, Volume Journal Page, Pincite (Year)\nExample: Jane Smith, Legal Ethics, 100 Harv. L. Rev. 123, 125 (2020)";
      } else if (input.toLowerCase().includes("conclusion")) {
        responseText = "For a strong conclusion in your legal essay:\n\n1. Restate your thesis without simply repeating it\n2. Summarize your key arguments\n3. Discuss broader implications of your analysis\n4. End with a thought-provoking insight or call to action\n\nAvoid introducing new arguments in the conclusion.";
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // If we have a new essay structure, update it
      if (essayUpdate) {
        onUpdateEssay(essayUpdate);
        
        toast({
          title: "Essay updated",
          description: "The essay structure has been updated based on your request.",
        });
      }
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };
  
  const applyTemplate = (template: typeof ESSAY_TEMPLATES[0]) => {
    onUpdateEssay(template.content);
    
    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: `Please apply the ${template.name} template`,
        timestamp: new Date()
      },
      {
        role: "assistant",
        content: `I've applied the ${template.name} template to your essay. You can now edit it in the preview panel.`,
        timestamp: new Date()
      }
    ]);
    
    setShowTemplates(false);
    
    toast({
      title: "Template applied",
      description: `The ${template.name} template has been applied to your essay.`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/40 bg-card/80 flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-legal-primary" />
          Essay Assistant
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <FileText className="h-4 w-4 mr-1" />
          <span className="text-xs">Templates</span>
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showTemplates ? (
          <div className="flex-1 p-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Essay Templates</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTemplates(false)}
                className="h-7 px-2 text-xs"
              >
                Back to Chat
              </Button>
            </div>
            
            <div className="space-y-3">
              {ESSAY_TEMPLATES.map((template, index) => (
                <div 
                  key={index}
                  className="rounded-lg border border-border/60 p-3 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{template.name}</h5>
                    <ListPlus className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.content.split('\n\n')[0].replace('# ', '')} template with structured sections
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-muted max-w-[85%] rounded-lg px-4 py-3">
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
                  className="transition-all hover:scale-105"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EssayChatPanel;
