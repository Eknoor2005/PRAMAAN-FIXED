"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Video,
  FileText,
  Pause,
  Play,
  Square,
  Save,
  ArrowRight,
  Clock,
  Heart,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const prompts = [
  { id: 1, question: "What do you remember about the setting or location?", category: "location" },
  { id: 2, question: "Were there any sounds or smells you recall?", category: "sensory" },
  { id: 3, question: "Can you describe any people who were present?", category: "people" },
  { id: 4, question: "What emotions were you feeling during the event?", category: "emotions" },
  { id: 5, question: "Are there any objects or details that stand out?", category: "details" },
];

const savedFragments = [
  { id: 1, preview: "I remember the room was dark, with only...", time: "2:30", type: "voice" },
  { id: 2, preview: "There was a strong smell of cigarettes...", time: "", type: "text" },
  { id: 3, preview: "The person had a scar on their left hand...", time: "1:15", type: "voice" },
];

export default function RecordPage() {
  const [recordingType, setRecordingType] = useState<"voice" | "video" | "text">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [activePrompt, setActivePrompt] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    // Start recording logic would go here
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Record Your Memory</h1>
        <p className="text-muted-foreground mt-1">
          Share your memories in your own words, at your own pace. Take breaks whenever you need.
        </p>
      </div>

      {/* Comfort reminder */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Your comfort matters</p>
              <p className="text-sm text-muted-foreground">
                You can pause, stop, or save as draft at any time. There&apos;s no right or wrong way to share 
                your experience. It&apos;s okay if memories come in fragments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Recording Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Recording Method</CardTitle>
              <CardDescription>
                Select how you&apos;d like to share this memory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="voice" onValueChange={(v) => setRecordingType(v as "voice" | "video" | "text")}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="voice" className="gap-2">
                    <Mic className="w-4 h-4" />
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="video" className="gap-2">
                    <Video className="w-4 h-4" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="text" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="voice" className="mt-6">
                  <div className="text-center space-y-6">
                    {/* Recording visualization */}
                    <div className="relative">
                      <div 
                        className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all ${
                          isRecording 
                            ? "bg-destructive/10 animate-pulse" 
                            : "bg-secondary"
                        }`}
                      >
                        {isRecording ? (
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-destructive rounded animate-pulse"
                                style={{
                                  height: `${20 + Math.random() * 30}px`,
                                  animationDelay: `${i * 100}ms`,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <Mic className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      {isRecording && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm">
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          {formatTime(recordingTime)}
                        </div>
                      )}
                    </div>

                    {/* Recording controls */}
                    <div className="flex items-center justify-center gap-4">
                      {!isRecording ? (
                        <Button size="lg" onClick={handleStartRecording} className="gap-2">
                          <Mic className="w-5 h-5" />
                          Start Recording
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handlePauseRecording}
                            className="w-12 h-12 rounded-full"
                          >
                            {isPaused ? (
                              <Play className="w-5 h-5" />
                            ) : (
                              <Pause className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={handleStopRecording}
                            className="w-12 h-12 rounded-full"
                          >
                            <Square className="w-5 h-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleStopRecording}
                            className="w-12 h-12 rounded-full"
                          >
                            <Save className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="mt-6">
                  <div className="text-center space-y-6">
                    <div 
                      className={`aspect-video max-w-md mx-auto rounded-xl flex items-center justify-center ${
                        isRecording 
                          ? "bg-foreground/5 border-2 border-destructive" 
                          : "bg-secondary border-2 border-dashed border-border"
                      }`}
                    >
                      {isRecording ? (
                        <div className="text-center">
                          <div className="flex items-center gap-2 text-destructive mb-2">
                            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                            Recording...
                          </div>
                          <p className="text-sm text-muted-foreground">{formatTime(recordingTime)}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      {!isRecording ? (
                        <Button size="lg" onClick={handleStartRecording} className="gap-2">
                          <Video className="w-5 h-5" />
                          Start Video Recording
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handlePauseRecording}
                            className="w-12 h-12 rounded-full"
                          >
                            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={handleStopRecording}
                            className="w-12 h-12 rounded-full"
                          >
                            <Square className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your memory here... Take your time, there's no rush."
                      className="min-h-[200px] resize-none"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {textContent.length} characters
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                          <Save className="w-4 h-4" />
                          Save Draft
                        </Button>
                        <Button className="gap-2">
                          Submit Memory
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Guided Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gentle Prompts</CardTitle>
              <CardDescription>
                These questions may help guide your memory. Use them only if helpful.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prompts.map((prompt, index) => (
                  <button
                    key={prompt.id}
                    onClick={() => setActivePrompt(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      activePrompt === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground">{prompt.question}</p>
                      <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                        activePrompt === index ? "rotate-90" : ""
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Timeline Preview & Saved Fragments */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Fragments</CardTitle>
              <CardDescription>
                Your recorded memories in this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedFragments.length > 0 ? (
                <div className="space-y-3">
                  {savedFragments.map((fragment) => (
                    <div
                      key={fragment.id}
                      className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {fragment.type === "voice" ? (
                            <Mic className="w-4 h-4 text-primary" />
                          ) : (
                            <FileText className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-2">{fragment.preview}</p>
                          {fragment.time && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {fragment.time}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <Mic className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your recorded memories will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-warning-soft/30 bg-warning-soft/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning-soft-foreground" />
                Recording Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Speak naturally - there&apos;s no script to follow
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  It&apos;s okay to pause or take breaks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Share only what you feel comfortable with
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Fragments are perfectly valid - memories don&apos;t need to be complete
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
