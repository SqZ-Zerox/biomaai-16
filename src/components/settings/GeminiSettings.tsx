
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setGeminiKey, hasGeminiKey, clearGeminiKey } from "@/services/geminiService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Bot } from "lucide-react";

const GeminiSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Check if API key is already set
    setIsConfigured(hasGeminiKey());
  }, []);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    
    // Save the API key
    setGeminiKey(apiKey.trim());
    setIsConfigured(true);
    setIsEditing(false);
    setApiKey(""); // Clear the input for security
  };
  
  const handleRemoveKey = () => {
    clearGeminiKey();
    setIsConfigured(false);
    setIsEditing(false);
    setApiKey("");
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setApiKey("");
  };
  
  return (
    <Card className="border-border/50 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-green-500" />
          Google Gemini API Configuration
        </CardTitle>
        <CardDescription>
          Configure your Gemini API key to enable enhanced AI features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isConfigured && !isEditing ? (
          <Alert variant="default" className="bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
            <AlertTitle>Gemini API Key Configured</AlertTitle>
            <AlertDescription>
              Your Google Gemini API key has been saved securely. You can now use enhanced AI features throughout the application.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {!isConfigured && (
              <Alert variant="default" className="mb-4 bg-blue-100 dark:bg-blue-900/20">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                <AlertTitle>API Key Required</AlertTitle>
                <AlertDescription>
                  Enter your Gemini API key to enable enhanced AI features. Your key is stored locally and never sent to our servers.
                  {/* Show default key information */}
                  <p className="mt-2 text-xs">
                    A default test API key is provided, but you may want to use your own for production.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="geminiApiKey" className="text-sm font-medium">
                  Gemini API Key
                </label>
                <Input
                  id="geminiApiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored securely in your browser's local storage.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isConfigured ? (
          <>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={toggleEdit}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button variant="destructive" onClick={handleRemoveKey}>
                    Remove Key
                  </Button>
                  <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
                    Update Key
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleRemoveKey}>
                  Remove Key
                </Button>
                <Button onClick={toggleEdit}>
                  Change Key
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <div />
            <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
              Save API Key
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default GeminiSettings;
