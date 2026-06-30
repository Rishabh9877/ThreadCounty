"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  X,
  FileWarning,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/GlassCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createUploadRecord } from "@/app/actions/upload";
import {
  validateImageFile,
  formatFileSize,
  compressImage,
} from "@/lib/imageCompression";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { user, supabase } = useSupabase();
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      toast.error(validation.error);
      return;
    }

    try {
      const compressed = await compressImage(file);
      setSelectedFile(compressed);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(compressed);

      toast.success(
        `Image ready: ${formatFileSize(compressed.size)} (compressed from ${formatFileSize(file.size)})`
      );
    } catch {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    setIsComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !user) return;
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Create a unique file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Simulate some initial progress for UX
      setUploadProgress(10);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // Simulate API analysis call duration
      setUploadProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setUploadProgress(100);
      setIsUploading(false);
      setIsComplete(true);
      toast.success("Analysis complete! Redirecting to results...");

      const newId = await createUploadRecord(selectedFile.name, publicUrl, selectedFile.size);
      setTimeout(() => {
        router.push(`/dashboard/results/${newId}`);
      }, 1500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
      toast.error('Failed to upload image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, user, supabase, router]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <SectionHeading
          title="Upload Fabric Image"
          description="Upload a fabric image for AI-powered thread density analysis and weave classification."
          align="center"
        />

        {/* Drop Zone */}
        <GlassCard className="p-0 overflow-hidden">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center p-12 transition-all duration-300 cursor-pointer min-h-[300px]",
              isDragging &&
                "bg-primary/5 border-2 border-dashed border-primary scale-[1.01]",
              !selectedFile && !isDragging && "hover:bg-muted/30",
              selectedFile && "cursor-default"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300",
                      isDragging ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    <Upload
                      className={cn(
                        "w-8 h-8 transition-all",
                        isDragging
                          ? "text-primary scale-110"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <p className="text-base font-medium mb-1">
                    {isDragging
                      ? "Drop your image here"
                      : "Drag & drop your fabric image"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      JPG, JPEG, PNG
                    </span>
                    <span>•</span>
                    <span>Max 5MB</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Image Preview */}
                    <div className="relative group flex-shrink-0">
                      {preview && (
                        <img
                          src={preview}
                          alt="Fabric preview"
                          className="w-48 h-48 object-cover rounded-xl border border-border"
                        />
                      )}
                      {!isUploading && !isComplete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <p className="font-medium text-sm truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(selectedFile.size)} •{" "}
                          {selectedFile.type.split("/")[1].toUpperCase()}
                        </p>
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-primary">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Analyzing...
                            </span>
                            <span>{Math.round(uploadProgress)}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {isComplete && (
                        <div className="flex items-center gap-2 text-aurora-emerald text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Analysis complete — redirecting...
                        </div>
                      )}

                      {!isUploading && !isComplete && (
                        <div className="flex gap-3">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpload();
                            }}
                            className="bg-gradient-to-r from-neon-indigo to-primary text-white flex-1"
                          >
                            Start Analysis
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="glass"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-6 py-4 bg-destructive/10 border-t border-destructive/20 flex items-center gap-3"
            >
              <FileWarning className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </GlassCard>

        {/* Upload Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "High Resolution",
              desc: "Use 300+ DPI images for best accuracy",
            },
            {
              title: "Even Lighting",
              desc: "Avoid shadows or harsh reflections",
            },
            {
              title: "Flat Surface",
              desc: "Photograph fabric on a flat, smooth surface",
            },
          ].map((tip, i) => (
            <GlassCard key={i} className="py-4 text-center" hover={false}>
              <p className="text-sm font-medium">{tip.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
