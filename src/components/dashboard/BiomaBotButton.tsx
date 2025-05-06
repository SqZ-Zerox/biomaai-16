
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const BiomaBotButton: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, you would process the message here
      console.log("Sending message to Bioma Bot:", message);
      // Then redirect to the chat page with the message
      navigate("/chat", { state: { initialMessage: message } });
      setMessage("");
      setIsOpen(false);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.5 
          }}
        >
          <Button 
            onClick={toggleChat}
            className={`rounded-full w-16 h-16 shadow-lg ${
              isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            }`}
            aria-label={isOpen ? "Close Bioma Bot" : "Open Bioma Bot"}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Chat popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-xl border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Bioma Bot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask me anything about your health, nutrition, or fitness. How can I help you today?
                </p>
                <form onSubmit={handleSubmit}>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your question here..."
                    className="min-h-24"
                  />
                </form>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/chat")}
                >
                  Full Chat
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                >
                  Send Question
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BiomaBotButton;
