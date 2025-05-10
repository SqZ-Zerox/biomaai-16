
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadLabReport } from "@/services/labReportService";
import { 
  FileText, UploadCloud, ArrowRight, Check, Clock, 
  ArrowLeft, FileUp, Loader, AlertCircle, CheckCircle 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use simplified steps since we're auto-detecting test types
  const [step, setStep] = useState<number>(1); // 1: File Upload, 2: Processing, 3: Results
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, status: string}[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };
  
  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to upload lab reports",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one lab report to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Start the upload progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      // Upload each selected file
      const uploadPromises = selectedFiles.map(file => 
        uploadLabReport(file, user.id)
      );
      
      const results = await Promise.all(uploadPromises);
      
      // Check if any upload failed
      const failedUploads = results.filter(result => result.error);
      
      if (failedUploads.length > 0) {
        toast({
          title: "Upload failed",
          description: `${failedUploads.length} file(s) failed to upload`,
          variant: "destructive",
        });
        
        setUploadedFiles(
          results.map((result, i) => ({
            name: selectedFiles[i].name,
            status: result.error ? "failed" : "success"
          }))
        );
      } else {
        // All uploads successful
        setUploadedFiles(
          selectedFiles.map(file => ({
            name: file.name,
            status: "success"
          }))
        );
        
        // Complete the upload progress animation
        setUploadProgress(100);
        
        // Move to processing step
        setTimeout(() => {
          setStep(2);
          startProcessing();
        }, 500);
        
        toast({
          title: "Upload successful",
          description: `${selectedFiles.length} file(s) uploaded successfully. Test types will be automatically detected.`,
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading files",
        variant: "destructive",
      });
      
      setUploadedFiles(
        selectedFiles.map(file => ({
          name: file.name,
          status: "failed"
        }))
      );
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(100);
    }
  };
  
  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Show success message
          toast({
            title: "Analysis complete",
            description: "Your lab reports have been successfully analyzed",
          });
          
          // Move to results step
          setStep(3);
          return 100;
        }
        return prev + 2;
      });
    }, 300);
  };
  
  const handleContinue = () => {
    if (step === 1) {
      handleUpload();
    } else if (step === 3) {
      navigate("/dashboard");
    }
  };
  
  const handleBack = () => {
    if (step > 1 && !isUploading && !isProcessing) {
      setStep(step - 1);
    } else if (step === 1) {
      navigate("/dashboard");
    }
  };
  
  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col gap-6">
        <Button 
          variant="ghost" 
          className="w-fit text-muted-foreground" 
          onClick={handleBack}
          disabled={isUploading || isProcessing}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 1 ? 'Back to Dashboard' : 'Previous Step'}
        </Button>
        
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <FileText className="mr-2 h-7 w-7 text-primary" />
            Lab Report Analysis
          </h1>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div 
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNum === step 
                      ? 'bg-primary text-primary-foreground'
                      : stepNum < step 
                        ? 'bg-primary/70 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNum < step ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div 
                    className={`h-1 flex-grow mx-1 rounded-full ${
                      stepNum < step
                        ? 'bg-primary/70'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <CardTitle>
              {step === 1 && "Upload Lab Reports"}
              {step === 2 && "Processing Documents"}
              {step === 3 && "Analysis Complete"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Upload your lab report documents - test types will be automatically detected"}
              {step === 2 && "We're analyzing your lab reports"}
              {step === 3 && "Here's what we found in your reports"}
            </CardDescription>
          </CardHeader>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border/40 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    
                    {selectedFiles.length === 0 ? (
                      <div>
                        <div className="flex justify-center mb-4">
                          <div className="p-4 bg-muted/50 rounded-full">
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Drag & Drop or Browse</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                          Upload your lab reports as PDF, JPG or PNG files
                        </p>
                        <div className="flex justify-center">
                          <Button onClick={handleBrowseFiles}>
                            <FileUp className="mr-2 h-4 w-4" />
                            Select Files
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-center mb-4">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <CheckCircle className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Files Selected</h3>
                        <ul className="mb-4 text-left space-y-2">
                          {selectedFiles.map((file, index) => (
                            <li 
                              key={index} 
                              className="flex items-center justify-between p-2 bg-background rounded-md"
                            >
                              <span className="truncate max-w-[200px] text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-center">
                          <Button variant="outline" onClick={handleBrowseFiles} disabled={isUploading} className="mr-2">
                            Change Files
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="mt-4">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                  
                  <Alert className="bg-muted/50 border-primary/20">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Automatic Test Detection</AlertTitle>
                    <AlertDescription className="text-sm text-muted-foreground">
                      Our AI will automatically identify the types of tests in your lab report. You don't need to specify them manually.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}
              
              {step === 2 && (
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Loader className="h-12 w-12 text-primary animate-spin" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-medium mb-2">Analyzing Your Reports</h3>
                      <p className="text-muted-foreground mb-6">This may take a few moments</p>
                    </div>
                    
                    <div className="w-full max-w-md mx-auto">
                      <Progress value={processingProgress} className="h-2" />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>Analyzing</span>
                        <span>{processingProgress}%</span>
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md mt-4 pt-4 border-t border-border/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Current step:</span>
                        </div>
                        <span className="text-sm font-medium">
                          {processingProgress < 30 ? "Extracting Text & Detecting Tests" : 
                           processingProgress < 60 ? "Identifying Lab Values" : 
                           processingProgress < 90 ? "Comparing to Reference Ranges" : 
                           "Generating Insights"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
              
              {step === 3 && (
                <CardContent className="py-8">
                  <div className="mb-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Analysis Complete!</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      We've analyzed your lab reports and generated personalized insights and recommendations.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Report Summary</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Documents Processed:</span>
                            <span className="font-medium">{selectedFiles.length} files</span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tests Detected:</span>
                            <span className="font-medium">Automatically identified</span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Values Outside Reference:</span>
                            <span className="font-medium">5 markers</span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Generated Insights:</span>
                            <span className="font-medium">4 recommendations</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Alert className="bg-primary/5 border-primary/30">
                      <FileText className="h-4 w-4 text-primary" />
                      <AlertTitle>Next Steps</AlertTitle>
                      <AlertDescription className="text-sm">
                        Go to your dashboard to view your complete health analysis and personalized recommendations based on your lab results.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              )}
            </motion.div>
          </AnimatePresence>
          
          <CardFooter className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isUploading || isProcessing || step === 2}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={isUploading || isProcessing || step === 2}
            >
              {step === 3 ? 'View Dashboard' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
