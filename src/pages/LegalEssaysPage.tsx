
import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EssayChatPanel from "@/components/legal-essays/EssayChatPanel";
import EssayPreviewPanel from "@/components/legal-essays/EssayPreviewPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Save, Download, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LegalEssaysPage = () => {
  // Store the essay content that can be edited
  const [essayContent, setEssayContent] = useState<string>(
    "# Legal Essay\n\nStart writing your legal analysis here. This preview supports markdown formatting.\n\n## Introduction\n\nThe field of law requires clear and concise writing. This tool helps you craft well-structured legal essays.\n\n## Main Arguments\n\n1. First point of legal analysis\n2. Second point of legal analysis\n3. Third point of legal analysis\n\n## Conclusion\n\nSummarize your legal arguments and provide a clear conclusion."
  );
  const [essayTitle, setEssayTitle] = useState<string>("Untitled Essay");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveEssay = () => {
    setIsSaving(true);
    
    // Simulate saving process
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Essay saved",
        description: "Your essay has been saved successfully.",
      });
    }, 1000);
  };
  
  const handleExportEssay = () => {
    // Create a blob and download
    const blob = new Blob([essayContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${essayTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Essay exported",
      description: "Your essay has been downloaded as a markdown file.",
    });
  };

  return (
    <div className="flex flex-col space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-legal-primary" />
          Legal Essay Assistant
        </h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveEssay}
            className="flex items-center gap-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-foreground/30 border-t-primary animate-spin mr-1"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save Essay
              </>
            )}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Export Essay</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Export your essay as a markdown file that you can use in other applications.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => document.body.click()}>
                    Cancel
                  </Button>
                  <Button onClick={handleExportEssay}>
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-muted-foreground">
        Craft professional legal essays with AI assistance. Chat with the assistant on the left and edit your essay on the right.
      </p>

      <div className="border border-border/40 rounded-lg overflow-hidden shadow-sm bg-card/60 backdrop-blur-sm">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-20rem)]">
          {/* Chat Panel - Left Side */}
          <ResizablePanel defaultSize={40} minSize={25}>
            <EssayChatPanel onUpdateEssay={(newContent) => setEssayContent(newContent)} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel - Right Side */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <EssayPreviewPanel 
              content={essayContent} 
              onContentChange={setEssayContent} 
              title={essayTitle}
              onTitleChange={setEssayTitle}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default LegalEssaysPage;
