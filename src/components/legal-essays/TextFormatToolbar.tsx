
import React from "react";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, ListOrdered, List, Heading1, Heading2, 
  Quote, Link, FileText
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fonts = [
  { value: "arial", label: "Arial" },
  { value: "times-new-roman", label: "Times New Roman" },
  { value: "calibri", label: "Calibri" },
  { value: "georgia", label: "Georgia" },
  { value: "garamond", label: "Garamond" },
  { value: "courier", label: "Courier New" },
  { value: "helvetica", label: "Helvetica" },
];

const fontSizes = [
  { value: "xs", label: "8pt" },
  { value: "sm", label: "10pt" },
  { value: "base", label: "12pt" },
  { value: "lg", label: "14pt" },
  { value: "xl", label: "16pt" },
  { value: "2xl", label: "18pt" },
  { value: "3xl", label: "24pt" },
  { value: "4xl", label: "30pt" },
];

interface TextFormatToolbarProps {
  onFormatText: (format: string, value?: string) => void;
  currentFont: string;
  currentSize: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  alignment: "left" | "center" | "right";
}

const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  onFormatText,
  currentFont,
  currentSize,
  isBold,
  isItalic,
  isUnderline,
  alignment,
}) => {
  const handleInsertLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("linkText") as string;
    const url = formData.get("linkUrl") as string;
    
    if (text && url) {
      onFormatText("link", `[${text}](${url})`);
      (document.getElementById("insert-link-form") as HTMLFormElement).reset();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-card/80 border-b border-border/40 rounded-t-md">
      <div className="flex items-center gap-1 mr-2">
        <Select value={currentFont} onValueChange={(value) => onFormatText("font", value)}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentSize} onValueChange={(value) => onFormatText("size", value)}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button 
          variant={isBold ? "secondary" : "ghost"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant={isItalic ? "secondary" : "ghost"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant={isUnderline ? "secondary" : "ghost"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button 
          variant={alignment === "left" ? "secondary" : "ghost"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("align", "left")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant={alignment === "center" ? "secondary" : "ghost"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("align", "center")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant={alignment === "right" ? "secondary" : "ghost"} 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("align", "right")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("list", "bullet")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("list", "number")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("heading", "1")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("heading", "2")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form id="insert-link-form" onSubmit={handleInsertLink} className="space-y-3">
              <h4 className="font-medium">Insert Link</h4>
              <div className="space-y-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="linkText">Text</Label>
                  <Input id="linkText" name="linkText" placeholder="Link text" required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input id="linkUrl" name="linkUrl" placeholder="https://example.com" required />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm">Insert</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => onFormatText("template", "legal")}
          title="Use Legal Template"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TextFormatToolbar;
