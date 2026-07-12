"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Copy, Loader2, AlertCircle } from "lucide-react";

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
];

export function Translator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/translation/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage,
          sourceLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setTranslatedText(data.data.translatedText);
      if (sourceLanguage === "auto") {
        setSourceLanguage(data.data.sourceLanguage);
      }
    } catch (err) {
      setError("Failed to translate. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage === "auto" ? "en" : sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Translator
          </CardTitle>
          <CardDescription>
            Translate your testimony to different languages using Google Translate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Source Language */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="source-lang">Source Language</Label>
                <select
                  id="source-lang"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                >
                  <option value="auto">Auto-detect</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="source-text">Text to Translate</Label>
                <textarea
                  id="source-text"
                  value={sourceText}
                  onChange={(e) => {
                    setSourceText(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter text here..."
                  className="w-full px-3 py-2 mt-1 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={6}
                  disabled={isLoading}
                />
              </div>

              <div className="text-xs text-muted-foreground">
                {sourceText.length} characters
              </div>
            </div>

            {/* Target Language */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="target-lang">Target Language</Label>
                <select
                  id="target-lang"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="translated-text">Translated Text</Label>
                <textarea
                  id="translated-text"
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="w-full px-3 py-2 mt-1 rounded-lg border border-border bg-muted text-foreground text-sm focus:outline-none resize-none"
                  rows={6}
                />
              </div>

              {translatedText && (
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Translation"}
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={translate}
              disabled={isLoading || !sourceText.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Translate
                </>
              )}
            </Button>

            {translatedText && (
              <Button
                onClick={swapLanguages}
                variant="outline"
                disabled={isLoading}
              >
                ⇄ Swap
              </Button>
            )}
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
            <p>🌍 Powered by Google Translate. Perfect for making your testimony accessible to people in different languages.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
