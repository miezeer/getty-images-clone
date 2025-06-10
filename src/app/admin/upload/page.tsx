"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Upload, Images, Zap, CheckCircle, Users, Eye, Scan } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/ImageUpload";
import RealtimeUploadDashboard from "@/components/RealtimeUploadDashboard";
import { faceDetectionService, type FaceDetectionResult } from "@/services/faceDetection";

interface UploadResult {
  id: string;
  title: string;
  category: string;
  uploadedAt: string;
  url?: string;
  faceDetectionResult?: FaceDetectionResult;
}

export default function AdminUploadPage() {
  const [uploadStats, setUploadStats] = useState({
    totalUploaded: 0,
    successfulUploads: 0,
    failedUploads: 0,
    totalSize: 0,
    totalFacesDetected: 0,
    imagesWithFaces: 0
  });
  const [recentUploads, setRecentUploads] = useState<UploadResult[]>([]);
  const [isProcessingFaces, setIsProcessingFaces] = useState(false);

  const handleUploadComplete = async (files: Array<{
    id: string;
    status: string;
    metadata: { title: string; category: string };
    file: File;
    url?: string;
  }>) => {
    const successful = files.filter(f => f.status === 'completed');
    const failed = files.filter(f => f.status === 'error');
    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

    setUploadStats(prev => ({
      totalUploaded: prev.totalUploaded + files.length,
      successfulUploads: prev.successfulUploads + successful.length,
      failedUploads: prev.failedUploads + failed.length,
      totalSize: prev.totalSize + totalSize,
      totalFacesDetected: prev.totalFacesDetected,
      imagesWithFaces: prev.imagesWithFaces
    }));

    // Perform automatic face detection on successfully uploaded images
    if (successful.length > 0) {
      setIsProcessingFaces(true);
      try {
        const uploadsWithFaces: UploadResult[] = [];
        let totalFacesFound = 0;
        let imagesWithFacesCount = 0;

        for (const file of successful) {
          if (file.url && file.file.type.startsWith('image/')) {
            try {
              const faceResult = await faceDetectionService.detectAndRecognizeFaces(file.url, file.id);

              uploadsWithFaces.push({
                id: file.id,
                title: file.metadata.title,
                category: file.metadata.category,
                uploadedAt: new Date().toISOString(),
                url: file.url,
                faceDetectionResult: faceResult
              });

              if (faceResult.totalFaces > 0) {
                totalFacesFound += faceResult.totalFaces;
                imagesWithFacesCount++;
              }
            } catch (error) {
              console.error('Face detection failed for', file.id, error);
              uploadsWithFaces.push({
                id: file.id,
                title: file.metadata.title,
                category: file.metadata.category,
                uploadedAt: new Date().toISOString(),
                url: file.url
              });
            }
          } else {
            uploadsWithFaces.push({
              id: file.id,
              title: file.metadata.title,
              category: file.metadata.category,
              uploadedAt: new Date().toISOString(),
              url: file.url
            });
          }
        }

        // Update face detection stats
        setUploadStats(prev => ({
          ...prev,
          totalFacesDetected: prev.totalFacesDetected + totalFacesFound,
          imagesWithFaces: prev.imagesWithFaces + imagesWithFacesCount
        }));

        // Add to recent uploads (keep last 10)
        setRecentUploads(prev => [
          ...uploadsWithFaces,
          ...prev
        ].slice(0, 10));

      } catch (error) {
        console.error('Batch face detection failed:', error);
      } finally {
        setIsProcessingFaces(false);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image Upload Center</h1>
        <p className="text-muted-foreground">
          Upload and manage images for the Miezeer Images platform
        </p>
      </div>

      {/* Real-time Upload Dashboard */}
      <RealtimeUploadDashboard />

      {/* Upload & Face Detection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-accent/20 rounded-lg">
              <Upload className="h-5 w-5 text-green-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{uploadStats.totalUploaded}</h3>
              <p className="text-sm text-muted-foreground">Session Uploads</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{uploadStats.successfulUploads}</h3>
              <p className="text-sm text-muted-foreground">Successful</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Images className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{formatFileSize(uploadStats.totalSize)}</h3>
              <p className="text-sm text-muted-foreground">Total Size</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{uploadStats.totalFacesDetected}</h3>
              <p className="text-sm text-muted-foreground">Faces Found</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Eye className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{uploadStats.imagesWithFaces}</h3>
              <p className="text-sm text-muted-foreground">Images w/ Faces</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isProcessingFaces ? 'bg-yellow-500/20' : 'bg-gray-500/20'}`}>
              <Scan className={`h-5 w-5 ${isProcessingFaces ? 'text-yellow-500 animate-pulse' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {isProcessingFaces ? 'Processing...' : 'Ready'}
              </h3>
              <p className="text-sm text-muted-foreground">Face Detection</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Interface */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Upload Images</h2>
            <ImageUpload
              onUploadComplete={handleUploadComplete}
              maxFiles={25}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'video/mp4']}
              className="w-full"
            />
          </Card>
        </div>

        {/* Recent Uploads & Tips */}
        <div className="space-y-6">
          {/* Recent Uploads */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Uploads</h3>
            {recentUploads.length > 0 ? (
              <div className="space-y-3">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    {upload.url ? (
                      <img
                        src={upload.url}
                        alt={upload.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Images className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{upload.title}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs bg-green-accent/10 text-green-accent border-green-accent">
                          {upload.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(upload.uploadedAt)}</span>
                      </div>
                      {upload.faceDetectionResult && (
                        <div className="flex items-center gap-2">
                          {upload.faceDetectionResult.totalFaces > 0 ? (
                            <>
                              <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30">
                                <Users className="h-3 w-3 mr-1" />
                                {upload.faceDetectionResult.totalFaces} faces
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
                                {upload.faceDetectionResult.faces.filter(f => f.personName).length} recognized
                              </Badge>
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-gray-500/10 text-gray-600 border-gray-500/30">
                              No faces detected
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Images className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent uploads</p>
              </div>
            )}
          </Card>

          {/* Upload Guidelines */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upload Guidelines</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Image Requirements</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimum resolution: 1920×1080 pixels</li>
                  <li>Supported formats: JPEG, PNG, WebP</li>
                  <li>Maximum file size: 50MB</li>
                  <li>High quality, professional images only</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Content Standards</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Original content or properly licensed</li>
                  <li>No watermarks or logos</li>
                  <li>Appropriate for commercial use</li>
                  <li>Proper metadata and tagging</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Best Practices</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use descriptive, searchable titles</li>
                  <li>Select accurate categories</li>
                  <li>Add relevant tags for discoverability</li>
                  <li>Include photographer credits</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-green-accent text-green-accent hover:bg-green-accent/10"
                onClick={() => { window.location.href = '/admin/content'; }}
              >
                <Images className="h-4 w-4 mr-2" />
                Manage Content Library
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => { window.location.href = '/admin/downloads'; }}
              >
                <Zap className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => { window.location.href = '/events'; }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload to Events
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
