
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, FileText, Loader2, Upload, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadPage = () => {
  const [activeTab, setActiveTab] = useState("pdf");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recentUploads] = useState<string[]>([
    "Constitutional Law Notes.pdf",
    "Contract Law Lecture 3.mp4",
    "Tort Law Case Studies.pdf"
  ]);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Complete",
            description: `${selectedFile.name} has been uploaded successfully.`,
          });
          setSelectedFile(null);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Study Materials</h1>
        <p className="text-muted-foreground">
          Upload your materials to generate practice questions
        </p>
      </div>

      <Tabs defaultValue="pdf" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pdf">
            <FileText className="h-4 w-4 mr-2" /> PDFs & Notes
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="h-4 w-4 mr-2" /> Videos
          </TabsTrigger>
          <TabsTrigger value="history">Uploads History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pdf" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Upload your PDF documents, lecture notes, or case studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="pdf-upload" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Click to upload or drag & drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Support for PDF, DOC, DOCX, and TXT files
                </p>
                
                {selectedFile && (
                  <div className="mt-4 text-left bg-muted/50 p-3 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-legal-primary mr-2" />
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {isUploading ? (
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-legal-primary" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpload();
                        }}
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Maximum file size: 50MB
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Tips</DialogTitle>
                    <DialogDescription>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>For best results, upload clear and well-formatted documents</li>
                        <li>Highlight key sections in your PDFs before uploading</li>
                        <li>Tables of contents and headings help the AI understand your document structure</li>
                        <li>If uploading lecture notes, make sure they're organized by topic</li>
                      </ul>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="video" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>
                Upload lecture videos or recorded study sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="video-upload" 
                  className="hidden" 
                  accept=".mp4,.mov,.avi"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Click to upload or drag & drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Support for MP4, MOV, and AVI files
                </p>
                
                {selectedFile && (
                  <div className="mt-4 text-left bg-muted/50 p-3 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-legal-primary mr-2" />
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {isUploading ? (
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-legal-primary" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpload();
                        }}
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Note about video uploads:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  In the full version of this application, we would process videos by extracting audio, transcribing it, and then generating questions from the content.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 500MB
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>
                Access your previously uploaded materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUploads.length > 0 ? (
                <div className="space-y-2">
                  {recentUploads.map((filename, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted/50 rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        {filename.endsWith('.pdf') ? (
                          <FileText className="h-5 w-5 text-legal-primary mr-2" />
                        ) : filename.endsWith('.mp4') ? (
                          <Video className="h-5 w-5 text-legal-primary mr-2" />
                        ) : (
                          <FileText className="h-5 w-5 text-legal-primary mr-2" />
                        )}
                        <span>{filename}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Generate Questions
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No uploads yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(activeTab === "pdf" || activeTab === "video") && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-legal-primary" />
            What happens after upload?
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            After uploading, our AI will analyze your content and generate tailored practice questions. 
            This may take a few minutes depending on the file size. 
            You'll receive a notification when your questions are ready.
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
