
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Circle, Info, Loader2 } from "lucide-react";

type QuestionType = "mcq" | "short" | "essay";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  completed: boolean;
  userAnswer?: string | number;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "mcq",
    question: "Which of the following is NOT an element of negligence?",
    options: [
      "Duty of care",
      "Breach of duty",
      "Causation",
      "Intentional conduct"
    ],
    correctAnswer: 3,
    explanation: "The four elements of negligence are duty of care, breach of duty, causation, and damages. Intentional conduct is not an element of negligence, but rather relates to intentional torts.",
    completed: false
  },
  {
    id: "q2",
    type: "mcq",
    question: "Under which legal principle are courts obligated to follow previous judicial decisions?",
    options: [
      "Stare decisis",
      "Res judicata",
      "Mens rea",
      "Habeas corpus"
    ],
    correctAnswer: 0,
    explanation: "Stare decisis is the principle that obligates courts to follow historical cases when making a ruling on a similar case.",
    completed: false
  },
  {
    id: "q3",
    type: "short",
    question: "Define the concept of 'consideration' in contract law.",
    correctAnswer: "Something of value exchanged between parties to create a legally binding contract",
    explanation: "Consideration refers to something of value given by both parties to a contract that induces them to enter into the agreement. It can be money, goods, services, or a promise to do or not do something.",
    completed: false
  },
  {
    id: "q4",
    type: "essay",
    question: "Analyze the role of judicial review in the United States legal system, citing relevant case law.",
    correctAnswer: "",
    explanation: "This essay should discuss the power of courts to examine and potentially invalidate laws and government actions that violate the Constitution, starting with Marbury v. Madison (1803).",
    completed: false
  }
];

const StudyPage = () => {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [activeTab, setActiveTab] = useState<QuestionType>("mcq");
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});

  const filteredQuestions = questions.filter(q => q.type === activeTab);
  const completedCount = questions.filter(q => q.completed).length;

  const handleAnswerSubmit = (questionId: string) => {
    setSubmittingId(questionId);
    
    // Simulate API call
    setTimeout(() => {
      setQuestions(prev => 
        prev.map(q => q.id === questionId ? { ...q, completed: true, userAnswer: userAnswers[questionId] } : q)
      );
      setShowExplanation(questionId);
      setSubmittingId(null);
    }, 1000);
  };

  const handleMCQChange = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleShortAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleGenerateMore = () => {
    // This would connect to the AI generation in a full implementation
    // For now, we'll just show a toast notification
    alert("In the full app, this would generate more questions based on your study materials!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-accent">Practice</span> Questions
        </h1>
        <p className="text-muted-foreground mt-1">
          Test your knowledge with AI-generated questions
        </p>
      </div>
      
      <div className="bg-muted/10 py-3 px-4 rounded-lg border border-border/40 flex justify-between items-center backdrop-blur-sm">
        <div>
          <span className="text-sm text-muted-foreground">Progress</span>
          <p className="font-medium">{completedCount} of {questions.length} completed</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGenerateMore}
          className="border-primary/40 text-primary hover:text-primary-foreground hover:bg-primary/80"
        >
          Generate More
        </Button>
      </div>

      <Tabs 
        defaultValue="mcq" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as QuestionType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted/20 p-1">
          <TabsTrigger value="mcq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Multiple Choice
          </TabsTrigger>
          <TabsTrigger value="short" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Short Answer
          </TabsTrigger>
          <TabsTrigger value="essay" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Essay
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <Card 
                key={question.id} 
                className={cn(
                  "glass-card border-border/40",
                  question.completed ? "border-primary/20 bg-primary/5" : ""
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">
                      {question.question}
                    </CardTitle>
                    {question.completed && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {question.type === "mcq" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "flex items-center space-x-2 p-2 rounded-md transition-colors cursor-pointer",
                            userAnswers[question.id] === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/20',
                            question.completed && question.correctAnswer === index ? 'bg-green-500/10 border border-green-500/20' : '',
                            question.completed && userAnswers[question.id] === index && question.correctAnswer !== index ? 'bg-red-500/10 border border-red-500/20' : ''
                          )}
                          onClick={() => !question.completed && handleMCQChange(question.id, index)}
                        >
                          {userAnswers[question.id] === index ? (
                            <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === "short" && (
                    <textarea 
                      className="w-full p-2 border border-border/40 bg-background rounded-md h-24" 
                      placeholder="Write your answer here..."
                      disabled={question.completed}
                      value={userAnswers[question.id] as string || ''}
                      onChange={(e) => handleShortAnswerChange(question.id, e.target.value)}
                    ></textarea>
                  )}
                  
                  {question.type === "essay" && (
                    <textarea 
                      className="w-full p-2 border border-border/40 bg-background rounded-md h-36" 
                      placeholder="Write your essay here..."
                      disabled={question.completed}
                      value={userAnswers[question.id] as string || ''}
                      onChange={(e) => handleShortAnswerChange(question.id, e.target.value)}
                    ></textarea>
                  )}
                  
                  {showExplanation === question.id && question.explanation && (
                    <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-md">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">Explanation</p>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="justify-between">
                  {!question.completed ? (
                    <Button
                      onClick={() => handleAnswerSubmit(question.id)}
                      disabled={submittingId === question.id || userAnswers[question.id] === undefined}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {submittingId === question.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking
                        </>
                      ) : (
                        "Submit Answer"
                      )}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowExplanation(showExplanation === question.id ? null : question.id)}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      {showExplanation === question.id ? "Hide Explanation" : "Show Explanation"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 px-6 border border-dashed border-border/40 rounded-lg bg-muted/5">
              <p className="text-muted-foreground">No questions available for this type yet.</p>
              <Button className="mt-4 bg-primary hover:bg-primary/90" onClick={handleGenerateMore}>
                Generate Questions
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyPage;
