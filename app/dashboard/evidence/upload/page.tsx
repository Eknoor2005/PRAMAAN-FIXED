"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  File,
  Image,
  Video,
  CheckCircle2,
  X,
  Lock,
  AlertCircle,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFileToStorage, createEvidenceRecord } from "@/lib/api-client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function UploadEvidencePage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; name: string; size: string; type: string; file: File }>
  >([]);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.type.split("/")[0],
      file,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (uploadedFiles.length === 0 || !category || !description) {
      setErrorMessage("Please fill in all fields and add at least one file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const { file } = uploadedFiles[i];

        // 1. Upload the raw file to Firebase Storage
        const fileUrl = await uploadFileToStorage(file);

        // 2. Persist the metadata (category, description, hash, owner) via the backend
        await createEvidenceRecord(file, fileUrl, { category, description });

        setUploadProgress(Math.round(((i + 1) / uploadedFiles.length) * 100));
      }

      // Reset form
      setUploadedFiles([]);
      setDescription("");
      setCategory("");
      setUploadProgress(0);

      router.push("/dashboard/evidence");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-12 h-12 text-blue-500" />;
      case "video":
        return <Video className="w-12 h-12 text-purple-500" />;
      default:
        return <File className="w-12 h-12 text-orange-500" />;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-2xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/evidence" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground mt-4">Upload Evidence</h1>
        <p className="text-muted-foreground mt-1">
          Add documents, images, or videos to your secure evidence vault
        </p>
      </motion.div>

      {/* Security Info */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">End-to-End Encrypted</p>
                <p className="text-sm text-muted-foreground">
                  All files are encrypted with AES-256 before storage. Only you and authorized personnel can access them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* File Upload */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Select Files</CardTitle>
            <CardDescription>Drag and drop or click to select</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drag Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      Drag files here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported: Documents, Images, Videos (Max 500MB per file)
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h3 className="font-medium text-foreground">
                    Selected Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
                      >
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.size}
                          </p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Category Selection */}
              <div className="space-y-3 border-t border-border pt-6">
                <Label htmlFor="category" className="text-base font-medium">
                  Evidence Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Records</SelectItem>
                    <SelectItem value="police-report">Police Report</SelectItem>
                    <SelectItem value="photographs">Photographs</SelectItem>
                    <SelectItem value="video-footage">Video Footage</SelectItem>
                    <SelectItem value="messages">Messages/Chat Logs</SelectItem>
                    <SelectItem value="witness-statement">Witness Statement</SelectItem>
                    <SelectItem value="financial">Financial Records</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  Description & Context
                </Label>
                <textarea
                  id="description"
                  placeholder="Provide details about when, where, and why these files are relevant to your case..."
                  className="w-full h-24 p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  Context helps your advocate and lawyer better understand the evidence
                </p>
              </div>

              {/* Error */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Uploading...</p>
                    <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 border-t border-border pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isUploading}
                  asChild
                >
                  <Link href="/dashboard/evidence">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={
                    isUploading ||
                    uploadedFiles.length === 0 ||
                    !category ||
                    !description
                  }
                >
                  <Upload className="w-4 h-4" />
                  {isUploading
                    ? `Uploading (${uploadProgress}%)...`
                    : "Upload Evidence"}
                </Button>
              </div>

              {/* Guidelines */}
              <Card className="border-warning-soft/20 bg-warning-soft/5">
                <CardContent className="py-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Upload Guidelines
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li>✓ Be specific about dates, times, and locations</li>
                    <li>✓ Provide context about why each file is important</li>
                    <li>✓ Organize files by category for easier reference</li>
                    <li>✓ Never share passwords or sensitive identification numbers</li>
                    <li>✓ Remove personally identifying information if possible</li>
                  </ul>
                </CardContent>
              </Card>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
