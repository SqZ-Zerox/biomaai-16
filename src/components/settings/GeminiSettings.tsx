
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setGeminiKey, hasGeminiKey, clearGeminiKey } from "@/services/geminiService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Bot, Shield } from "lucide-react";
import { SecureKeyManager } from "@/services/securityService";

const GeminiSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [keyStrength, setKeyStrength] = useState<"strong" | "weak" | null>(null);
  
  useEffect(() => {
    // Check if API key is already set
    setIsConfigured(hasGeminiKey());
  }, []);
  
  const evaluateKeyStrength = (key: string) => {
    if (!key) {
      setKeyStrength(null);
      return;
    }
    // Simple strength check - in a real app, you'd have more comprehensive validation
    setKeyStrength(key.startsWith("AIza") && key.length > 30 ? "strong" : "weak");
  };
  
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    evaluateKeyStrength(newKey);
  };
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    
    // Save the API key
    setGeminiKey(apiKey.trim());
    setIsConfigured(true);
    setIsEditing(false);
    setApiKey(""); // Clear the input for security
    setKeyStrength(null);
  };
  
  const handleRemoveKey = () => {
    clearGeminiKey();
    setIsConfigured(false);
    setIsEditing(false);
    setApiKey("");
    setKeyStrength(null);
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setApiKey("");
    setKeyStrength(null);
  };
  
  return (
    <Card className="border-border/50 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-green-500" />
          Google Gemini API Configuration
          <Shield className="h-4 w-4 text-primary ml-auto" />
        </CardTitle>
        <CardDescription>
          Configure your Gemini API key to enable enhanced AI features with secure storage
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
                  Enter your Gemini API key to enable enhanced AI features. Your key is stored securely in your browser's local storage with enhanced encryption.
                  <p className="mt-2 text-xs">
                    A default test API key is provided, but you may want to use your own for production.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="geminiApiKey" className="text-sm font-medium flex items-center">
                  Gemini API Key
                  <Shield className="h-4 w-4 text-primary ml-2" />
                </label>
                <div className="relative">
                  <Input
                    id="geminiApiKey"
                    type="password"
                    value={apiKey}
                    onChange={handleKeyChange}
                    placeholder="AIzaSy..."
                    className="font-mono pr-8"
                  />
                  {keyStrength && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className={`h-2 w-2 rounded-full ${keyStrength === "strong" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is stored securely with enhanced encryption in your browser's local storage.
                </p>
                {keyStrength === "weak" && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    This doesn't appear to be a valid Gemini API key. Keys typically start with "AIza".
                  </p>
                )}
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
                  <Button onClick={handleSaveKey} disabled={!apiKey.trim() || keyStrength === "weak"}>
                    <Shield className="h-4 w-4 mr-2" />
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
                  <Shield className="h-4 w-4 mr-2" />
                  Change Key
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <div />
            <Button onClick={handleSaveKey} disabled={!apiKey.trim() || keyStrength === "weak"}>
              <Shield className="h-4 w-4 mr-2" />
              Save API Key
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default GeminiSettings;
