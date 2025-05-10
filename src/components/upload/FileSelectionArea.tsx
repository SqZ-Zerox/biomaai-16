
import React from "react";
import { Button } from "@/components/ui/button";
import { FileUp, CheckCircle, UploadCloud } from "lucide-react";
import UploadProgressBar from "./UploadProgressBar";

interface FileSelectionAreaProps {
  selectedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
  handleBrowseFiles: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  dragActive?: boolean;
}

const FileSelectionArea: React.FC<FileSelectionAreaProps> = ({
  selectedFiles,
  isUploading,
  uploadProgress,
  handleBrowseFiles,
  fileInputRef,
  handleDrag,
  handleDrop,
  dragActive
}) => {
  return (
    <div 
      className={`border-2 ${dragActive ? 'border-primary' : 'border-dashed border-border/40'} rounded-lg p-8 text-center transition-colors`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          // Call any onChange handler passed as props
          if (fileInputRef.current) {
            console.log("File input change detected");
          }
        }}
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
      
      {isUploading && <UploadProgressBar progress={uploadProgress} label="Uploading..." />}
    </div>
  );
};

export default FileSelectionArea;
