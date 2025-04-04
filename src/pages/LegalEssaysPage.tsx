
import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EssayChatPanel from "@/components/legal-essays/EssayChatPanel";
import EssayPreviewPanel from "@/components/legal-essays/EssayPreviewPanel";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const LegalEssaysPage = () => {
  // Store the essay content that can be edited
  const [essayContent, setEssayContent] = useState<string>(
    "# Legal Essay\n\nStart writing your legal analysis here. This preview supports markdown formatting.\n\n## Introduction\n\nThe field of law requires clear and concise writing. This tool helps you craft well-structured legal essays.\n\n## Main Arguments\n\n1. First point of legal analysis\n2. Second point of legal analysis\n3. Third point of legal analysis\n\n## Conclusion\n\nSummarize your legal arguments and provide a clear conclusion."
  );

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Legal Essay Assistant
        </h1>
        <Button variant="outline" size="sm">
          Save Essay
        </Button>
      </div>

      <p className="text-muted-foreground">
        Craft professional legal essays with AI assistance. Chat with the assistant on the left and edit your essay on the right.
      </p>

      <div className="border border-border/40 rounded-lg overflow-hidden shadow-sm bg-card/60 backdrop-blur-sm">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-20rem)]">
          {/* Chat Panel - Left Side */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <EssayChatPanel onUpdateEssay={(newContent) => setEssayContent(newContent)} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel - Right Side */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <EssayPreviewPanel content={essayContent} onContentChange={setEssayContent} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default LegalEssaysPage;
