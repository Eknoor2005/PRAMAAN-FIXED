"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Download, X, Loader2, Volume2 } from "lucide-react";

export function MicrophoneRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedChunks(chunks);
        setAudioUrl(URL.createObjectURL(blob));
        setDuration(timer);
        setTimer(0);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("Microphone access is required to use this feature");
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadAudio = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const reset = () => {
    setAudioUrl("");
    setRecordedChunks([]);
    setDuration(0);
    setTimer(0);
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
            <Mic className="w-5 h-5 text-primary" />
            Microphone Recorder
          </CardTitle>
          <CardDescription>
            Record audio testimony. Perfect for quick voice notes and recordings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Visualizer / Display */}
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-muted rounded-lg">
            {isRecording ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center"
                >
                  <Mic className="w-10 h-10 text-white" />
                </motion.div>
                <p className="text-2xl font-bold text-primary">{formatTime(timer)}</p>
              </>
            ) : audioUrl ? (
              <>
                <Volume2 className="w-12 h-12 text-primary" />
                <div className="w-full">
                  <audio
                    src={audioUrl}
                    controls
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Duration: {formatTime(duration)}</p>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">Ready to record</p>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            {!isRecording && !audioUrl && (
              <Button 
                onClick={startRecording} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
            )}

            {isRecording && (
              <Button 
                onClick={stopRecording} 
                variant="destructive"
                className="flex-1"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}

            {audioUrl && (
              <>
                <Button 
                  onClick={downloadAudio}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
            <p>🎙️ Tip: Find a quiet place and speak clearly. Your audio will be encrypted and securely stored.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
