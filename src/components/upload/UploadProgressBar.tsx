
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressBarProps {
  progress: number;
  label: string;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="mt-4">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground mt-2">{label} {progress}%</p>
    </div>
  );
};

export default UploadProgressBar;
