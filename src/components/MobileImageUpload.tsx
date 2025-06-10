"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Camera,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Plus,
  RotateCcw,
  Crop,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface MobileImageUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export default function MobileImageUpload({
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ""
}: MobileImageUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!acceptedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported' };
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      return { valid: false, error: `File size must be less than ${maxFileSize}MB` };
    }

    return { valid: true };
  };

  const createUploadFile = (file: File): UploadFile => {
    return {
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading'
    };
  };

  const simulateUpload = async (uploadFile: UploadFile) => {
    return new Promise<void>((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Simulate occasional upload errors
          if (Math.random() > 0.9) {
            setUploadFiles(prev => prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
                : f
            ));
            reject(new Error('Upload failed'));
          } else {
            setUploadFiles(prev => prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, progress: 100, status: 'completed' }
                : f
            ));
            resolve();
          }
        } else {
          setUploadFiles(prev => prev.map(f =>
            f.id === uploadFile.id
              ? { ...f, progress }
              : f
          ));
        }
      }, 200);
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxFiles - uploadFiles.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    if (filesToProcess.length === 0) {
      alert('Maximum files reached');
      return;
    }

    const validFiles: UploadFile[] = [];

    for (const file of filesToProcess) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(createUploadFile(file));
      } else {
        alert(`${file.name}: ${validation.error}`);
      }
    }

    if (validFiles.length === 0) return;

    setUploadFiles(prev => [...prev, ...validFiles]);

    try {
      await Promise.all(validFiles.map(uploadFile => simulateUpload(uploadFile)));
      onUploadComplete?.(validFiles);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [maxFiles, uploadFiles.length, validateFile, createUploadFile, simulateUpload, onUploadComplete]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set drag over to false if we're leaving the drop zone completely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== id);
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updatedFiles;
    });
  };

  const retryUpload = async (id: string) => {
    const file = uploadFiles.find(f => f.id === id);
    if (!file) return;

    setUploadFiles(prev => prev.map(f =>
      f.id === id
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ));

    try {
      await simulateUpload(file);
    } catch (error) {
      console.error('Retry upload error:', error);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const completedUploads = uploadFiles.filter(f => f.status === 'completed').length;
  const hasErrors = uploadFiles.some(f => f.status === 'error');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        ref={dropZoneRef}
        className={`relative border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? 'border-green-accent bg-green-accent/5 scale-[1.02]'
            : 'border-border hover:border-green-accent/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-6 sm:p-8 text-center">
          <div className="mb-4">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="p-3 bg-green-accent/20 rounded-full">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-green-accent" />
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Upload Your Images
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Drag and drop files here, or use the buttons below
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={openFileSelector}
              className="bg-green-accent hover:bg-green-accent/90 text-black flex-1 sm:flex-none"
              disabled={uploadFiles.length >= maxFiles}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>

            <Button
              onClick={openCamera}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none"
              disabled={uploadFiles.length >= maxFiles}
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>

          {/* Upload Info */}
          <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
            <p>Supports: JPG, PNG, WebP • Max size: {maxFileSize}MB each</p>
            <p className="mt-1">
              {uploadFiles.length}/{maxFiles} files uploaded
            </p>
          </div>
        </div>

        {/* Drag Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-green-accent/10 border-2 border-green-accent rounded-lg flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Upload className="h-12 w-12 text-green-accent mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-accent">Drop files here</p>
            </div>
          </div>
        )}
      </Card>

      {/* File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Camera Input for Mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Status */}
      {uploadFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">
              Upload Progress ({completedUploads}/{uploadFiles.length})
            </h4>
            {isUploading && (
              <Badge className="bg-blue-500/20 text-blue-700">
                Uploading...
              </Badge>
            )}
            {!isUploading && !hasErrors && (
              <Badge className="bg-green-accent/20 text-green-accent">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
            {hasErrors && (
              <Badge className="bg-red-500/20 text-red-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                Some Failed
              </Badge>
            )}
          </div>

          {/* File List */}
          <div className="space-y-3">
            {uploadFiles.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                {/* Preview */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={uploadFile.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {uploadFile.status === 'completed' && (
                    <div className="absolute inset-0 bg-green-600/80 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {uploadFile.status === 'error' && (
                    <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>

                  {uploadFile.status === 'uploading' && (
                    <div className="mt-1">
                      <Progress value={uploadFile.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(uploadFile.progress)}%
                      </p>
                    </div>
                  )}

                  {uploadFile.status === 'error' && uploadFile.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {uploadFile.error}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  {uploadFile.status === 'error' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => retryUpload(uploadFile.id)}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(uploadFile.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          {uploadFiles.length > 0 && !isUploading && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadFiles([])}
                className="flex-1 sm:flex-none"
              >
                Clear All
              </Button>

              {uploadFiles.length < maxFiles && (
                <Button
                  size="sm"
                  onClick={openFileSelector}
                  className="bg-green-accent hover:bg-green-accent/90 text-black flex-1 sm:flex-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More
                </Button>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
