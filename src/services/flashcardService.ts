
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: FlashcardCategory;
  lastReviewed?: string;
  confidence: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type FlashcardCategory = 
  | 'torts' 
  | 'contracts' 
  | 'criminal' 
  | 'constitutional' 
  | 'property' 
  | 'civil-procedure' 
  | 'evidence' 
  | 'ethics' 
  | 'international' 
  | 'other';

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: string;
  lastStudied?: string;
}

// Manage decks
export const getDecks = (): FlashcardDeck[] => {
  const decks = localStorage.getItem('flashcard-decks');
  return decks ? JSON.parse(decks) : [];
};

export const createDeck = (name: string, description: string): FlashcardDeck => {
  const decks = getDecks();
  const newDeck: FlashcardDeck = {
    id: Date.now().toString(),
    name,
    description,
    cards: [],
    createdAt: new Date().toISOString(),
  };
  
  decks.push(newDeck);
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  
  return newDeck;
};

export const getDeck = (id: string): FlashcardDeck | null => {
  const decks = getDecks();
  return decks.find(deck => deck.id === id) || null;
};

export const updateDeck = (deckId: string, name: string, description: string): FlashcardDeck | null => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return null;
  
  decks[deckIndex] = {
    ...decks[deckIndex],
    name,
    description
  };
  
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  return decks[deckIndex];
};

export const deleteDeck = (id: string): boolean => {
  const decks = getDecks();
  const updatedDecks = decks.filter(deck => deck.id !== id);
  
  if (updatedDecks.length === decks.length) return false;
  
  localStorage.setItem('flashcard-decks', JSON.stringify(updatedDecks));
  return true;
};

// Manage cards in decks
export const addCard = (deckId: string, card: Omit<Flashcard, 'id' | 'createdAt' | 'confidence'>): Flashcard | null => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return null;
  
  const newCard: Flashcard = {
    ...card,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    confidence: 'medium'
  };
  
  decks[deckIndex].cards.push(newCard);
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  
  return newCard;
};

export const updateCard = (deckId: string, cardId: string, updates: Partial<Flashcard>): Flashcard | null => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return null;
  
  const cardIndex = decks[deckIndex].cards.findIndex(card => card.id === cardId);
  
  if (cardIndex === -1) return null;
  
  decks[deckIndex].cards[cardIndex] = {
    ...decks[deckIndex].cards[cardIndex],
    ...updates
  };
  
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  return decks[deckIndex].cards[cardIndex];
};

export const deleteCard = (deckId: string, cardId: string): boolean => {
  const decks = getDecks();
  const deckIndex = decks.findIndex(deck => deck.id === deckId);
  
  if (deckIndex === -1) return false;
  
  const originalLength = decks[deckIndex].cards.length;
  decks[deckIndex].cards = decks[deckIndex].cards.filter(card => card.id !== cardId);
  
  if (decks[deckIndex].cards.length === originalLength) return false;
  
  localStorage.setItem('flashcard-decks', JSON.stringify(decks));
  return true;
};

// Initialize sample decks if none exist
export const initializeFlashcards = (): void => {
  const decks = getDecks();
  
  if (decks.length === 0) {
    const tortsCards: Omit<Flashcard, 'id' | 'createdAt' | 'confidence'>[] = [
      { 
        front: "What are the elements of negligence?", 
        back: "1. Duty of care\n2. Breach of duty\n3. Causation (actual and proximate)\n4. Damages", 
        category: "torts" 
      },
      { 
        front: "What is the difference between contributory and comparative negligence?", 
        back: "Contributory negligence is a complete defense where plaintiff's own negligence contributed to the injury. Comparative negligence reduces plaintiff's recovery in proportion to their own fault.", 
        category: "torts" 
      },
      { 
        front: "Define strict liability", 
        back: "Liability imposed without fault. Applies to abnormally dangerous activities, defective products, and keeping wild animals.", 
        category: "torts" 
      }
    ];
    
    const contractsCards: Omit<Flashcard, 'id' | 'createdAt' | 'confidence'>[] = [
      { 
        front: "What are the elements of a valid contract?", 
        back: "1. Offer\n2. Acceptance\n3. Consideration\n4. Legal capacity\n5. Legal purpose", 
        category: "contracts" 
      },
      { 
        front: "What is the parol evidence rule?", 
        back: "The parol evidence rule prevents parties from using extrinsic evidence to contradict, vary, or add to the terms of a complete written contract.", 
        category: "contracts" 
      }
    ];
    
    const constCards: Omit<Flashcard, 'id' | 'createdAt' | 'confidence'>[] = [
      { 
        front: "What is the Commerce Clause?", 
        back: "Article I, Section 8, Clause 3 of the U.S. Constitution, which gives Congress the power to regulate commerce among the states, with foreign nations, and with Native American tribes.", 
        category: "constitutional" 
      },
      { 
        front: "What level of scrutiny applies to gender-based classifications?", 
        back: "Intermediate scrutiny: The classification must be substantially related to an important government objective.", 
        category: "constitutional" 
      }
    ];
    
    // Create sample decks
    const tortsDeck = createDeck(
      "Torts",
      "Key concepts in tort law including negligence, intentional torts, and strict liability"
    );
    
    const contractsDeck = createDeck(
      "Contracts",
      "Essential elements and concepts in contract law"
    );
    
    const constDeck = createDeck(
      "Constitutional Law",
      "Fundamental concepts in constitutional law and jurisprudence"
    );
    
    // Add cards to decks
    tortsCards.forEach(card => addCard(tortsDeck.id, card));
    contractsCards.forEach(card => addCard(contractsDeck.id, card));
    constCards.forEach(card => addCard(constDeck.id, card));
  }
};
