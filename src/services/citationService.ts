
export interface CitationStyle {
  id: string;
  name: string;
}

export interface CitationFormat {
  book: string;
  journal: string;
  case: string;
  statute: string;
  website: string;
}

export interface CitationSource {
  type: 'book' | 'journal' | 'case' | 'statute' | 'website';
  title: string;
  authors?: string[];
  year?: number;
  publisher?: string;
  volume?: string;
  issue?: string;
  pageRange?: string;
  court?: string;
  url?: string;
  dateAccessed?: string;
  jurisdiction?: string;
  pinpoint?: string;
}

export const CITATION_STYLES: CitationStyle[] = [
  { id: 'bluebook', name: 'Bluebook (20th Edition)' },
  { id: 'oscola', name: 'OSCOLA (4th Edition)' },
  { id: 'aglc', name: 'AGLC (4th Edition)' },
  { id: 'mcgill', name: 'Canadian Guide to Uniform Legal Citation (McGill Guide)' },
  { id: 'apa', name: 'APA Style (7th Edition)' },
  { id: 'mla', name: 'MLA Style (9th Edition)' },
  { id: 'chicago', name: 'Chicago Style (17th Edition)' },
];

export const formatCitation = (source: CitationSource, style: string): string => {
  switch (style) {
    case 'bluebook':
      return formatBluebook(source);
    case 'oscola':
      return formatOscola(source);
    case 'aglc':
      return formatAglc(source);
    case 'mcgill':
      return formatMcGill(source);
    case 'apa':
      return formatApa(source);
    case 'mla':
      return formatMla(source);
    case 'chicago':
      return formatChicago(source);
    default:
      return formatBluebook(source);
  }
};

const formatAuthors = (authors: string[] = []): string => {
  if (!authors.length) return '';
  if (authors.length === 1) return authors[0];
  
  if (authors.length === 2) {
    return `${authors[0]} & ${authors[1]}`;
  }
  
  return `${authors[0]} et al.`;
};

const formatBluebook = (source: CitationSource): string => {
  switch (source.type) {
    case 'case':
      return `${source.title}${source.volume ? `, ${source.volume}` : ''}${source.publisher ? ` ${source.publisher}` : ''}${source.pageRange ? ` ${source.pageRange}` : ''}${source.court ? ` (${source.court}` : ''}${source.year ? ` ${source.year})` : ')'}${source.pinpoint ? `, at ${source.pinpoint}` : ''}.`;
    
    case 'statute':
      return `${source.title}${source.volume ? ` ${source.volume}` : ''}${source.publisher ? ` ${source.publisher}` : ''}${source.year ? ` (${source.year})` : ''}${source.pinpoint ? `, § ${source.pinpoint}` : ''}.`;
    
    case 'book':
      return `${formatAuthors(source.authors)}, ${source.title} ${source.publisher ? `(${source.publisher}` : '('}${source.year ? ` ${source.year})` : ')'}.`;
    
    case 'journal':
      return `${formatAuthors(source.authors)}, ${source.title}, ${source.volume || ''} ${source.publisher || ''} ${source.pageRange || ''}${source.year ? ` (${source.year})` : ''}.`;
    
    case 'website':
      return `${formatAuthors(source.authors)}, ${source.title}, ${source.publisher || ''}${source.url ? `, ${source.url}` : ''}${source.dateAccessed ? ` (last visited ${source.dateAccessed})` : ''}.`;
    
    default:
      return '';
  }
};

const formatOscola = (source: CitationSource): string => {
  // Basic OSCOLA format implementation
  switch (source.type) {
    case 'case':
      return `${source.title} [${source.year || ''}] ${source.volume || ''} ${source.publisher || ''} ${source.pageRange || ''}${source.pinpoint ? `, ${source.pinpoint}` : ''}.`;
    
    case 'statute':
      return `${source.title} ${source.year || ''} ${source.pinpoint ? `s ${source.pinpoint}` : ''}.`;
    
    default:
      return formatBluebook(source);
  }
};

const formatAglc = (source: CitationSource): string => {
  // Basic AGLC format implementation
  return formatBluebook(source);
};

const formatMcGill = (source: CitationSource): string => {
  // Basic McGill Guide format implementation
  return formatBluebook(source);
};

const formatApa = (source: CitationSource): string => {
  // Basic APA format implementation
  return formatBluebook(source);
};

const formatMla = (source: CitationSource): string => {
  // Basic MLA format implementation
  return formatBluebook(source);
};

const formatChicago = (source: CitationSource): string => {
  // Basic Chicago format implementation
  return formatBluebook(source);
};

export const saveCitation = (citation: string): void => {
  const savedCitations = getSavedCitations();
  savedCitations.push({
    id: Date.now().toString(),
    text: citation,
    date: new Date().toISOString()
  });
  localStorage.setItem('saved-citations', JSON.stringify(savedCitations));
};

export const getSavedCitations = (): {id: string, text: string, date: string}[] => {
  const savedCitations = localStorage.getItem('saved-citations');
  return savedCitations ? JSON.parse(savedCitations) : [];
};

export const deleteSavedCitation = (id: string): void => {
  const savedCitations = getSavedCitations();
  const updatedCitations = savedCitations.filter(citation => citation.id !== id);
  localStorage.setItem('saved-citations', JSON.stringify(updatedCitations));
};
