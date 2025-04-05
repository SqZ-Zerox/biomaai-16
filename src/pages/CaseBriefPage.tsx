
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CaseBrief, CASE_BRIEF_TEMPLATES, createBrief, deleteBrief, getBriefs, updateBrief } from "@/services/caseBriefService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MoreHorizontal, 
  Plus, 
  File, 
  FileText, 
  Trash2, 
  Edit, 
  Download,
  Copy,
  Check,
  X
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const CaseBriefPage: React.FC = () => {
  const [briefs, setBriefs] = useState<CaseBrief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<CaseBrief | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [briefForm, setBriefForm] = useState<Omit<CaseBrief, 'id' | 'createdAt' | 'updatedAt'>>({
    title: "",
    citation: "",
    court: "",
    year: "",
    facts: "",
    issue: "",
    holding: "",
    reasoning: "",
    rule: "",
    analysis: "",
    notes: ""
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBriefs();
  }, []);

  const loadBriefs = () => {
    const allBriefs = getBriefs();
    setBriefs(allBriefs);
    
    // Select the first brief if available and none is selected
    if (allBriefs.length > 0 && !selectedBrief) {
      setSelectedBrief(allBriefs[0]);
    }
  };

  const handleCreateBrief = () => {
    try {
      const newBrief = createBrief(briefForm);
      setBriefs([...briefs, newBrief]);
      setSelectedBrief(newBrief);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Case Brief Created",
        description: "Your case brief has been successfully created."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create case brief. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBrief = () => {
    if (!selectedBrief) return;
    
    try {
      const updated = updateBrief(selectedBrief.id, briefForm);
      if (updated) {
        setBriefs(briefs.map(brief => brief.id === updated.id ? updated : brief));
        setSelectedBrief(updated);
        setIsEditDialogOpen(false);
        toast({
          title: "Case Brief Updated",
          description: "Your case brief has been successfully updated."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update case brief. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBrief = () => {
    if (!selectedBrief) return;
    
    try {
      const success = deleteBrief(selectedBrief.id);
      if (success) {
        const updatedBriefs = briefs.filter(brief => brief.id !== selectedBrief.id);
        setBriefs(updatedBriefs);
        setSelectedBrief(updatedBriefs.length > 0 ? updatedBriefs[0] : null);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Case Brief Deleted",
          description: "Your case brief has been successfully deleted."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete case brief. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setBriefForm({
      title: "",
      citation: "",
      court: "",
      year: "",
      facts: "",
      issue: "",
      holding: "",
      reasoning: "",
      rule: "",
      analysis: "",
      notes: ""
    });
  };

  const openEditDialog = () => {
    if (selectedBrief) {
      const { id, createdAt, updatedAt, ...rest } = selectedBrief;
      setBriefForm(rest);
      setIsEditDialogOpen(true);
    }
  };

  const applyTemplate = (template: typeof CASE_BRIEF_TEMPLATES[0]) => {
    setBriefForm({
      ...template
    });
  };

  const downloadBrief = () => {
    if (!selectedBrief) return;
    
    const briefText = `
# ${selectedBrief.title}
Citation: ${selectedBrief.citation}
Court: ${selectedBrief.court}
Year: ${selectedBrief.year}

## Facts
${selectedBrief.facts}

## Issue
${selectedBrief.issue}

## Holding
${selectedBrief.holding}

## Rule of Law
${selectedBrief.rule}

## Reasoning
${selectedBrief.reasoning}

## Analysis
${selectedBrief.analysis}

## Notes
${selectedBrief.notes}
`.trim();
    
    const blob = new Blob([briefText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedBrief.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Brief Downloaded",
      description: "Your case brief has been downloaded as a text file."
    });
  };

  const copyBriefToClipboard = () => {
    if (!selectedBrief) return;
    
    const briefText = `
${selectedBrief.title}
Citation: ${selectedBrief.citation}
Court: ${selectedBrief.court}
Year: ${selectedBrief.year}

FACTS
${selectedBrief.facts}

ISSUE
${selectedBrief.issue}

HOLDING
${selectedBrief.holding}

RULE OF LAW
${selectedBrief.rule}

REASONING
${selectedBrief.reasoning}

ANALYSIS
${selectedBrief.analysis}

NOTES
${selectedBrief.notes}
`.trim();
    
    navigator.clipboard.writeText(briefText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "Case brief has been copied to clipboard."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Brief Generator</h1>
          <p className="text-muted-foreground mt-1">Create, manage, and organize your case briefs in one place</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case Brief
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Case Brief</DialogTitle>
              <DialogDescription>
                Enter the details for your new case brief. Use templates for quick starting points.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Case Name</Label>
                <Input
                  id="title"
                  value={briefForm.title}
                  onChange={(e) => setBriefForm({...briefForm, title: e.target.value})}
                  placeholder="e.g., Smith v. Jones"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="citation">Citation</Label>
                <Input
                  id="citation"
                  value={briefForm.citation}
                  onChange={(e) => setBriefForm({...briefForm, citation: e.target.value})}
                  placeholder="e.g., 550 U.S. 544 (2007)"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="court">Court</Label>
                <Input
                  id="court"
                  value={briefForm.court}
                  onChange={(e) => setBriefForm({...briefForm, court: e.target.value})}
                  placeholder="e.g., Supreme Court of the United States"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={briefForm.year}
                  onChange={(e) => setBriefForm({...briefForm, year: e.target.value})}
                  placeholder="e.g., 2007"
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="facts">Facts</Label>
                <Textarea
                  id="facts"
                  value={briefForm.facts}
                  onChange={(e) => setBriefForm({...briefForm, facts: e.target.value})}
                  placeholder="Summarize the key facts of the case"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="issue">Issue</Label>
                <Textarea
                  id="issue"
                  value={briefForm.issue}
                  onChange={(e) => setBriefForm({...briefForm, issue: e.target.value})}
                  placeholder="State the legal question presented"
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="holding">Holding</Label>
                <Textarea
                  id="holding"
                  value={briefForm.holding}
                  onChange={(e) => setBriefForm({...briefForm, holding: e.target.value})}
                  placeholder="State the court's answer to the legal question"
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="rule">Rule of Law</Label>
                <Textarea
                  id="rule"
                  value={briefForm.rule}
                  onChange={(e) => setBriefForm({...briefForm, rule: e.target.value})}
                  placeholder="State the legal rule established or applied"
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="reasoning">Reasoning</Label>
                <Textarea
                  id="reasoning"
                  value={briefForm.reasoning}
                  onChange={(e) => setBriefForm({...briefForm, reasoning: e.target.value})}
                  placeholder="Explain the court's rationale"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="analysis">Analysis</Label>
                <Textarea
                  id="analysis"
                  value={briefForm.analysis}
                  onChange={(e) => setBriefForm({...briefForm, analysis: e.target.value})}
                  placeholder="Your analysis of the case and its significance"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={briefForm.notes}
                  onChange={(e) => setBriefForm({...briefForm, notes: e.target.value})}
                  placeholder="Additional notes, questions, or observations"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {CASE_BRIEF_TEMPLATES.map((template, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onClick={() => applyTemplate(template)}
                    >
                      {template.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBrief}>Create Brief</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Case brief list */}
        <Card className="md:col-span-1 border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Case Briefs</CardTitle>
            <CardDescription>
              {briefs.length === 0
                ? "Create your first case brief to get started"
                : `${briefs.length} brief${briefs.length === 1 ? "" : "s"} in your collection`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {briefs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No case briefs yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first case brief using the "New Case Brief" button.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Brief
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-25rem)]">
                <div className="space-y-3">
                  {briefs.map((brief) => (
                    <div 
                      key={brief.id}
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        selectedBrief?.id === brief.id
                          ? "border-primary bg-primary/10"
                          : "border-border/40 hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedBrief(brief)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium line-clamp-1">{brief.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {brief.citation}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Updated: {formatDate(brief.updatedAt)}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBrief(brief);
                            openEditDialog();
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
        
        {/* Case brief viewer */}
        <Card className="md:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm">
          {selectedBrief ? (
            <>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{selectedBrief.title}</CardTitle>
                  <CardDescription className="mt-1.5">
                    {selectedBrief.citation} • {selectedBrief.court} • {selectedBrief.year}
                  </CardDescription>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={openEditDialog}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Brief
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyBriefToClipboard}>
                      {copySuccess ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadBrief}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Brief
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Brief
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="full">Full Brief</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Facts</h3>
                        <p className="text-sm whitespace-pre-line">{selectedBrief.facts}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Issue</h3>
                        <p className="text-sm whitespace-pre-line">{selectedBrief.issue}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Holding</h3>
                        <p className="text-sm whitespace-pre-line">{selectedBrief.holding}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Rule</h3>
                        <p className="text-sm whitespace-pre-line">{selectedBrief.rule}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="full" className="mt-0">
                    <ScrollArea className="h-[calc(100vh-24rem)]">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Facts</h3>
                          <p className="text-sm whitespace-pre-line">{selectedBrief.facts}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Issue</h3>
                          <p className="text-sm whitespace-pre-line">{selectedBrief.issue}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Holding</h3>
                          <p className="text-sm whitespace-pre-line">{selectedBrief.holding}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Rule of Law</h3>
                          <p className="text-sm whitespace-pre-line">{selectedBrief.rule}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Reasoning</h3>
                          <p className="text-sm whitespace-pre-line">{selectedBrief.reasoning}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Analysis</h3>
                          <p className="text-sm whitespace-pre-line">{selectedBrief.analysis}</p>
                        </div>
                        
                        {selectedBrief.notes && (
                          <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Notes</h3>
                            <p className="text-sm whitespace-pre-line">{selectedBrief.notes}</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <File className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No Brief Selected</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                Select a brief from the list on the left or create a new brief to get started.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Brief
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Case Brief</DialogTitle>
            <DialogDescription>
              Update the details for your case brief.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Case Name</Label>
              <Input
                id="edit-title"
                value={briefForm.title}
                onChange={(e) => setBriefForm({...briefForm, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-citation">Citation</Label>
              <Input
                id="edit-citation"
                value={briefForm.citation}
                onChange={(e) => setBriefForm({...briefForm, citation: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-court">Court</Label>
              <Input
                id="edit-court"
                value={briefForm.court}
                onChange={(e) => setBriefForm({...briefForm, court: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-year">Year</Label>
              <Input
                id="edit-year"
                value={briefForm.year}
                onChange={(e) => setBriefForm({...briefForm, year: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-facts">Facts</Label>
              <Textarea
                id="edit-facts"
                value={briefForm.facts}
                onChange={(e) => setBriefForm({...briefForm, facts: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-issue">Issue</Label>
              <Textarea
                id="edit-issue"
                value={briefForm.issue}
                onChange={(e) => setBriefForm({...briefForm, issue: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-holding">Holding</Label>
              <Textarea
                id="edit-holding"
                value={briefForm.holding}
                onChange={(e) => setBriefForm({...briefForm, holding: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-rule">Rule of Law</Label>
              <Textarea
                id="edit-rule"
                value={briefForm.rule}
                onChange={(e) => setBriefForm({...briefForm, rule: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-reasoning">Reasoning</Label>
              <Textarea
                id="edit-reasoning"
                value={briefForm.reasoning}
                onChange={(e) => setBriefForm({...briefForm, reasoning: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-analysis">Analysis</Label>
              <Textarea
                id="edit-analysis"
                value={briefForm.analysis}
                onChange={(e) => setBriefForm({...briefForm, analysis: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={briefForm.notes}
                onChange={(e) => setBriefForm({...briefForm, notes: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBrief}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this case brief? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBrief && (
            <div className="py-4">
              <p className="font-medium">{selectedBrief.title}</p>
              <p className="text-sm text-muted-foreground">{selectedBrief.citation}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBrief}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Brief
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseBriefPage;
