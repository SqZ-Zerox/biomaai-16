import React, { useState, useEffect, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Library, 
  PlusCircle, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  ArrowLeftCircle, 
  ArrowRightCircle,
  SquareStack,
  Shuffle,
  RotateCcw,
  FileQuestion,
  FileCheck,
  Shield,
  Brain,
  Clock,
  Globe,
  FileText
} from "lucide-react";
import { 
  FlashcardDeck, 
  Flashcard, 
  FlashcardCategory, 
  getDecks, 
  getDeck, 
  addCard, 
  createDeck, 
  updateDeck, 
  deleteDeck,
  updateCard, 
  deleteCard,
  initializeFlashcards
} from "@/services/flashcardService";

const FlashcardsPage: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isCreateDeckDialogOpen, setIsCreateDeckDialogOpen] = useState(false);
  const [isEditDeckDialogOpen, setIsEditDeckDialogOpen] = useState(false);
  const [isDeleteDeckDialogOpen, setIsDeleteDeckDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false);
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false);
  const [deckForm, setDeckForm] = useState({ name: "", description: "" });
  const [cardForm, setCardForm] = useState<{
    front: string;
    back: string;
    category: FlashcardCategory;
  }>({
    front: "",
    back: "",
    category: "other"
  });
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [studyProgress, setStudyProgress] = useState(0);
  const [reviewedCards, setReviewedCards] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [filterCategory, setFilterCategory] = useState<FlashcardCategory | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'category' | 'confidence'>('alphabetical');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeFlashcards();
    loadDecks();
  }, []);

  const loadDecks = () => {
    const allDecks = getDecks();
    setDecks(allDecks);
    
    if (allDecks.length > 0 && !selectedDeck) {
      handleSelectDeck(allDecks[0].id);
    }
  };

  const handleSelectDeck = (deckId: string) => {
    const deck = getDeck(deckId);
    if (deck) {
      setSelectedDeck(deck);
    }
  };

  const handleCreateDeck = () => {
    if (!deckForm.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the deck",
        variant: "destructive"
      });
      return;
    }
    
    const newDeck = createDeck(deckForm.name, deckForm.description);
    setDecks([...decks, newDeck]);
    setSelectedDeck(newDeck);
    setIsCreateDeckDialogOpen(false);
    resetDeckForm();
    
    toast({
      title: "Deck Created",
      description: `"${deckForm.name}" deck has been created`
    });
  };

  const handleEditDeck = () => {
    if (!selectedDeck) return;
    
    if (!deckForm.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the deck",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDeck = updateDeck(selectedDeck.id, deckForm.name, deckForm.description);
    if (updatedDeck) {
      setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
      setSelectedDeck(updatedDeck);
      setIsEditDeckDialogOpen(false);
      
      toast({
        title: "Deck Updated",
        description: `"${updatedDeck.name}" deck has been updated`
      });
    }
  };

  const handleDeleteDeck = () => {
    if (!selectedDeck) return;
    
    const success = deleteDeck(selectedDeck.id);
    if (success) {
      const updatedDecks = decks.filter(deck => deck.id !== selectedDeck.id);
      setDecks(updatedDecks);
      setSelectedDeck(updatedDecks.length > 0 ? updatedDecks[0] : null);
      setIsDeleteDeckDialogOpen(false);
      
      toast({
        title: "Deck Deleted",
        description: `"${selectedDeck.name}" deck has been deleted`
      });
    }
  };

  const handleOpenEditDeckDialog = () => {
    if (selectedDeck) {
      setDeckForm({
        name: selectedDeck.name,
        description: selectedDeck.description
      });
      setIsEditDeckDialogOpen(true);
    }
  };

  const handleAddCard = () => {
    if (!selectedDeck) return;
    
    if (!cardForm.front.trim() || !cardForm.back.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both sides of the flashcard",
        variant: "destructive"
      });
      return;
    }
    
    const newCard = addCard(selectedDeck.id, cardForm);
    if (newCard) {
      const updatedDeck = getDeck(selectedDeck.id);
      if (updatedDeck) {
        setSelectedDeck(updatedDeck);
        setIsAddCardDialogOpen(false);
        resetCardForm();
        
        toast({
          title: "Card Added",
          description: "New flashcard has been added to the deck"
        });
      }
    }
  };

  const handleEditCard = () => {
    if (!selectedDeck || !editingCard) return;
    
    if (!cardForm.front.trim() || !cardForm.back.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both sides of the flashcard",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCard = updateCard(selectedDeck.id, editingCard.id, cardForm);
    if (updatedCard) {
      const updatedDeck = getDeck(selectedDeck.id);
      if (updatedDeck) {
        setSelectedDeck(updatedDeck);
        setIsEditCardDialogOpen(false);
        
        toast({
          title: "Card Updated",
          description: "Flashcard has been updated"
        });
      }
    }
  };

  const handleDeleteCard = () => {
    if (!selectedDeck || !editingCard) return;
    
    const success = deleteCard(selectedDeck.id, editingCard.id);
    if (success) {
      const updatedDeck = getDeck(selectedDeck.id);
      if (updatedDeck) {
        setSelectedDeck(updatedDeck);
        setIsDeleteCardDialogOpen(false);
        
        toast({
          title: "Card Deleted",
          description: "Flashcard has been deleted from the deck"
        });
      }
    }
  };

  const handleOpenEditCardDialog = (card: Flashcard) => {
    setEditingCard(card);
    setCardForm({
      front: card.front,
      back: card.back,
      category: card.category
    });
    setIsEditCardDialogOpen(true);
  };

  const resetDeckForm = () => {
    setDeckForm({ name: "", description: "" });
  };

  const resetCardForm = () => {
    setCardForm({ front: "", back: "", category: "other" });
    setEditingCard(null);
  };

  const startStudyMode = () => {
    if (!selectedDeck || selectedDeck.cards.length === 0) {
      toast({
        title: "Cannot Start Study Session",
        description: "This deck has no cards to study",
        variant: "destructive"
      });
      return;
    }
    
    let cardsToStudy = [...selectedDeck.cards];
    if (filterCategory !== 'all') {
      cardsToStudy = cardsToStudy.filter(card => card.category === filterCategory);
      
      if (cardsToStudy.length === 0) {
        toast({
          title: "No Cards to Study",
          description: `There are no cards in the "${filterCategory}" category`,
          variant: "destructive"
        });
        return;
      }
    }
    
    const shuffledCards = [...cardsToStudy].sort(() => Math.random() - 0.5);
    
    setStudyCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setStudyProgress(0);
    setReviewedCards({});
    setIsStudyMode(true);
    
    if (selectedDeck) {
      updateDeck(selectedDeck.id, selectedDeck.name, selectedDeck.description);
    }
  };

  const endStudyMode = () => {
    setIsStudyMode(false);
    
    const correctCount = Object.values(reviewedCards).filter(result => result === 'correct').length;
    const totalCount = Object.values(reviewedCards).length;
    
    if (totalCount > 0) {
      toast({
        title: "Study Session Complete",
        description: `You got ${correctCount} out of ${totalCount} cards correct (${Math.round(correctCount / totalCount * 100)}%)`,
      });
      
      if (selectedDeck) {
        Object.entries(reviewedCards).forEach(([cardId, result]) => {
          const card = selectedDeck.cards.find(c => c.id === cardId);
          if (card) {
            let newConfidence: 'low' | 'medium' | 'high';
            
            if (result === 'correct') {
              newConfidence = card.confidence === 'low' ? 'medium' : 'high';
            } else {
              newConfidence = card.confidence === 'high' ? 'medium' : 'low';
            }
            
            updateCard(selectedDeck.id, cardId, { 
              confidence: newConfidence,
              lastReviewed: new Date().toISOString()
            });
          }
        });
        
        const updatedDeck = getDeck(selectedDeck.id);
        if (updatedDeck) {
          setSelectedDeck(updatedDeck);
        }
      }
    }
  };

  const flipCard = () => {
    if (cardRef.current) {
      cardRef.current.classList.add('flipping');
      setTimeout(() => {
        setIsCardFlipped(!isCardFlipped);
        if (cardRef.current) {
          cardRef.current.classList.remove('flipping');
        }
      }, 150);
    } else {
      setIsCardFlipped(!isCardFlipped);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsCardFlipped(false);
      setStudyProgress(Math.round(((currentCardIndex + 1) / studyCards.length) * 100));
    } else {
      endStudyMode();
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsCardFlipped(false);
    }
  };

  const markCard = (result: 'correct' | 'incorrect') => {
    const currentCard = studyCards[currentCardIndex];
    setReviewedCards(prev => ({
      ...prev,
      [currentCard.id]: result
    }));
    
    nextCard();
  };

  const getCategoryStyle = (category: FlashcardCategory) => {
    const styles: Record<FlashcardCategory, string> = {
      'torts': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      'contracts': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      'criminal': 'bg-red-500/20 text-red-500 border-red-500/30', 
      'constitutional': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      'property': 'bg-green-500/20 text-green-500 border-green-500/30',
      'civil-procedure': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      'evidence': 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
      'ethics': 'bg-pink-500/20 text-pink-500 border-pink-500/30',
      'international': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
      'other': 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    };
    
    return styles[category] || styles.other;
  };

  const getConfidenceStyle = (confidence: 'low' | 'medium' | 'high') => {
    const styles = {
      'low': 'bg-red-500/20 text-red-500 border-red-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      'high': 'bg-green-500/20 text-green-500 border-green-500/30'
    };
    
    return styles[confidence];
  };

  const getCategoryIcon = (category: FlashcardCategory) => {
    const icons: Record<FlashcardCategory, React.ReactNode> = {
      'torts': <Shield className="h-3 w-3" />,
      'contracts': <FileCheck className="h-3 w-3" />,
      'criminal': <FileQuestion className="h-3 w-3" />,
      'constitutional': <Brain className="h-3 w-3" />,
      'property': <SquareStack className="h-3 w-3" />,
      'civil-procedure': <Clock className="h-3 w-3" />,
      'evidence': <Library className="h-3 w-3" />,
      'ethics': <CheckCircle className="h-3 w-3" />,
      'international': <Globe className="h-3 w-3" />,
      'other': <MoreHorizontal className="h-3 w-3" />
    };
    
    return icons[category] || icons.other;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filterCards = () => {
    if (!selectedDeck) return [];
    
    let filteredCards = [...selectedDeck.cards];
    
    if (filterCategory !== 'all') {
      filteredCards = filteredCards.filter(card => card.category === filterCategory);
    }
    
    switch (sortOrder) {
      case 'alphabetical':
        return filteredCards.sort((a, b) => a.front.localeCompare(b.front));
      case 'category':
        return filteredCards.sort((a, b) => a.category.localeCompare(b.category));
      case 'confidence':
        return filteredCards.sort((a, b) => {
          const confidenceOrder = { 'low': 0, 'medium': 1, 'high': 2 };
          return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
        });
      default:
        return filteredCards;
    }
  };

  return (
    <div className="space-y-6">
      {isStudyMode && selectedDeck && studyCards.length > 0 ? (
        <div className="h-[calc(100vh-16rem)]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Button variant="outline" onClick={endStudyMode}>
                Exit Study Mode
              </Button>
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-medium">{selectedDeck.name}</h2>
              <p className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {studyCards.length}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setStudyCards(prev => [...prev].sort(() => Math.random() - 0.5))}>
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentCardIndex(0)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Progress value={studyProgress} className="mb-6" />
          
          <div 
            ref={cardRef}
            className={`relative mx-auto h-[calc(100%-10rem)] max-w-2xl cursor-pointer transition-all duration-150`}
            onClick={flipCard}
          >
            <div className={`absolute inset-0 rounded-xl p-6 flex flex-col justify-between border-2 shadow-lg ${isCardFlipped ? 'opacity-0 rotate-y-180 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex justify-between items-start">
                <Badge variant="outline" className={getCategoryStyle(studyCards[currentCardIndex].category)}>
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(studyCards[currentCardIndex].category)}
                    {studyCards[currentCardIndex].category.charAt(0).toUpperCase() + studyCards[currentCardIndex].category.slice(1).replace('-', ' ')}
                  </span>
                </Badge>
                
                <Badge variant="outline" className={getConfidenceStyle(studyCards[currentCardIndex].confidence)}>
                  {studyCards[currentCardIndex].confidence.charAt(0).toUpperCase() + studyCards[currentCardIndex].confidence.slice(1)} confidence
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold">{studyCards[currentCardIndex].front}</h3>
              </div>
              
              <div className="flex justify-center text-sm text-muted-foreground">
                Click to flip
              </div>
            </div>
            
            <div className={`absolute inset-0 rounded-xl p-6 flex flex-col justify-between border-2 shadow-lg bg-card transition-all duration-150 ${isCardFlipped ? 'opacity-100' : 'opacity-0 rotate-y-180 pointer-events-none'}`}>
              <div className="flex justify-between items-start">
                <Badge variant="outline" className={getCategoryStyle(studyCards[currentCardIndex].category)}>
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(studyCards[currentCardIndex].category)}
                    {studyCards[currentCardIndex].category.charAt(0).toUpperCase() + studyCards[currentCardIndex].category.slice(1).replace('-', ' ')}
                  </span>
                </Badge>
                
                <Badge variant="outline" className={getConfidenceStyle(studyCards[currentCardIndex].confidence)}>
                  {studyCards[currentCardIndex].confidence.charAt(0).toUpperCase() + studyCards[currentCardIndex].confidence.slice(1)} confidence
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <p className="text-xl whitespace-pre-line">{studyCards[currentCardIndex].back}</p>
              </div>
              
              <div className="flex justify-center text-sm text-muted-foreground">
                Click to flip
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline" 
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="flex items-center"
            >
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="destructive" 
                onClick={() => markCard('incorrect')}
                className="flex items-center"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Incorrect
              </Button>
              <Button 
                variant="default" 
                onClick={() => markCard('correct')}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Correct
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={nextCard}
              className="flex items-center"
            >
              {currentCardIndex === studyCards.length - 1 ? (
                <>
                  Finish
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRightCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
              <p className="text-muted-foreground mt-1">Create and study flashcards to memorize key legal concepts</p>
            </div>
            
            <Dialog open={isCreateDeckDialogOpen} onOpenChange={setIsCreateDeckDialogOpen}>
              <Button onClick={() => setIsCreateDeckDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Deck
              </Button>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Deck</DialogTitle>
                  <DialogDescription>
                    Create a new flashcard deck to organize your study materials.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Deck Name</Label>
                    <Input
                      id="name"
                      value={deckForm.name}
                      onChange={(e) => setDeckForm({ ...deckForm, name: e.target.value })}
                      placeholder="e.g., Constitutional Law"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={deckForm.description}
                      onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
                      placeholder="e.g., Key concepts from Constitutional Law course"
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDeckDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDeck}>Create Deck</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Flashcard Decks</CardTitle>
                <CardDescription>
                  {decks.length === 0
                    ? "Create your first deck to get started"
                    : `${decks.length} deck${decks.length === 1 ? "" : "s"} available`
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {decks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Library className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No flashcard decks</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Create your first flashcard deck to get started.
                    </p>
                    <Button onClick={() => setIsCreateDeckDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create First Deck
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-25rem)]">
                    <div className="space-y-3">
                      {decks.map((deck) => (
                        <div 
                          key={deck.id}
                          className={`p-3 rounded-md border cursor-pointer transition-all ${
                            selectedDeck?.id === deck.id
                              ? "border-primary bg-primary/10"
                              : "border-border/40 hover:border-primary/50 hover:bg-muted/50"
                          }`}
                          onClick={() => handleSelectDeck(deck.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{deck.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                              </p>
                              {deck.lastStudied && (
                                <p className="text-xs text-muted-foreground">
                                  Last studied: {formatDate(deck.lastStudied)}
                                </p>
                              )}
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectDeck(deck.id);
                                  handleOpenEditDeckDialog();
                                }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Deck
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectDeck(deck.id);
                                  setIsDeleteDeckDialogOpen(true);
                                }}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Deck
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm">
              {selectedDeck ? (
                <>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>{selectedDeck.name}</CardTitle>
                      <CardDescription className="mt-1.5">
                        {selectedDeck.description}
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={startStudyMode}>
                        Study Deck
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleOpenEditDeckDialog}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Deck
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setIsDeleteDeckDialogOpen(true)}
                            className="text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Deck
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            resetCardForm();
                            setIsAddCardDialogOpen(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Card
                        </Button>
                        
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Flashcard</DialogTitle>
                            <DialogDescription>
                              Add a new flashcard to "{selectedDeck.name}".
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="front">Front (Question)</Label>
                              <Textarea
                                id="front"
                                value={cardForm.front}
                                onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                                placeholder="e.g., What are the elements of negligence?"
                                rows={3}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="back">Back (Answer)</Label>
                              <Textarea
                                id="back"
                                value={cardForm.back}
                                onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                                placeholder="e.g., 1. Duty of care\n2. Breach of duty\n3. Causation\n4. Damages"
                                rows={4}
                              />
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Select 
                                value={cardForm.category} 
                                onValueChange={(value) => setCardForm({...cardForm, category: value as FlashcardCategory})}
                              >
                                <SelectTrigger id="category">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="torts">Torts</SelectItem>
                                  <SelectItem value="contracts">Contracts</SelectItem>
                                  <SelectItem value="criminal">Criminal Law</SelectItem>
                                  <SelectItem value="constitutional">Constitutional Law</SelectItem>
                                  <SelectItem value="property">Property</SelectItem>
                                  <SelectItem value="civil-procedure">Civil Procedure</SelectItem>
                                  <SelectItem value="evidence">Evidence</SelectItem>
                                  <SelectItem value="ethics">Legal Ethics</SelectItem>
                                  <SelectItem value="international">International Law</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddCard}>Add Card</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Select 
                        value={filterCategory} 
                        onValueChange={(value) => setFilterCategory(value as FlashcardCategory | 'all')}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="torts">Torts</SelectItem>
                          <SelectItem value="contracts">Contracts</SelectItem>
                          <SelectItem value="criminal">Criminal Law</SelectItem>
                          <SelectItem value="constitutional">Constitutional Law</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                          <SelectItem value="civil-procedure">Civil Procedure</SelectItem>
                          <SelectItem value="evidence">Evidence</SelectItem>
                          <SelectItem value="ethics">Legal Ethics</SelectItem>
                          <SelectItem value="international">International Law</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={sortOrder} 
                        onValueChange={(value) => setSortOrder(value as 'alphabetical' | 'category' | 'confidence')}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alphabetical">Alphabetical</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="confidence">Confidence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedDeck.cards.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          Add your first flashcard to this deck.
                        </p>
                        <Button onClick={() => setIsAddCardDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add First Card
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        <ScrollArea className="h-[calc(100vh-24rem)]">
                          {filterCards().length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">
                                No cards match the selected filter.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {filterCards().map((card) => (
                                <div 
                                  key={card.id}
                                  className="p-4 rounded-md border border-border/40 bg-muted/10"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                      <Badge variant="outline" className={getCategoryStyle(card.category)}>
                                        <span className="flex items-center gap-1">
                                          {getCategoryIcon(card.category)}
                                          {card.category.charAt(0).toUpperCase() + card.category.slice(1).replace('-', ' ')}
                                        </span>
                                      </Badge>
                                      
                                      <Badge variant="outline" className={getConfidenceStyle(card.confidence)}>
                                        {card.confidence.charAt(0).toUpperCase() + card.confidence.slice(1)}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => handleOpenEditCardDialog(card)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => {
                                          setEditingCard(card);
                                          setIsDeleteCardDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Front:</h4>
                                      <p className="text-sm whitespace-pre-line">{card.front}</p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">Back:</h4>
                                      <p className="text-sm whitespace-pre-line">{card.back}</p>
                                    </div>
                                  </div>
                                  
                                  {card.lastReviewed && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Last reviewed: {formatDate(card.lastReviewed)}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Library className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">No Deck Selected</h3>
                  <p className="text-muted-foreground text-sm max-w-md mb-6">
                    Select a deck from the list on the left or create a new deck to get started.
                  </p>
                  <Button onClick={() => setIsCreateDeckDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Deck
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>
          
          <Dialog open={isEditDeckDialogOpen} onOpenChange={setIsEditDeckDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Deck</DialogTitle>
                <DialogDescription>
                  Update the details for your flashcard deck.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Deck Name</Label>
                  <Input
                    id="edit-name"
                    value={deckForm.name}
                    onChange={(e) => setDeckForm({ ...deckForm, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={deckForm.description}
                    onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDeckDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDeck}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDeleteDeckDialogOpen} onOpenChange={setIsDeleteDeckDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this deck? All flashcards in this deck will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              
              {selectedDeck && (
                <div className="py-4">
                  <p className="font-medium">{selectedDeck.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDeck.cards.length} cards</p>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDeckDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteDeck}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Deck
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditCardDialogOpen} onOpenChange={setIsEditCardDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Flashcard</DialogTitle>
                <DialogDescription>
                  Update this flashcard.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-front">Front (Question)</Label>
                  <Textarea
                    id="edit-front"
                    value={cardForm.front}
                    onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-back">Back (Answer)</Label>
                  <Textarea
                    id="edit-back"
                    value={cardForm.back}
                    onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={cardForm.category} 
                    onValueChange={(value) => setCardForm({...cardForm, category: value as FlashcardCategory})}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="torts">Torts</SelectItem>
                      <SelectItem value="contracts">Contracts</SelectItem>
                      <SelectItem value="criminal">Criminal Law</SelectItem>
                      <SelectItem value="constitutional">Constitutional Law</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="civil-procedure">Civil Procedure</SelectItem>
                      <SelectItem value="evidence">Evidence</SelectItem>
                      <SelectItem value="ethics">Legal Ethics</SelectItem>
                      <SelectItem value="international">International Law</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditCardDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCard}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDeleteCardDialogOpen} onOpenChange={setIsDeleteCardDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this flashcard?
                </DialogDescription>
              </DialogHeader>
              
              {editingCard && (
                <div className="py-4">
                  <p className="font-medium">Front: {editingCard.front}</p>
                  <p className="text-sm text-muted-foreground mt-2">Back: {editingCard.back}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteCardDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCard}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default FlashcardsPage;
