"use client";

export const dynamic = 'force-dynamic';

import { useState, useRef } from "react";
import { Upload, Plus, X, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  category: string;
  tags: string;
  status: "pending" | "uploading" | "completed" | "error";
  progress: number;
}

export default function BulkUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "People", "Architecture", "Business", "Nature", "Travel",
    "Technology", "Food", "Fashion", "Sports", "Animals"
  ];

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/')) {
        const id = `${Date.now()}-${i}`;
        const preview = URL.createObjectURL(file);

        newFiles.push({
          id,
          file,
          preview,
          title: file.name.split('.')[0],
          category: "People",
          tags: "",
          status: "pending",
          progress: 0
        });
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file =>
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const startUpload = async () => {
    for (const file of files.filter(f => f.status === "pending")) {
      updateFile(file.id, { status: "uploading", progress: 0 });

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateFile(file.id, { progress });
      }

      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      updateFile(file.id, {
        status: success ? "completed" : "error",
        progress: 100
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bulk Upload</h1>
        <p className="text-muted-foreground">Upload multiple images at once to your Miezeer Images library</p>
      </div>

      {/* Upload Area */}
      <Card className="p-8 bg-card border-border glass-effect">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-green-accent bg-green-accent/10'
              : 'border-border hover:border-green-accent/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-muted-foreground mb-6">
            Support for JPG, PNG, GIF, and WebP formats. Maximum 10MB per file.
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-accent hover:bg-green-accent/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-6 bg-card border-border glass-effect">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Uploaded Files ({files.length})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                className="border-red-400/50 text-red-400 hover:bg-red-400/10"
              >
                Clear All
              </Button>
              <Button
                onClick={startUpload}
                disabled={files.filter(f => f.status === "pending").length === 0}
                className="bg-green-accent hover:bg-green-accent/90 text-black"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border border-border rounded-lg p-4 bg-background/50">
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      {file.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-green-accent" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Title</label>
                      <Input
                        value={file.title}
                        onChange={(e) => updateFile(file.id, { title: e.target.value })}
                        className="mt-1 bg-background border-border text-foreground"
                        disabled={file.status === "uploading"}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <Select
                        value={file.category}
                        onValueChange={(value) => updateFile(file.id, { category: value })}
                        disabled={file.status === "uploading"}
                      >
                        <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-foreground hover:bg-green-accent/10">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tags</label>
                      <Input
                        value={file.tags}
                        onChange={(e) => updateFile(file.id, { tags: e.target.value })}
                        placeholder="business, meeting, team"
                        className="mt-1 bg-background border-border text-foreground"
                        disabled={file.status === "uploading"}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${
                        file.status === "pending" ? "bg-muted/50 text-muted-foreground border-border" :
                        file.status === "uploading" ? "bg-blue-400/20 text-blue-400 border-blue-400" :
                        file.status === "completed" ? "bg-green-accent/20 text-green-accent border-green-accent" :
                        "bg-red-400/20 text-red-400 border-red-400"
                      }`}
                    >
                      {file.status === "uploading" ? `${file.progress}%` : file.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-400 hover:bg-red-400/10"
                      disabled={file.status === "uploading"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {file.status === "uploading" && (
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
