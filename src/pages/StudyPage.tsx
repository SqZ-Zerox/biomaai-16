
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, HelpCircle, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const StudyPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showingQuestion, setShowingQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Mock categories
  const categories = [
    { id: "constitutional", name: "Constitutional Law", count: 24 },
    { id: "criminal", name: "Criminal Law", count: 18 },
    { id: "contract", name: "Contract Law", count: 15 },
    { id: "tort", name: "Tort Law", count: 12 },
    { id: "property", name: "Property Law", count: 9 },
  ];

  // Mock questions
  const questions = [
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
      explanation: "The First Amendment protects freedom of speech, religion, press, assembly, and petition, but does not protect speech that is intended to incite imminent lawless action."
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
      explanation: "Stare decisis is Latin for 'to stand by things decided.' It requires courts to follow precedents established by higher courts in the same jurisdiction."
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowingQuestion(true);
  };

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(answer);
    }
  };

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Reset to first question when we reach the end
      setCurrentQuestionIndex(0);
    }
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  const handleBackToCategories = () => {
    setShowingQuestion(false);
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Study Questions</h1>
      
      {!showingQuestion ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Select a category to study:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="cursor-pointer transition-all hover:-translate-y-1 border-border/40 bg-card/60 backdrop-blur-sm"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-accent mr-2" />
                        <span>{category.count} questions</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Button
            variant="outline"
            className="mb-6"
            onClick={handleBackToCategories}
          >
            ← Back to Categories
          </Button>
          
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Question {currentQuestionIndex + 1}/{questions.length}</CardTitle>
                <span className="text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </div>
              <CardDescription className="text-lg font-medium pt-2">
                {currentQuestion.question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center p-3 rounded-md cursor-pointer border",
                    selectedAnswer === option 
                      ? "border-primary bg-primary/10" 
                      : "border-border/40 hover:border-border",
                    isAnswerChecked && option === currentQuestion.correctAnswer
                      ? "bg-green-500/10 border-green-500"
                      : "",
                    isAnswerChecked && selectedAnswer === option && option !== currentQuestion.correctAnswer
                      ? "bg-red-500/10 border-red-500"
                      : ""
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="mr-3">
                    {isAnswerChecked ? (
                      option === currentQuestion.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : selectedAnswer === option ? (
                        <Circle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )
                    ) : (
                      selectedAnswer === option ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
              
              {isAnswerChecked && (
                <div className="mt-4 p-4 bg-muted/20 rounded-md border border-border/40">
                  <h4 className="font-medium flex items-center mb-2">
                    <HelpCircle className="h-4 w-4 mr-2 text-accent" />
                    Explanation
                  </h4>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerChecked ? (
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="w-full neon-glow"
                >
                  Check Answer
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  className="w-full"
                >
                  Next Question
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudyPage;
