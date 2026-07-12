"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Image,
  Video,
  Music,
  Download,
  Trash2,
  Lock,
  Search,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listEvidence, deleteEvidenceRecord, EvidenceRecord } from "@/lib/api-client";

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

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function EvidenceVaultPage() {
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listEvidence()
      .then((items) => {
        if (!cancelled) setEvidence(items);
      })
      .catch((err) => {
        if (!cancelled) setErrorMessage(err instanceof Error ? err.message : "Failed to load evidence");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this evidence item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteEvidenceRecord(id);
      setEvidence((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete evidence");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedFilter === "all" ||
      (selectedFilter === "documents" && item.fileType === "document") ||
      (selectedFilter === "images" && item.fileType === "photo") ||
      (selectedFilter === "videos" && item.fileType === "video") ||
      (selectedFilter === "audio" && item.fileType === "audio");
    return matchesSearch && matchesType;
  });

  const stats = {
    total: evidence.length,
    documents: evidence.filter((e) => e.fileType === "document").length,
    images: evidence.filter((e) => e.fileType === "photo").length,
    videos: evidence.filter((e) => e.fileType === "video").length,
    totalSize: formatBytes(evidence.reduce((sum, e) => sum + (e.fileSize || 0), 0)),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />;
      case "photo":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "audio":
        return <Music className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Evidence Vault</h1>
            <p className="text-muted-foreground mt-1">
              Securely store and manage all evidence related to your case
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link href="/dashboard/evidence/upload">
              <Plus className="w-4 h-4" />
              Upload Evidence
            </Link>
          </Button>
        </div>
      </motion.div>

      {errorMessage && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMessage}
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Items</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats.documents}</p>
                <p className="text-xs text-muted-foreground mt-1">Documents</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats.images}</p>
                <p className="text-xs text-muted-foreground mt-1">Images</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{stats.videos}</p>
                <p className="text-xs text-muted-foreground mt-1">Videos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{stats.totalSize}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Size</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">Tamper-evident storage</p>
                <p className="text-sm text-muted-foreground">
                  Every file gets a SHA-256 hash on upload, so it can later be proven unaltered.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
          <div className="flex-1">
            <Label htmlFor="search" className="text-xs mb-2 block">
              Search Files
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search by filename..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <Label htmlFor="filter" className="text-xs mb-2 block">
              Filter by Type
            </Label>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger id="filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Evidence List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Your Evidence Files ({filteredEvidence.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading your evidence...
              </div>
            ) : filteredEvidence.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {evidence.length === 0 ? "You haven't uploaded any evidence yet" : "No evidence files match your filters"}
                </p>
                {evidence.length === 0 && (
                  <Button className="mt-4 gap-2" asChild>
                    <Link href="/dashboard/evidence/upload">
                      <Plus className="w-4 h-4" />
                      Upload your first file
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvidence.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      {getTypeIcon(item.fileType)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{item.fileName}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{formatBytes(item.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{item.category.replace("-", " ")}</span>
                          </>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{item.description}</p>
                      )}
                    </div>

                    {/* Encryption Badge */}
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex-shrink-0">
                      <Lock className="w-3 h-3" />
                      Sealed
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="w-9 h-9 p-0" asChild>
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-9 h-9 p-0 text-destructive hover:text-destructive"
                        disabled={deletingId === item._id}
                        onClick={() => handleDelete(item._id)}
                      >
                        {deletingId === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
