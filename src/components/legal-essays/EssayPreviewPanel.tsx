
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simple markdown parser (basic implementation)
const parseMarkdown = (markdown: string) => {
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a class="text-primary underline" href="$2">$1</a>')
    
    // Paragraphs
    .replace(/^\s*$/gm, '</p><p class="my-2">')
    
    // Line breaks
    .replace(/\n/g, '<br />');
  
  return '<p class="my-2">' + html + '</p>';
};

interface EssayPreviewPanelProps {
  content: string;
  onContentChange: (content: string) => void;
}

const EssayPreviewPanel = ({ content, onContentChange }: EssayPreviewPanelProps) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('preview');
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/40 bg-card/80 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Essay Document
        </h3>
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'edit' | 'preview')} className="w-auto">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {mode === 'edit' ? (
          <Textarea 
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full min-h-[60vh] font-mono text-sm"
            placeholder="Write your legal essay here..."
          />
        ) : (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        )}
      </ScrollArea>
      
      {mode === 'preview' && (
        <div className="p-2 border-t border-border/40 bg-background/30 flex justify-end">
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
      )}
    </div>
  );
};

export default EssayPreviewPanel;
