
import React, { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EssayChatPanel from "@/components/legal-essays/EssayChatPanel";
import EssayPreviewPanel from "@/components/legal-essays/EssayPreviewPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileText, Save, Download, Trash2, AlertTriangle, Info, File, FilePlus2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface SavedEssay {
  id: string;
  title: string;
  content: string;
  lastSaved: Date;
}

const LegalEssaysPage = () => {
  // Store the essay content that can be edited
  const [essayContent, setEssayContent] = useState<string>(
    "# Legal Essay\n\nStart writing your legal analysis here. This preview supports markdown formatting.\n\n## Introduction\n\nThe field of law requires clear and concise writing. This tool helps you craft well-structured legal essays.\n\n## Main Arguments\n\n1. First point of legal analysis\n2. Second point of legal analysis\n3. Third point of legal analysis\n\n## Conclusion\n\nSummarize your legal arguments and provide a clear conclusion."
  );
  const [essayTitle, setEssayTitle] = useState<string>("Untitled Essay");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [savedEssays, setSavedEssays] = useState<SavedEssay[]>([]);
  const [currentEssayId, setCurrentEssayId] = useState<string | null>(null);
  const [newEssayName, setNewEssayName] = useState<string>("");
  const [isOpenSaveDialog, setIsOpenSaveDialog] = useState(false);
  const [isOpenLoadDialog, setIsOpenLoadDialog] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);
  const { toast } = useToast();

  // Load saved essays on component mount
  useEffect(() => {
    try {
      const savedEssaysData = localStorage.getItem('legal-saved-essays');
      if (savedEssaysData) {
        const parsedEssays = JSON.parse(savedEssaysData);
        // Convert string dates to Date objects
        const processedEssays = parsedEssays.map((essay: any) => ({
          ...essay,
          lastSaved: new Date(essay.lastSaved)
        }));
        setSavedEssays(processedEssays);
      }
    } catch (error) {
      console.error("Failed to load saved essays:", error);
    }
  }, []);

  // Save essays to localStorage whenever they change
  useEffect(() => {
    if (savedEssays.length > 0) {
      localStorage.setItem('legal-saved-essays', JSON.stringify(savedEssays));
    }
  }, [savedEssays]);

  const handleSaveEssay = () => {
    // If we have a current essay ID, update that essay
    if (currentEssayId) {
      setIsSaving(true);
      
      setSavedEssays(prev => prev.map(essay => {
        if (essay.id === currentEssayId) {
          return {
            ...essay,
            title: essayTitle,
            content: essayContent,
            lastSaved: new Date()
          };
        }
        return essay;
      }));
      
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: "Essay updated",
          description: "Your essay has been saved successfully.",
        });
      }, 800);
    } else {
      // No current essay ID, open the save dialog
      setIsOpenSaveDialog(true);
    }
  };

  const handleSaveNewEssay = () => {
    if (!newEssayName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your essay.",
        variant: "destructive"
      });
      return;
    }

    setIsSavingNew(true);

    const newEssay: SavedEssay = {
      id: `essay-${Date.now()}`,
      title: newEssayName,
      content: essayContent,
      lastSaved: new Date()
    };

    setSavedEssays(prev => [...prev, newEssay]);
    setCurrentEssayId(newEssay.id);
    setEssayTitle(newEssayName);

    setTimeout(() => {
      setIsSavingNew(false);
      setIsOpenSaveDialog(false);
      setNewEssayName("");
      toast({
        title: "Essay saved",
        description: "Your essay has been saved successfully."
      });
    }, 800);
  };
  
  const handleLoadEssay = (essay: SavedEssay) => {
    setEssayTitle(essay.title);
    setEssayContent(essay.content);
    setCurrentEssayId(essay.id);
    setIsOpenLoadDialog(false);
    
    toast({
      title: "Essay loaded",
      description: `Loaded essay: ${essay.title}`
    });
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

  const handleNewEssay = () => {
    setEssayContent("# New Essay\n\nStart writing your legal analysis here.\n\n## Introduction\n\nProvide background information and state your thesis.\n\n## Main Arguments\n\n1. First point\n2. Second point\n3. Third point\n\n## Conclusion\n\nSummarize your key points and restate your thesis.");
    setEssayTitle("Untitled Essay");
    setCurrentEssayId(null);
    
    toast({
      title: "New essay created",
      description: "Started a new blank essay."
    });
  };

  const handleDeleteEssay = () => {
    if (!currentEssayId) return;
    
    setSavedEssays(prev => prev.filter(essay => essay.id !== currentEssayId));
    handleNewEssay(); // Reset to a new essay
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Essay deleted",
      description: "Your essay has been deleted."
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
          {/* New Essay Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewEssay}
            className="flex items-center gap-1"
          >
            <FilePlus2 className="h-4 w-4 mr-1" />
            New
          </Button>
          
          {/* Load Essay Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsOpenLoadDialog(true)}
            className="flex items-center gap-1"
            disabled={savedEssays.length === 0}
          >
            <File className="h-4 w-4 mr-1" />
            Load
          </Button>
          
          {/* Save Essay Button */}
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
                Save {currentEssayId ? "" : "As"}
              </>
            )}
          </Button>
          
          {/* Download/Export Button */}
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
          
          {/* Delete Button - Only show if we have a current essay loaded */}
          {currentEssayId && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <p className="text-muted-foreground">
        Craft professional legal essays with AI assistance. Chat with the assistant on the left and edit your essay on the right.
      </p>
      
      {/* Current essay indicator */}
      {currentEssayId && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span>Currently editing: <span className="font-medium text-foreground">{essayTitle}</span></span>
        </div>
      )}

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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Essay
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{essayTitle}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEssay}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Save As Dialog */}
      <Dialog open={isOpenSaveDialog} onOpenChange={setIsOpenSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save Essay
            </DialogTitle>
            <DialogDescription>
              Enter a name for your essay.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input 
              placeholder="Essay name" 
              value={newEssayName} 
              onChange={(e) => setNewEssayName(e.target.value)} 
              className="mb-4"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewEssay} disabled={isSavingNew}>
              {isSavingNew ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Load Essay Dialog */}
      <Dialog open={isOpenLoadDialog} onOpenChange={setIsOpenLoadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <File className="h-5 w-5" />
              Load Essay
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 max-h-96 overflow-y-auto">
            {savedEssays.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>No saved essays found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedEssays.map((essay) => (
                  <div 
                    key={essay.id}
                    className="flex items-center justify-between p-3 border border-border/60 rounded-md hover:bg-accent/10 cursor-pointer"
                    onClick={() => handleLoadEssay(essay)}
                  >
                    <div>
                      <h4 className="font-medium">{essay.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Last saved: {essay.lastSaved.toLocaleDateString()} {essay.lastSaved.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">Load</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenLoadDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalEssaysPage;
