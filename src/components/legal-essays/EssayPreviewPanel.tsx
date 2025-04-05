
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Copy, Check, History, Download, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Simple markdown parser (basic implementation)
const parseMarkdown = (markdown: string) => {
  // Enhanced markdown parser with support for more markdown features
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold my-2">$1</h4>')
    .replace(/^##### (.*$)/gim, '<h5 class="text-sm font-semibold my-1">$1</h5>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>')
    .replace(/\_(.*?)\_/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a class="text-primary underline" href="$2">$1</a>')
    
    // Code blocks
    .replace(/```([^`]+)```/g, '<pre class="bg-muted p-2 rounded-md text-sm my-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2">$1</blockquote>')
    
    // Horizontal rules
    .replace(/^\-\-\-$/gim, '<hr class="my-4 border-border/60">')
    
    // Paragraphs
    .replace(/^\s*$/gm, '</p><p class="my-2">')
    
    // Line breaks
    .replace(/\n/g, '<br />');
  
  return '<p class="my-2">' + html + '</p>';
};

// Word counter utility
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

interface EssayPreviewPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

const EssayPreviewPanel = ({ content, onContentChange, title, onTitleChange }: EssayPreviewPanelProps) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('preview');
  const [wordCount, setWordCount] = useState<number>(0);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [editHistory, setEditHistory] = useState<Array<{content: string, timestamp: number}>>([]);
  const { toast } = useToast();
  
  // Calculate word count whenever content changes
  useEffect(() => {
    setWordCount(countWords(content));
    
    // Add to edit history if significantly different (save every minute max)
    const now = Date.now();
    const lastEdit = editHistory[0];
    if (!lastEdit || (now - lastEdit.timestamp > 60000)) {
      setEditHistory(prev => [{content, timestamp: now}, ...prev.slice(0, 9)]);
    }
    
    // Auto-save functionality
    if (autoSave) {
      const saveTimer = setTimeout(() => {
        localStorage.setItem('legal-essay-content', content);
        localStorage.setItem('legal-essay-title', title);
      }, 2000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [content, title, autoSave, editHistory]);
  
  // Load from localStorage on initial load
  useEffect(() => {
    const savedContent = localStorage.getItem('legal-essay-content');
    const savedTitle = localStorage.getItem('legal-essay-title');
    
    if (savedContent && content === "# Legal Essay\n\nStart writing your legal analysis here. This preview supports markdown formatting.\n\n## Introduction\n\nThe field of law requires clear and concise writing. This tool helps you craft well-structured legal essays.\n\n## Main Arguments\n\n1. First point of legal analysis\n2. Second point of legal analysis\n3. Third point of legal analysis\n\n## Conclusion\n\nSummarize your legal arguments and provide a clear conclusion.") {
      onContentChange(savedContent);
    }
    
    if (savedTitle && savedTitle !== "Untitled Essay") {
      onTitleChange(savedTitle);
    }
  }, []);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "Essay content has been copied to clipboard"
    });
  };
  
  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded as markdown",
      description: "Your essay has been downloaded as a markdown file"
    });
  };
  
  const handleRestoreVersion = (index: number) => {
    if (editHistory[index]) {
      onContentChange(editHistory[index].content);
      toast({
        title: "Version restored",
        description: `Restored from ${new Date(editHistory[index].timestamp).toLocaleTimeString()}`
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/40 bg-card/80 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Essay Document
        </h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Document Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                <span>Auto-save</span>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4" /> Copy to clipboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadMarkdown}>
                <Download className="mr-2 h-4 w-4" /> Download as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>History</DropdownMenuLabel>
              {editHistory.length > 0 ? (
                editHistory.slice(0, 5).map((version, index) => (
                  <DropdownMenuItem key={index} onClick={() => handleRestoreVersion(index)}>
                    <History className="mr-2 h-4 w-4" />
                    {new Date(version.timestamp).toLocaleTimeString()}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No history available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'edit' | 'preview')} className="w-auto">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {mode === 'edit' && (
        <div className="p-3 border-b border-border/40 bg-background/30">
          <Input 
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-medium text-lg"
            placeholder="Essay Title..."
          />
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4">
        {mode === 'edit' ? (
          <>
            <Textarea 
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="w-full h-full min-h-[60vh] font-mono text-sm"
              placeholder="Write your legal essay here..."
            />
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>{wordCount} words</span>
              <span>{autoSave ? "Auto-saving enabled" : "Auto-save disabled"}</span>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          </div>
        )}
      </ScrollArea>
      
      {mode === 'preview' && (
        <div className="p-2 border-t border-border/40 bg-background/30 flex justify-between items-center">
          <div className="text-xs text-muted-foreground ml-2">
            {wordCount} words
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-1"
            >
              {copySuccess ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copySuccess ? "Copied" : "Copy"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMode('edit')}
              className="flex items-center gap-1"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Essay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayPreviewPanel;
