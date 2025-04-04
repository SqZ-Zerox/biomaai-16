
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, FileText, Loader2, Upload, Video, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataService, StudyMaterial } from "@/services/dataService";
import { errorHandler } from "@/lib/error";

const UploadPage = () => {
  const [activeTab, setActiveTab] = useState("pdf");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  
  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const result = await dataService.getStudyMaterials();
        setMaterials(result);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching materials:", error);
        const { message } = errorHandler(error);
        setIsError(true);
        setErrorMessage(message || "Failed to load your uploaded materials.");
        toast({
          title: "Error",
          description: "Failed to load your uploaded materials.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validate file type based on active tab
    let isValidFileType = false;
    
    if (activeTab === "pdf") {
      isValidFileType = file.name.endsWith(".pdf") || 
                        file.name.endsWith(".doc") || 
                        file.name.endsWith(".docx") || 
                        file.name.endsWith(".txt");
    } else if (activeTab === "video") {
      isValidFileType = file.name.endsWith(".mp4") || 
                        file.name.endsWith(".mov") || 
                        file.name.endsWith(".avi");
    }
    
    if (!isValidFileType) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a ${activeTab === "pdf" ? "PDF, DOC, DOCX, or TXT" : "MP4, MOV, or AVI"} file.`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size
    const maxSize = activeTab === "pdf" ? 50 * 1024 * 1024 : 500 * 1024 * 1024; // 50MB for PDF, 500MB for video
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `Maximum file size is ${activeTab === "pdf" ? "50MB" : "500MB"}.`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      // Call API to upload the file
      const result = await dataService.uploadMaterial(selectedFile);
      
      // Complete the progress and clear interval
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update materials list with the new entry
      setMaterials(prev => [...prev, result]);
      
      // Show success toast
      toast({
        title: "Upload Complete",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
      
      // Clear selected file after successful upload
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      const { message } = errorHandler(error);
      
      toast({
        title: "Upload Failed",
        description: message || "There was a problem uploading your file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    if (isUploading) {
      // In a real app, we'd abort the fetch/axios request
      toast({
        title: "Upload Cancelled",
        description: "Your upload has been cancelled.",
      });
    }
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const renderFileUpload = () => (
    <div 
      className={`border-2 ${dragOver ? 'border-primary' : 'border-dashed'} rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer`}
      onClick={() => document.getElementById(`${activeTab}-upload`)?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id={`${activeTab}-upload`} 
        className="hidden" 
        accept={activeTab === "pdf" ? ".pdf,.doc,.docx,.txt" : ".mp4,.mov,.avi"}
        onChange={handleFileChange}
      />
      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <p className="text-lg font-medium">Click to upload or drag & drop</p>
      <p className="text-sm text-muted-foreground mt-1">
        Support for {activeTab === "pdf" ? "PDF, DOC, DOCX, and TXT" : "MP4, MOV, and AVI"} files
      </p>
      
      {selectedFile && (
        <div className="mt-4 text-left bg-muted/50 p-3 rounded-md flex justify-between items-center">
          <div className="flex items-center">
            {activeTab === "pdf" ? (
              <FileText className="h-5 w-5 text-primary mr-2" />
            ) : (
              <Video className="h-5 w-5 text-primary mr-2" />
            )}
            <div>
              <p className="font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelUpload();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
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
  );

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
              {renderFileUpload()}
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
              {renderFileUpload()}
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
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="text-center py-8 flex flex-col items-center">
                  <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-muted-foreground">{errorMessage}</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              ) : materials.length > 0 ? (
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted/50 rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        {material.type === "pdf" ? (
                          <FileText className="h-5 w-5 text-primary mr-2" />
                        ) : material.type === "video" ? (
                          <Video className="h-5 w-5 text-primary mr-2" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary mr-2" />
                        )}
                        <div>
                          <span className="block">{material.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {material.fileSize} • {material.uploadDate.toLocaleString()}
                          </span>
                        </div>
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
            <AlertCircle className="h-4 w-4 mr-2 text-primary" />
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
