
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, HelpCircle, ArrowRight, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { dataService, QuestionCategory, Question } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

const StudyPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showingQuestion, setShowingQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const result = await dataService.getCategories();
        setCategories(result);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        setErrorMessage("Failed to load categories. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        });
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleCategorySelect = async (categoryId: string) => {
    try {
      setIsLoading(true);
      setSelectedCategory(categoryId);
      
      const fetchedQuestions = await dataService.getQuestionsByCategory(categoryId);
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setShowingQuestion(true);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setErrorMessage("Failed to load questions. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load questions for this category.",
        variant: "destructive",
      });
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerChecked) {
      setSelectedAnswer(answer);
    }
  };

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      toast({
        title: "Correct!",
        description: "Good job! You selected the correct answer.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Review the explanation to understand the correct answer.",
        variant: "default",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If we're at the last question, show completion message
      toast({
        title: "All Done!",
        description: "You've completed all questions in this category.",
        variant: "default",
      });
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

  const currentQuestion = questions[currentQuestionIndex];

  // Error state display
  if (isError && !showingQuestion) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Study Questions</h1>
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle>Error Loading Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{errorMessage}</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Loading state display
  if (isLoading && !showingQuestion) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Study Questions</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

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
                        <BookOpen className="h-5 w-5 text-primary mr-2" />
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          ) : isError ? (
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <CardTitle>Error Loading Questions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>{errorMessage}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleBackToCategories}
                  variant="outline"
                >
                  Back to Categories
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
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
                        <HelpCircle className="h-4 w-4 mr-2 text-primary" />
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyPage;
