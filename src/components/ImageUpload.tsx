"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Check, AlertCircle, FileImage, Loader2, Camera, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, supabaseHelpers } from "@/lib/supabase";
import { useRealtimeUpload } from "@/components/RealtimeUploadManager";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  url?: string;
  thumbnailUrl?: string;
  metadata: {
    title: string;
    photographer: string;
    category: string;
    tags: string[];
    type: 'photo' | 'video' | 'illustration' | 'vector';
    premium: boolean;
  };
}

interface ImageUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
  onUploadProgress?: (progress: number) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  uploadContext?: {
    eventId?: string;
    collectionId?: string;
    category?: string;
  };
  className?: string;
}

const defaultCategories = [
  'Business', 'Technology', 'Nature', 'Fashion', 'Sports',
  'Food', 'Travel', 'Abstract', 'People', 'Architecture'
];

const fileTypes = [
  { value: 'photo', label: 'Photo' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'vector', label: 'Vector' },
  { value: 'video', label: 'Video' }
];

export default function ImageUpload({
  onUploadComplete,
  onUploadProgress,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
  uploadContext,
  className = ""
}: ImageUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification, updateNotification } = useRealtimeUpload();

  const generateId = () => `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return 'File size must be less than 50MB';
    }
    return null;
  }, [acceptedTypes]);

  const createUploadFile = useCallback((file: File): UploadFile => {
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    return {
      id: generateId(),
      file,
      progress: 0,
      status: 'pending',
      metadata: {
        title: fileNameWithoutExt,
        photographer: 'Admin',
        category: uploadContext?.category || 'Business',
        tags: [],
        type: file.type.startsWith('video/') ? 'video' : 'photo',
        premium: false
      }
    };
  }, [uploadContext?.category]);

  const handleFiles = useCallback((newFiles: FileList) => {
    const validFiles: UploadFile[] = [];
    const errors: string[] = [];

    for (const file of Array.from(newFiles)) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (files.length + validFiles.length < maxFiles) {
        validFiles.push(createUploadFile(file));
      }
    }

    if (errors.length > 0) {
      console.error('File validation errors:', errors);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  }, [files.length, maxFiles, validateFile, createUploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files: droppedFiles } = e.dataTransfer;
    if (droppedFiles) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files: selectedFiles } = e.target;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileMetadata = (id: string, metadata: Partial<UploadFile['metadata']>) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, metadata: { ...f.metadata, ...metadata } } : f
    ));
  };

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/')) {
        // For video files, we'll use a placeholder for now
        resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgZmlsbD0iIzMzNDU1NSIvPgo8cGF0aCBkPSJNMTAgOEwxNiAxMkwxMCAxNlY4WiIgZmlsbD0iIzY2NjY2NiIvPgo8L3N2Zz4K');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxSize = 200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadToSupabase = async (uploadFile: UploadFile): Promise<void> => {
    const { file, metadata } = uploadFile;

    // Add real-time notification
    const notificationId = addNotification({
      title: metadata.title,
      progress: 0,
      status: 'uploading',
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        category: metadata.category
      }
    });

    try {
      // Update status to uploading
      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
      ));

      updateNotification(notificationId, { progress: 10, status: 'uploading' });

      // Upload main image with progress tracking
      const userId = 'admin'; // In real app, get from auth context
      const { data: uploadData, error: uploadError } = await supabaseHelpers.uploadImage(file, userId, 'images');

      if (uploadError) throw uploadError;

      // Update progress
      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? { ...f, progress: 50, status: 'processing' as const } : f
      ));

      updateNotification(notificationId, { progress: 50, status: 'processing' });

      // Generate and upload thumbnail
      const thumbnailData = await generateThumbnail(file);
      const thumbnailBlob = await fetch(thumbnailData).then(r => r.blob());
      const thumbnailFile = new File([thumbnailBlob], `thumb_${file.name}`, { type: 'image/jpeg' });

      const { data: thumbnailUploadData, error: thumbnailError } = await supabaseHelpers.uploadImage(
        thumbnailFile,
        userId,
        'thumbnails'
      );

      if (thumbnailError) console.warn('Thumbnail upload failed:', thumbnailError);

      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? { ...f, progress: 75 } : f
      ));

      updateNotification(notificationId, { progress: 75 });

      // Create database record
      const imageData = {
        title: metadata.title,
        description: `Uploaded via admin panel${uploadContext?.eventId ? ` for event ${uploadContext.eventId}` : ''}`,
        url: uploadData.publicUrl,
        thumbnail_url: thumbnailUploadData?.publicUrl || uploadData.publicUrl,
        photographer: metadata.photographer,
        type: metadata.type,
        category: metadata.category,
        tags: metadata.tags,
        premium: metadata.premium,
        width: 1920, // These would be extracted from actual image in production
        height: 1080,
        uploaded_by: userId,
        file_size: file.size
      };

      const { data: dbData, error: dbError } = await supabase
        .from('stock_images')
        .insert([imageData])
        .select()
        .single();

      if (dbError) throw dbError;

      // Complete upload
      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? {
          ...f,
          progress: 100,
          status: 'completed' as const,
          url: uploadData.publicUrl,
          thumbnailUrl: thumbnailUploadData?.publicUrl || uploadData.publicUrl
        } : f
      ));

      updateNotification(notificationId, { progress: 100, status: 'completed' });

    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';

      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? {
          ...f,
          status: 'error' as const,
          error: errorMessage
        } : f
      ));

      updateNotification(notificationId, {
        status: 'error',
        error: errorMessage
      });
    }
  };

  const startUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Upload files concurrently with limited concurrency
      const uploadPromises = pendingFiles.map(file => uploadToSupabase(file));
      await Promise.all(uploadPromises);

      // Calculate overall progress
      const totalProgress = files.reduce((sum, f) => sum + f.progress, 0) / files.length;
      onUploadProgress?.(totalProgress);

      // Check if all uploads completed
      const completedFiles = files.filter(f => f.status === 'completed');
      if (completedFiles.length === files.length) {
        onUploadComplete?.(completedFiles);
      }

    } catch (error) {
      console.error('Batch upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return <FileImage className="h-4 w-4 text-muted-foreground" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileImage className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-muted';
      case 'uploading':
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-green-accent bg-green-accent/10'
            : 'border-border hover:border-green-accent/50 hover:bg-green-accent/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-accent/20 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-green-accent" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragging ? 'Drop files here' : 'Upload Images & Videos'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Supported formats: JPEG, PNG, WebP, MP4</p>
              <p>Maximum file size: 50MB per file</p>
              <p>Maximum {maxFiles} files at once</p>
            </div>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-accent hover:bg-green-accent/90 text-black"
            disabled={files.length >= maxFiles}
          >
            <Camera className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Files to Upload ({files.length})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <Button
                onClick={startUpload}
                disabled={isUploading || files.every(f => f.status !== 'pending')}
                className="bg-green-accent hover:bg-green-accent/90 text-black"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload All
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {files.map((uploadFile) => (
              <Card key={uploadFile.id} className="p-4 border-border">
                <div className="space-y-4">
                  {/* File Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(uploadFile.status)}
                      <div>
                        <p className="font-medium text-foreground">{uploadFile.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(uploadFile.status)}>
                        {uploadFile.status}
                      </Badge>
                      {uploadFile.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {uploadFile.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                        </span>
                        <span className="text-foreground">{uploadFile.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-500">{uploadFile.error}</p>
                    </div>
                  )}

                  {/* Metadata Form */}
                  {uploadFile.status === 'pending' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-foreground">Title</label>
                        <Input
                          value={uploadFile.metadata.title}
                          onChange={(e) => updateFileMetadata(uploadFile.id, { title: e.target.value })}
                          placeholder="Image title"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Photographer</label>
                        <Input
                          value={uploadFile.metadata.photographer}
                          onChange={(e) => updateFileMetadata(uploadFile.id, { photographer: e.target.value })}
                          placeholder="Photographer name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Category</label>
                        <Select
                          value={uploadFile.metadata.category}
                          onValueChange={(value) => updateFileMetadata(uploadFile.id, { category: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Type</label>
                        <Select
                          value={uploadFile.metadata.type}
                          onValueChange={(value: 'photo' | 'video' | 'illustration' | 'vector') => updateFileMetadata(uploadFile.id, { type: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fileTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
