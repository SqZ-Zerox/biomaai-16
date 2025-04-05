
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  BookText, 
  FileText, 
  Globe, 
  BookOpenCheck, 
  Copy, 
  Check, 
  Trash2,
  ClipboardList,
  MoreHorizontal
} from "lucide-react";
import { 
  CITATION_STYLES, 
  CitationSource, 
  formatCitation, 
  getSavedCitations,
  saveCitation,
  deleteSavedCitation
} from "@/services/citationService";

const CitationToolPage: React.FC = () => {
  const [sourceType, setSourceType] = useState<CitationSource["type"]>("case");
  const [citationStyle, setCitationStyle] = useState("bluebook");
  const [source, setSource] = useState<CitationSource>({
    type: "case",
    title: "",
  });
  const [formattedCitation, setFormattedCitation] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [savedCitations, setSavedCitations] = useState<{id: string, text: string, date: string}[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedCitations();
  }, []);

  const loadSavedCitations = () => {
    const citations = getSavedCitations();
    setSavedCitations(citations);
  };

  const handleSourceTypeChange = (type: CitationSource["type"]) => {
    setSourceType(type);
    setSource({
      type,
      title: source.title || "",
    });
  };

  const handleInputChange = (field: keyof CitationSource, value: string | string[]) => {
    setSource(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCitation = () => {
    if (!source.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the source",
        variant: "destructive"
      });
      return;
    }
    
    const citation = formatCitation(source, citationStyle);
    setFormattedCitation(citation);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(formattedCitation);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "Citation has been copied to clipboard"
    });
  };

  const handleSaveCitation = () => {
    if (!formattedCitation) {
      toast({
        title: "Error",
        description: "Please generate a citation first",
        variant: "destructive"
      });
      return;
    }
    
    saveCitation(formattedCitation);
    loadSavedCitations();
    
    toast({
      title: "Citation Saved",
      description: "Your citation has been saved"
    });
  };

  const handleDeleteCitation = (id: string) => {
    deleteSavedCitation(id);
    loadSavedCitations();
    
    toast({
      title: "Citation Deleted",
      description: "The citation has been removed from your saved list"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSourceForm = () => {
    switch (sourceType) {
      case "case":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="title">Case Name</Label>
              <Input
                id="title"
                value={source.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Brown v. Board of Education"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="volume">Reporter Volume</Label>
                <Input
                  id="volume"
                  value={source.volume || ""}
                  onChange={(e) => handleInputChange("volume", e.target.value)}
                  placeholder="e.g., 347"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="publisher">Reporter</Label>
                <Input
                  id="publisher"
                  value={source.publisher || ""}
                  onChange={(e) => handleInputChange("publisher", e.target.value)}
                  placeholder="e.g., U.S."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pageRange">Page Number</Label>
                <Input
                  id="pageRange"
                  value={source.pageRange || ""}
                  onChange={(e) => handleInputChange("pageRange", e.target.value)}
                  placeholder="e.g., 483"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={source.year || ""}
                  onChange={(e) => handleInputChange("year", e.target.value.toString())}
                  placeholder="e.g., 1954"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="court">Court</Label>
                <Input
                  id="court"
                  value={source.court || ""}
                  onChange={(e) => handleInputChange("court", e.target.value)}
                  placeholder="e.g., Supreme Court"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pinpoint">Pinpoint Citation</Label>
                <Input
                  id="pinpoint"
                  value={source.pinpoint || ""}
                  onChange={(e) => handleInputChange("pinpoint", e.target.value)}
                  placeholder="e.g., 495"
                />
              </div>
            </div>
          </>
        );
        
      case "statute":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="title">Statute Title</Label>
              <Input
                id="title"
                value={source.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Americans with Disabilities Act"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="volume">Title/Volume</Label>
                <Input
                  id="volume"
                  value={source.volume || ""}
                  onChange={(e) => handleInputChange("volume", e.target.value)}
                  placeholder="e.g., 42"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="publisher">Code</Label>
                <Input
                  id="publisher"
                  value={source.publisher || ""}
                  onChange={(e) => handleInputChange("publisher", e.target.value)}
                  placeholder="e.g., U.S.C."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={source.year || ""}
                  onChange={(e) => handleInputChange("year", e.target.value.toString())}
                  placeholder="e.g., 2020"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pinpoint">Section</Label>
                <Input
                  id="pinpoint"
                  value={source.pinpoint || ""}
                  onChange={(e) => handleInputChange("pinpoint", e.target.value)}
                  placeholder="e.g., 12101"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Input
                id="jurisdiction"
                value={source.jurisdiction || ""}
                onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                placeholder="e.g., Federal"
              />
            </div>
          </>
        );
        
      case "book":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="authors">Author(s)</Label>
              <Textarea
                id="authors"
                value={source.authors?.join(", ") || ""}
                onChange={(e) => handleInputChange("authors", e.target.value.split(", "))}
                placeholder="e.g., Richard A. Posner"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate multiple authors with commas</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                value={source.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Economic Analysis of Law"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  value={source.publisher || ""}
                  onChange={(e) => handleInputChange("publisher", e.target.value)}
                  placeholder="e.g., Aspen Publishers"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={source.year || ""}
                  onChange={(e) => handleInputChange("year", e.target.value.toString())}
                  placeholder="e.g., 2011"
                />
              </div>
            </div>
          </>
        );
        
      case "journal":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="authors">Author(s)</Label>
              <Textarea
                id="authors"
                value={source.authors?.join(", ") || ""}
                onChange={(e) => handleInputChange("authors", e.target.value.split(", "))}
                placeholder="e.g., Cass R. Sunstein"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate multiple authors with commas</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={source.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Incompletely Theorized Agreements"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  value={source.volume || ""}
                  onChange={(e) => handleInputChange("volume", e.target.value)}
                  placeholder="e.g., 108"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="publisher">Journal Name</Label>
                <Input
                  id="publisher"
                  value={source.publisher || ""}
                  onChange={(e) => handleInputChange("publisher", e.target.value)}
                  placeholder="e.g., Harv. L. Rev."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pageRange">Page Range</Label>
                <Input
                  id="pageRange"
                  value={source.pageRange || ""}
                  onChange={(e) => handleInputChange("pageRange", e.target.value)}
                  placeholder="e.g., 1733-1772"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={source.year || ""}
                  onChange={(e) => handleInputChange("year", e.target.value.toString())}
                  placeholder="e.g., 1995"
                />
              </div>
            </div>
          </>
        );
        
      case "website":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="authors">Author(s)</Label>
              <Textarea
                id="authors"
                value={source.authors?.join(", ") || ""}
                onChange={(e) => handleInputChange("authors", e.target.value.split(", "))}
                placeholder="e.g., Legal Information Institute"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate multiple authors with commas</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Title of Web Page</Label>
              <Input
                id="title"
                value={source.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Stare Decisis"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="publisher">Website Name</Label>
              <Input
                id="publisher"
                value={source.publisher || ""}
                onChange={(e) => handleInputChange("publisher", e.target.value)}
                placeholder="e.g., Cornell Law School"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={source.url || ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="e.g., https://www.law.cornell.edu/wex/stare_decisis"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dateAccessed">Date Accessed</Label>
              <Input
                id="dateAccessed"
                value={source.dateAccessed || ""}
                onChange={(e) => handleInputChange("dateAccessed", e.target.value)}
                placeholder="e.g., Apr. 5, 2023"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  const getSourceTypeIcon = (type: CitationSource["type"]) => {
    switch (type) {
      case "case":
        return <FileText className="h-5 w-5" />;
      case "statute":
        return <BookOpenCheck className="h-5 w-5" />;
      case "book":
        return <BookText className="h-5 w-5" />;
      case "journal":
        return <BookOpen className="h-5 w-5" />;
      case "website":
        return <Globe className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Legal Citation Tool</h1>
        <p className="text-muted-foreground mt-1">Generate accurate legal citations in multiple formats</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Citation Generator */}
        <Card className="md:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Citation Generator</CardTitle>
            <CardDescription>
              Generate citations for different legal sources in your preferred style
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="case">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger 
                  value="case" 
                  onClick={() => handleSourceTypeChange("case")}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Case</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="statute" 
                  onClick={() => handleSourceTypeChange("statute")}
                  className="flex items-center gap-2"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Statute</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="book" 
                  onClick={() => handleSourceTypeChange("book")}
                  className="flex items-center gap-2"
                >
                  <BookText className="h-4 w-4" />
                  <span className="hidden sm:inline">Book</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="journal" 
                  onClick={() => handleSourceTypeChange("journal")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Journal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="website" 
                  onClick={() => handleSourceTypeChange("website")}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Website</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="citationStyle">Citation Style</Label>
                    <Select 
                      value={citationStyle} 
                      onValueChange={setCitationStyle}
                    >
                      <SelectTrigger id="citationStyle">
                        <SelectValue placeholder="Select a citation style" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITATION_STYLES.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {renderSourceForm()}
                </div>
                
                <Button onClick={generateCitation} className="w-full mt-6">
                  Generate Citation
                </Button>
                
                {formattedCitation && (
                  <div className="mt-6 p-4 border rounded-md bg-muted/30">
                    <div className="flex justify-between items-start">
                      <Label className="mb-2">Generated Citation:</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCopyToClipboard}
                          className="h-8"
                        >
                          {copySuccess ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1 h-3 w-3" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSaveCitation}
                          className="h-8"
                        >
                          <ClipboardList className="mr-1 h-3 w-3" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 p-3 bg-background rounded-md">{formattedCitation}</p>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Saved Citations */}
        <Card className="md:col-span-1 border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Saved Citations</CardTitle>
            <CardDescription>
              View and manage your saved citations
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {savedCitations.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved citations</h3>
                <p className="text-muted-foreground text-sm">
                  Generate a citation and save it to view it here.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-26rem)]">
                <div className="space-y-4">
                  {savedCitations.map((citation) => (
                    <div 
                      key={citation.id} 
                      className="p-3 rounded-md border border-border/40 bg-muted/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(citation.date)}
                        </span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(citation.text);
                              toast({
                                title: "Copied to Clipboard",
                                description: "Citation has been copied to clipboard"
                              });
                            }}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCitation(citation.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm">{citation.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center pt-2 pb-4">
            <p className="text-xs text-muted-foreground">
              {savedCitations.length} {savedCitations.length === 1 ? "citation" : "citations"} saved
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CitationToolPage;
