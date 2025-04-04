
import { AppError } from "@/lib/error";

// Types
export type QuestionCategory = {
  id: string;
  name: string;
  count: number;
}

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  categoryId: string;
}

export type StudyMaterial = {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'text';
  fileSize: string;
  uploadDate: Date;
}

export type StudyTask = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export type StudyEvent = {
  date: Date;
  title: string;
  description?: string;
  type: 'exam' | 'assignment' | 'class' | 'other';
}

// Mock data
const categories: QuestionCategory[] = [
  { id: "constitutional", name: "Constitutional Law", count: 24 },
  { id: "criminal", name: "Criminal Law", count: 18 },
  { id: "contract", name: "Contract Law", count: 15 },
  { id: "tort", name: "Tort Law", count: 12 },
  { id: "property", name: "Property Law", count: 9 },
];

const questions: Question[] = [
  {
    id: 1,
    question: "Which of the following is NOT protected by the First Amendment?",
    options: [
      "Political speech",
      "Religious expression",
      "Incitement to imminent lawless action",
      "Peaceful assembly"
    ],
    correctAnswer: "Incitement to imminent lawless action",
    explanation: "The First Amendment protects freedom of speech, religion, press, assembly, and petition, but does not protect speech that is intended to incite imminent lawless action.",
    categoryId: "constitutional"
  },
  {
    id: 2,
    question: "What does the doctrine of stare decisis require?",
    options: [
      "Courts must follow precedents established by higher courts",
      "All laws must be written in Latin",
      "Judges must be appointed, not elected",
      "Legal disputes must be resolved through mediation first"
    ],
    correctAnswer: "Courts must follow precedents established by higher courts",
    explanation: "Stare decisis is Latin for 'to stand by things decided.' It requires courts to follow precedents established by higher courts in the same jurisdiction.",
    categoryId: "constitutional"
  },
  {
    id: 3,
    question: "What element is required for a valid contract?",
    options: [
      "Written documentation",
      "Consideration",
      "At least three parties",
      "Notarization"
    ],
    correctAnswer: "Consideration",
    explanation: "Consideration, something of value exchanged by the parties, is a required element for a valid contract. Written documentation, notarization, and three parties are not always required.",
    categoryId: "contract"
  },
  {
    id: 4,
    question: "What is the primary purpose of tort law?",
    options: [
      "To punish criminals",
      "To compensate injured parties",
      "To enforce contracts",
      "To interpret the Constitution"
    ],
    correctAnswer: "To compensate injured parties",
    explanation: "Tort law is primarily concerned with providing remedies, usually in the form of monetary damages, to individuals who have suffered harm due to the wrongful acts of others.",
    categoryId: "tort"
  }
];

const studyMaterials: StudyMaterial[] = [
  {
    id: "mat1",
    title: "Constitutional Law Notes.pdf",
    type: "pdf",
    fileSize: "2.4 MB",
    uploadDate: new Date(2025, 2, 15)
  },
  {
    id: "mat2",
    title: "Contract Law Lecture 3.mp4",
    type: "video",
    fileSize: "45.7 MB",
    uploadDate: new Date(2025, 2, 10)
  },
  {
    id: "mat3",
    title: "Tort Law Case Studies.pdf",
    type: "pdf",
    fileSize: "3.8 MB",
    uploadDate: new Date(2025, 1, 28)
  }
];

const studyTasks: StudyTask[] = [
  { id: "task1", title: "Read Chapter 5: Constitutional Law", completed: false },
  { id: "task2", title: "Review case notes: Brown v. Board of Education", completed: true },
  { id: "task3", title: "Practice essay questions on Property Law", completed: false },
  { id: "task4", title: "Create flashcards for Legal Terms", completed: false },
  { id: "task5", title: "Watch lecture on Criminal Procedure", completed: true },
];

const studyEvents: StudyEvent[] = [
  { 
    date: new Date(2025, 3, 12), 
    title: "Constitutional Law Exam",
    type: "exam" 
  },
  { 
    date: new Date(2025, 3, 15), 
    title: "Property Law Assignment Due",
    type: "assignment" 
  },
  { 
    date: new Date(2025, 3, 20), 
    title: "Criminal Law Mock Trial",
    type: "other" 
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service functions with error handling
export const dataService = {
  // Categories
  getCategories: async (): Promise<QuestionCategory[]> => {
    try {
      await delay(800);
      return [...categories];
    } catch (error) {
      throw new AppError("Failed to fetch categories", 500);
    }
  },
  
  // Questions
  getQuestionsByCategory: async (categoryId: string): Promise<Question[]> => {
    try {
      await delay(1000);
      const filteredQuestions = questions.filter(q => q.categoryId === categoryId);
      
      if (filteredQuestions.length === 0) {
        throw new AppError(`No questions found for category: ${categoryId}`, 404);
      }
      
      return filteredQuestions;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to fetch questions", 500);
    }
  },
  
  // Study Materials
  getStudyMaterials: async (): Promise<StudyMaterial[]> => {
    try {
      await delay(600);
      return [...studyMaterials];
    } catch (error) {
      throw new AppError("Failed to fetch study materials", 500);
    }
  },
  
  uploadMaterial: async (file: File): Promise<StudyMaterial> => {
    try {
      await delay(1500); // Simulate upload time
      
      // Validation
      if (file.size > 100000000) { // 100MB
        throw new AppError("File too large", 400);
      }
      
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 
                       file.name.endsWith('.mp4') || file.name.endsWith('.mov') ? 'video' : 'text';
                       
      const newMaterial: StudyMaterial = {
        id: `mat${studyMaterials.length + 1}`,
        title: file.name,
        type: fileType as 'pdf' | 'video' | 'text',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date()
      };
      
      studyMaterials.push(newMaterial);
      return newMaterial;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to upload file", 500);
    }
  },
  
  // Study Tasks
  getTasks: async (): Promise<StudyTask[]> => {
    try {
      await delay(700);
      return [...studyTasks];
    } catch (error) {
      throw new AppError("Failed to fetch tasks", 500);
    }
  },
  
  toggleTaskCompletion: async (taskId: string): Promise<StudyTask> => {
    try {
      await delay(500);
      const task = studyTasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new AppError(`Task not found: ${taskId}`, 404);
      }
      
      task.completed = !task.completed;
      return {...task};
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update task", 500);
    }
  },
  
  // Study Events
  getEvents: async (): Promise<StudyEvent[]> => {
    try {
      await delay(800);
      return [...studyEvents];
    } catch (error) {
      throw new AppError("Failed to fetch events", 500);
    }
  }
};
