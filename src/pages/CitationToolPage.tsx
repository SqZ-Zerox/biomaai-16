
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, Copy, BookOpen, Link, Trash2, PlusCircle, Save, Check, Search, FileText, Edit } from "lucide-react";

// Define citation styles
const citationStyles = [
  { id: "bluebook", name: "Bluebook" },
  { id: "apa", name: "APA" },
  { id: "mla", name: "MLA" },
  { id: "chicago", name: "Chicago" },
  { id: "harvard", name: "Harvard" },
];

// Define citation types
const citationTypes = [
  { id: "case", name: "Case" },
  { id: "statute", name: "Statute" },
  { id: "article", name: "Journal Article" },
  { id: "book", name: "Book" },
  { id: "website", name: "Website" },
];

// Citation interfaces
interface Citation {
  id: string;
  type: string;
  style: string;
  details: Record<string, string>;
  formattedCitation: string;
  createdAt: Date;
  tags: string[];
}

// Case citation form fields
const caseFields = [
  { id: "caseName", label: "Case Name", placeholder: "e.g., Brown v. Board of Education" },
  { id: "volume", label: "Reporter Volume", placeholder: "e.g., 347" },
  { id: "reporter", label: "Reporter", placeholder: "e.g., U.S." },
  { id: "page", label: "First Page", placeholder: "e.g., 483" },
  { id: "court", label: "Court", placeholder: "e.g., Supreme Court" },
  { id: "year", label: "Year", placeholder: "e.g., 1954" },
];

// Statute citation form fields
const statuteFields = [
  { id: "title", label: "Title/Code", placeholder: "e.g., 42 U.S.C." },
  { id: "section", label: "Section", placeholder: "e.g., § 1983" },
  { id: "year", label: "Year", placeholder: "e.g., 2021" },
];

// Journal article citation form fields
const articleFields = [
  { id: "author", label: "Author(s)", placeholder: "e.g., Smith, John" },
  { id: "title", label: "Article Title", placeholder: "e.g., Constitutional Law Developments" },
  { id: "journal", label: "Journal", placeholder: "e.g., Harvard Law Review" },
  { id: "volume", label: "Volume", placeholder: "e.g., 100" },
  { id: "page", label: "Page", placeholder: "e.g., 1" },
  { id: "year", label: "Year", placeholder: "e.g., 2022" },
];

// Book citation form fields
const bookFields = [
  { id: "author", label: "Author(s)", placeholder: "e.g., Smith, John" },
  { id: "title", label: "Book Title", placeholder: "e.g., Principles of Criminal Law" },
  { id: "publisher", label: "Publisher", placeholder: "e.g., Oxford University Press" },
  { id: "year", label: "Year", placeholder: "e.g., 2020" },
  { id: "edition", label: "Edition", placeholder: "e.g., 2nd" },
];

// Website citation form fields
const websiteFields = [
  { id: "author", label: "Author/Organization", placeholder: "e.g., American Bar Association" },
  { id: "title", label: "Page Title", placeholder: "e.g., Ethics Guidelines" },
  { id: "website", label: "Website Name", placeholder: "e.g., ABA Ethics Center" },
  { id: "url", label: "URL", placeholder: "e.g., https://www.americanbar.org/ethics" },
  { id: "accessed", label: "Date Accessed", placeholder: "e.g., Apr. 5, 2025" },
];

const CitationToolPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const [citationType, setCitationType] = useState("case");
  const [citationStyle, setCitationStyle] = useState("bluebook");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formattedCitation, setFormattedCitation] = useState<string>("");
  const [savedCitations, setSavedCitations] = useState<Citation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStyle, setFilterStyle] = useState<string | null>(null);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCitationId, setEditingCitationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get the correct fields based on citation type
  const getFields = () => {
    switch (citationType) {
      case "case":
        return caseFields;
      case "statute":
        return statuteFields;
      case "article":
        return articleFields;
      case "book":
        return bookFields;
      case "website":
        return websiteFields;
      default:
        return caseFields;
    }
  };

  // Format citation based on type and style
  const formatCitation = () => {
    let citation = "";
    
    try {
      if (citationType === "case") {
        // Bluebook format for case citations
        if (citationStyle === "bluebook") {
          citation = `${formData.caseName}, ${formData.volume} ${formData.reporter} ${formData.page} (${formData.court} ${formData.year})`;
        } else {
          citation = `${formData.caseName}, ${formData.volume} ${formData.reporter} ${formData.page} (${formData.year})`;
        }
      } else if (citationType === "statute") {
        citation = `${formData.title} ${formData.section} (${formData.year})`;
      } else if (citationType === "article") {
        citation = `${formData.author}, ${formData.title}, ${formData.volume} ${formData.journal} ${formData.page} (${formData.year})`;
      } else if (citationType === "book") {
        citation = `${formData.author}, ${formData.title} (${formData.edition ? formData.edition + " ed. " : ""}${formData.publisher} ${formData.year})`;
      } else if (citationType === "website") {
        citation = `${formData.author}, ${formData.title}, ${formData.website}, ${formData.url} (last visited ${formData.accessed})`;
      }
    } catch (error) {
      console.error("Error formatting citation:", error);
      citation = "Please fill in all required fields";
    }
    
    return citation;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate citation
  const handleGenerate = () => {
    const citation = formatCitation();
    setFormattedCitation(citation);
  };

  // Copy citation to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCitation);
    toast({
      title: "Copied!",
      description: "Citation copied to clipboard",
    });
  };

  // Save citation to library
  const handleSave = () => {
    if (formattedCitation.trim() === "") {
      toast({
        title: "Error",
        description: "Please generate a citation first",
        variant: "destructive",
      });
      return;
    }

    const newCitation: Citation = {
      id: editingCitationId || `citation-${Date.now()}`,
      type: citationType,
      style: citationStyle,
      details: { ...formData },
      formattedCitation,
      createdAt: new Date(),
      tags: [...currentTags],
    };

    if (isEditing && editingCitationId) {
      setSavedCitations((prev) =>
        prev.map((citation) =>
          citation.id === editingCitationId ? newCitation : citation
        )
      );
      toast({
        title: "Updated!",
        description: "Citation has been updated",
      });
      setIsEditing(false);
      setEditingCitationId(null);
    } else {
      setSavedCitations((prev) => [newCitation, ...prev]);
      toast({
        title: "Saved!",
        description: "Citation added to your library",
      });
    }

    // Clear form after saving
    setFormData({});
    setFormattedCitation("");
    setCurrentTags([]);
  };

  // Delete citation from library
  const handleDelete = (id: string) => {
    setSavedCitations((prev) => prev.filter((citation) => citation.id !== id));
    toast({
      title: "Deleted",
      description: "Citation removed from your library",
    });
  };

  // Edit citation
  const handleEdit = (citation: Citation) => {
    setCitationType(citation.type);
    setCitationStyle(citation.style);
    setFormData(citation.details);
    setFormattedCitation(citation.formattedCitation);
    setCurrentTags(citation.tags);
    setIsEditing(true);
    setEditingCitationId(citation.id);
    setActiveTab("generator");
  };

  // Add tag to current citation
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      if (!currentTags.includes(newTag.trim())) {
        setCurrentTags((prev) => [...prev, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  // Remove tag from current citation
  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Get citation type name
  const getCitationTypeName = (type: string) => {
    const found = citationTypes.find((t) => t.id === type);
    return found ? found.name : type;
  };

  // Get citation style name
  const getCitationStyleName = (style: string) => {
    const found = citationStyles.find((s) => s.id === style);
    return found ? found.name : style;
  };

  // Filter and search citations
  const filteredCitations = savedCitations.filter((citation) => {
    const matchesSearchTerm = citation.formattedCitation
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType ? citation.type === filterType : true;
    const matchesStyle = filterStyle ? citation.style === filterStyle : true;
    return matchesSearchTerm && matchesType && matchesStyle;
  });

  // Load saved citations from localStorage on initial load
  useEffect(() => {
    const storedCitations = localStorage.getItem("savedCitations");
    if (storedCitations) {
      try {
        const parsedCitations = JSON.parse(storedCitations);
        // Convert string dates back to Date objects
        const processedCitations = parsedCitations.map((citation: any) => ({
          ...citation,
          createdAt: new Date(citation.createdAt),
        }));
        setSavedCitations(processedCitations);
      } catch (error) {
        console.error("Error parsing saved citations:", error);
      }
    }
  }, []);

  // Save citations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedCitations", JSON.stringify(savedCitations));
  }, [savedCitations]);

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2 flex items-center">
        <Link className="h-6 w-6 mr-2 text-primary" />
        Legal Citation Tool
      </h1>
      <p className="text-muted-foreground mb-6">
        Generate, format, and manage legal citations in various styles
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Citation Generator
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Citation Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Citation</CardTitle>
              <CardDescription>
                Select the type of source and citation style, then enter the details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Citation Type</label>
                  <Select
                    value={citationType}
                    onValueChange={(value) => {
                      setCitationType(value);
                      setFormData({});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {citationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Citation Style</label>
                  <Select
                    value={citationStyle}
                    onValueChange={(value) => setCitationStyle(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {citationStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {getFields().map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    <Input
                      placeholder={field.placeholder}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tags (press Enter)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleGenerate}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Generate Citation
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={!formattedCitation}
              >
                {isEditing ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Update Citation
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save to Library
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {formattedCitation && (
            <Card>
              <CardHeader>
                <CardTitle>Formatted Citation</CardTitle>
                <CardDescription>
                  Use this citation in your legal documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-mono text-sm break-all">{formattedCitation}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Citation Library</CardTitle>
              <CardDescription>
                Your saved citations for quick reference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search citations..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={filterType || "all"}
                  onValueChange={(value) =>
                    setFilterType(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {citationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterStyle || "all"}
                  onValueChange={(value) =>
                    setFilterStyle(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    {citationStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredCitations.length === 0 ? (
                <div className="text-center py-8">
                  <Clipboard className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="mt-2 text-muted-foreground">
                    {savedCitations.length === 0
                      ? "Your citation library is empty. Save citations to see them here."
                      : "No citations match your search filters."}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[450px] pr-4">
                  <div className="space-y-4">
                    {filteredCitations.map((citation) => (
                      <Card key={citation.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">
                                  {getCitationTypeName(citation.type)}
                                </Badge>
                                <Badge variant="outline">
                                  {getCitationStyleName(citation.style)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {citation.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(citation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Citation</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this citation? This action
                                      cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => document.body.click()}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleDelete(citation.id);
                                        document.body.click();
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="bg-muted p-3 rounded-md">
                            <p className="font-mono text-sm break-all">
                              {citation.formattedCitation}
                            </p>
                          </div>
                          {citation.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {citation.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto"
                            onClick={() => {
                              navigator.clipboard.writeText(citation.formattedCitation);
                              toast({
                                title: "Copied!",
                                description: "Citation copied to clipboard",
                              });
                            }}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" />
                            Copy
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CitationToolPage;
