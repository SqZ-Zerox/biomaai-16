
export interface CaseBrief {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: string;
  facts: string;
  issue: string;
  holding: string;
  reasoning: string;
  rule: string;
  analysis: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Get all briefs
export const getBriefs = (): CaseBrief[] => {
  try {
    const briefs = localStorage.getItem('case-briefs');
    return briefs ? JSON.parse(briefs) : [];
  } catch (error) {
    console.error("Error getting briefs:", error);
    return [];
  }
};

// Get a brief by ID
export const getBrief = (id: string): CaseBrief | null => {
  try {
    const briefs = getBriefs();
    return briefs.find((brief) => brief.id === id) || null;
  } catch (error) {
    console.error("Error getting brief:", error);
    return null;
  }
};

// Create a new brief
export const createBrief = (brief: Omit<CaseBrief, 'id' | 'createdAt' | 'updatedAt'>): CaseBrief => {
  try {
    const briefs = getBriefs();
    const timestamp = new Date().toISOString();
    
    const newBrief: CaseBrief = {
      ...brief,
      id: Date.now().toString(),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    briefs.push(newBrief);
    localStorage.setItem('case-briefs', JSON.stringify(briefs));
    
    return newBrief;
  } catch (error) {
    console.error("Error creating brief:", error);
    throw new Error("Failed to create brief");
  }
};

// Update an existing brief
export const updateBrief = (id: string, updates: Partial<CaseBrief>): CaseBrief | null => {
  try {
    const briefs = getBriefs();
    const index = briefs.findIndex((brief) => brief.id === id);
    
    if (index === -1) return null;
    
    const updatedBrief = {
      ...briefs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    briefs[index] = updatedBrief;
    localStorage.setItem('case-briefs', JSON.stringify(briefs));
    
    return updatedBrief;
  } catch (error) {
    console.error("Error updating brief:", error);
    return null;
  }
};

// Delete a brief
export const deleteBrief = (id: string): boolean => {
  try {
    const briefs = getBriefs();
    const filteredBriefs = briefs.filter((brief) => brief.id !== id);
    
    if (filteredBriefs.length === briefs.length) {
      return false;
    }
    
    localStorage.setItem('case-briefs', JSON.stringify(filteredBriefs));
    return true;
  } catch (error) {
    console.error("Error deleting brief:", error);
    return false;
  }
};

// Sample case brief templates
export const CASE_BRIEF_TEMPLATES = [
  {
    title: "Sample Tort Case Brief",
    citation: "497 U.S. 123 (1990)",
    court: "Supreme Court of the United States",
    year: "1990",
    facts: "The plaintiff was injured when the defendant's product malfunctioned during normal use. The plaintiff alleges that the defendant was negligent in the design and manufacture of the product.",
    issue: "Whether the defendant manufacturer is liable for injuries caused by its product under a theory of negligence.",
    holding: "The Court held that the manufacturer was liable for the plaintiff's injuries.",
    reasoning: "The Court found that the manufacturer had a duty to design and manufacture safe products, and that it breached this duty by failing to adequately test the product before placing it on the market.",
    rule: "A manufacturer has a duty to design and manufacture products that are reasonably safe for their intended use, and to test those products adequately before marketing them.",
    analysis: "This case reinforces the principle that manufacturers are responsible for ensuring the safety of their products. The decision expands product liability by emphasizing the duty to test products thoroughly.",
    notes: "Consider how this case relates to strict liability standards in other jurisdictions."
  },
  {
    title: "Sample Contract Case Brief",
    citation: "123 F.3d 456 (7th Cir. 1997)",
    court: "United States Court of Appeals for the Seventh Circuit",
    year: "1997",
    facts: "The plaintiff and defendant entered into a written contract for the sale of goods. The defendant failed to deliver the goods by the specified date, and the plaintiff sued for breach of contract.",
    issue: "Whether the time of delivery was an essential term of the contract such that the defendant's late delivery constituted a material breach.",
    holding: "The court held that time was of the essence in the contract, and the defendant's failure to deliver on time was a material breach.",
    reasoning: "The court found that the contract explicitly stated that 'time is of the essence,' and that the plaintiff had made it clear that timely delivery was crucial to their business operations.",
    rule: "When a contract specifies that time is of the essence, failure to perform by the specified time constitutes a material breach of contract.",
    analysis: "This case illustrates the importance of express terms regarding timing in contracts. The 'time is of the essence' clause was given full effect by the court.",
    notes: "Compare with cases where timing was not explicitly made essential in the contract."
  }
];
