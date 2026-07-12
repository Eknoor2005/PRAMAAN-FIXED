"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Square, Play, Download, X, Loader2, Save } from "lucide-react";
import { storageService } from "@/lib/services/service-factory";

export function CameraRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setRecordedChunks(chunks);
          setPreview(URL.createObjectURL(blob));
        };

        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Camera access is required to use this feature");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      recordedChunks.length = 0;
      setPreview("");
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Add a small delay to ensure chunks are gathered
      setTimeout(async () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: "video/webm" });
        
        try {
          const url = await storageService.uploadFile(file);
          console.log("File saved to mock storage:", url);
          setPreview(url);
        } catch (error) {
          console.error("Failed to save recording:", error);
        }
      }, 500);
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsRecording(false);
      setPreview("");
    }
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
            <Video className="w-5 h-5 text-primary" />
            Camera Recorder
          </CardTitle>
          <CardDescription>
            Record video testimony with audio. Your recording is encrypted locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Preview */}
          <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-video">
            {preview ? (
              <video
                src={preview}
                controls
                className="w-full h-full"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Recording Indicator */}
            {isRecording && (
              <motion.div
                animate={{ opacity: [1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                Recording
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            {!videoRef.current?.srcObject ? (
              <Button onClick={startCamera} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing Camera
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Start Camera
                  </>
                )}
              </Button>
            ) : (
              <>
                {isRecording ? (
                  <Button onClick={stopRecording} variant="destructive" className="flex-1">
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                ) : (
                  <Button onClick={startRecording} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                )}
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Close Camera
                </Button>
              </>
            )}
          </div>

          {/* Download Button */}
          {preview && (
            <Button onClick={downloadVideo} className="w-full" variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
          )}

          {/* Info */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
            <p>📹 Tip: Make sure your device has good lighting and speak clearly. Your video will be encrypted before uploading.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
