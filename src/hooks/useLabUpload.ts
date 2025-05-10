import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadLabReport } from "@/services/lab-reports";

export const useLabUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
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
  
  return {
    step,
    isUploading,
    isProcessing,
    uploadProgress,
    processingProgress,
    selectedFiles,
    uploadedFiles,
    handleFileChange,
    handleUpload,
    handleContinue,
    handleBack,
  };
};
