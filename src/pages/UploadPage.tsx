
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLabUpload } from "@/hooks/useLabUpload";

// Import refactored components
import FileSelectionArea from "@/components/upload/FileSelectionArea";
import ProcessingStep from "@/components/upload/ProcessingStep";
import CompletionStep from "@/components/upload/CompletionStep";
import UploadStepIndicator from "@/components/upload/UploadStepIndicator";
import UploadAlert from "@/components/upload/UploadAlert";

const UploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    step, 
    isUploading, 
    isProcessing, 
    uploadProgress, 
    processingProgress, 
    selectedFiles, 
    handleFileChange, 
    handleContinue, 
    handleBack 
  } = useLabUpload();
  
  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const getStepTitle = () => {
    if (step === 1) return "Upload Lab Reports";
    if (step === 2) return "Processing Documents";
    return "Analysis Complete";
  };
  
  const getStepDescription = () => {
    if (step === 1) return "Upload your lab report documents - test types will be automatically detected";
    if (step === 2) return "We're analyzing your lab reports";
    return "Here's what we found in your reports";
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
        
        <UploadStepIndicator currentStep={step} totalSteps={3} />
        
        <Card className="border-border/40">
          <CardHeader className="pb-4">
            <CardTitle>{getStepTitle()}</CardTitle>
            <CardDescription>{getStepDescription()}</CardDescription>
          </CardHeader>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-6">
                {step === 1 && (
                  <>
                    <FileSelectionArea
                      selectedFiles={selectedFiles}
                      isUploading={isUploading}
                      uploadProgress={uploadProgress}
                      handleBrowseFiles={handleBrowseFiles}
                      fileInputRef={fileInputRef}
                    />
                    <UploadAlert />
                  </>
                )}
                
                {step === 2 && (
                  <ProcessingStep processingProgress={processingProgress} />
                )}
                
                {step === 3 && (
                  <CompletionStep selectedFiles={selectedFiles} />
                )}
              </CardContent>
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
