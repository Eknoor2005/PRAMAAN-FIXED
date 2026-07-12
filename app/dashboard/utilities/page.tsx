"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraRecorder } from "@/components/utilities/camera-recorder";
import { MicrophoneRecorder } from "@/components/utilities/microphone-recorder";
import { Translator } from "@/components/utilities/translator";
import { Video, Mic, Globe } from "lucide-react";

export default function UtilitiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight">Utilities & Tools</h1>
        <p className="text-muted-foreground text-lg">
          Tools to help you record and translate your testimony into multiple languages
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs defaultValue="camera" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Camera</span>
            </TabsTrigger>
            <TabsTrigger value="microphone" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Microphone</span>
            </TabsTrigger>
            <TabsTrigger value="translator" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Translator</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <CameraRecorder />
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-100 space-y-2">
              <p className="font-medium">📹 How to use Camera Recorder:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Click "Start Camera" to enable your camera</li>
                <li>Click "Start Recording" when you&apos;re ready</li>
                <li>Speak clearly and share your testimony</li>
                <li>Click "Stop Recording" when finished</li>
                <li>Download your video or upload it to Evidence Vault</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="microphone" className="space-y-4">
            <MicrophoneRecorder />
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-sm text-green-900 dark:text-green-100 space-y-2">
              <p className="font-medium">🎙️ How to use Microphone Recorder:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Click "Start Recording" to begin recording audio</li>
                <li>Find a quiet place for best quality</li>
                <li>Speak clearly and naturally</li>
                <li>Click "Stop Recording" when you&apos;re finished</li>
                <li>Download your recording to keep a backup</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="translator" className="space-y-4">
            <Translator />
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-sm text-purple-900 dark:text-purple-100 space-y-2">
              <p className="font-medium">🌍 How to use Translator:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Enter or paste your text in the left box</li>
                <li>Select source language (auto-detect available)</li>
                <li>Choose your target language</li>
                <li>Click "Translate" to get the translation</li>
                <li>Copy the translation to share with others</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Security Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-4 rounded-lg bg-primary/10 border border-primary/20"
      >
        <p className="text-sm text-foreground">
          <strong>🔒 Your Privacy:</strong> All your recordings are processed locally on your device. Text translations are sent securely to Google Translate servers. Your testimony remains encrypted and under your control at all times.
        </p>
      </motion.div>
    </div>
  );
}
