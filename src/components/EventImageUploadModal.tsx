"use client";

import type { UploadedFile } from "@/types";

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
import { useState } from "react";
import { X, Upload, Calendar, MapPin, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "./ImageUpload";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageCount: number;
  attendees: number;
  coverImage: string;
  photographer: string;
  featured: boolean;
  status: "upcoming" | "live" | "completed";
}

interface EventImageUploadModalProps {
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (uploadedFiles: UploadFile[]) => void;
}

export default function EventImageUploadModal({
  event,
  isOpen,
  onClose,
  onUploadComplete
}: EventImageUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  if (!isOpen) return null;

  const handleUploadComplete = (files: UploadFile[]) => {
    setUploadedCount(files.length);
    onUploadComplete?.(files);

    // Auto-close modal after successful upload with delay
    setTimeout(() => {
      onClose();
      setUploadedCount(0);
      setUploadProgress(0);
    }, 2000);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-accent text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live Now";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4 bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{event.title}</h2>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={`${getStatusColor(event.status)} font-semibold`}>
                  {getStatusText(event.status)}
                </Badge>
                <Badge variant="outline" className="bg-green-accent/10 text-green-accent border-green-accent">
                  {event.category}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Event Details */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-accent">
              <Camera className="h-4 w-4" />
              <span>{event.imageCount} photos currently</span>
            </div>
          </div>
        </div>

        {/* Upload Progress Summary */}
        {isUploading && (
          <div className="p-6 border-b border-border">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Upload className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Upload in Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Uploading images to {event.title}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="text-foreground">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadedCount > 0 && (
          <div className="p-6 border-b border-border">
            <div className="bg-green-accent/10 border border-green-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-accent/20 rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-green-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Upload Complete!</h4>
                  <p className="text-sm text-muted-foreground">
                    Successfully uploaded {uploadedCount} image{uploadedCount !== 1 ? 's' : ''} to {event.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload Event Images</h3>
            <p className="text-muted-foreground">
              Add high-quality images from this event. All uploads will be automatically categorized under "{event.category}" and tagged with the event details.
            </p>
          </div>

          <ImageUpload
            onUploadComplete={handleUploadComplete}
            onUploadProgress={handleUploadProgress}
            maxFiles={20}
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
            uploadContext={{
              eventId: event.id,
              category: event.category
            }}
            className="mb-6"
          />

          {/* Upload Tips */}
          <Card className="p-4 bg-muted/30 border-border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-accent" />
              Upload Tips for Event Photography
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p><strong>Quality Standards:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>High-resolution images (minimum 1920px wide)</li>
                  <li>Good lighting and sharp focus</li>
                  <li>Professional composition</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p><strong>Content Guidelines:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Capture key moments and highlights</li>
                  <li>Include venue, speakers, and audience shots</li>
                  <li>Ensure proper model releases if needed</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            <p>Images will be processed and made available in the event gallery</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="border-border text-foreground hover:bg-muted"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
