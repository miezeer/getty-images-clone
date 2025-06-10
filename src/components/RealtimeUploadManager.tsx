"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Upload, CheckCircle, AlertCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface UploadNotification {
  id: string;
  title: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  timestamp: number;
  metadata?: {
    fileName: string;
    fileSize: number;
    category?: string;
  };
}

interface RealtimeUploadContextType {
  notifications: UploadNotification[];
  addNotification: (notification: Omit<UploadNotification, 'id' | 'timestamp'>) => string;
  updateNotification: (id: string, updates: Partial<UploadNotification>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  totalActiveUploads: number;
  globalProgress: number;
}

const RealtimeUploadContext = createContext<RealtimeUploadContextType | null>(null);

export function useRealtimeUpload() {
  const context = useContext(RealtimeUploadContext);
  if (!context) {
    throw new Error('useRealtimeUpload must be used within RealtimeUploadProvider');
  }
  return context;
}

interface RealtimeUploadProviderProps {
  children: React.ReactNode;
}

export function RealtimeUploadProvider({ children }: RealtimeUploadProviderProps) {
  const [notifications, setNotifications] = useState<UploadNotification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    // In a real app, you'd connect to your WebSocket server
    // For now, we'll simulate real-time updates
    console.log('Real-time upload manager initialized');

    const currentWs = wsRef.current;

    return () => {
      if (currentWs) {
        currentWs.close();
      }
    };
  }, []);

  const addNotification = (notification: Omit<UploadNotification, 'id' | 'timestamp'>): string => {
    const id = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: UploadNotification = {
      ...notification,
      id,
      timestamp: Date.now()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification for new uploads
    if (notification.status === 'uploading') {
      toast({
        title: "Upload Started",
        description: `Uploading ${notification.title}`,
        duration: 3000,
      });
    }

    return id;
  };

  const updateNotification = (id: string, updates: Partial<UploadNotification>) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === id) {
        const updated = { ...notification, ...updates };

        // Show completion toast
        if (updated.status === 'completed' && notification.status !== 'completed') {
          toast({
            title: "Upload Complete",
            description: `${updated.title} uploaded successfully`,
            duration: 3000,
          });
        }

        // Show error toast
        if (updated.status === 'error' && notification.status !== 'error') {
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${updated.title}`,
            variant: "destructive",
            duration: 5000,
          });
        }

        return updated;
      }
      return notification;
    }));

    // Send WebSocket update
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'upload_update',
        uploadId: id,
        ...updates
      }));
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const totalActiveUploads = notifications.filter(n =>
    n.status === 'uploading' || n.status === 'processing' || n.status === 'pending'
  ).length;

  const globalProgress = notifications.length > 0
    ? notifications.reduce((sum, n) => sum + n.progress, 0) / notifications.length
    : 0;

  const contextValue: RealtimeUploadContextType = {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    clearAllNotifications,
    totalActiveUploads,
    globalProgress
  };

  return (
    <RealtimeUploadContext.Provider value={contextValue}>
      {children}
    </RealtimeUploadContext.Provider>
  );
}

interface RealtimeUploadNotificationsProps {
  className?: string;
}

export function RealtimeUploadNotifications({ className = "" }: RealtimeUploadNotificationsProps) {
  const { notifications, removeNotification, clearAllNotifications, totalActiveUploads } = useRealtimeUpload();
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand when there are active uploads
  useEffect(() => {
    if (totalActiveUploads > 0) {
      setIsExpanded(true);
    }
  }, [totalActiveUploads]);

  // Auto-remove completed notifications after 10 seconds
  useEffect(() => {
    for (const notification of notifications) {
      if (notification.status === 'completed') {
        const timeSinceCompletion = Date.now() - notification.timestamp;
        if (timeSinceCompletion > 10000) { // 10 seconds
          setTimeout(() => removeNotification(notification.id), 1000);
        }
      }
    }
  }, [notifications, removeNotification]);

  const getStatusIcon = (status: UploadNotification['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'uploading':
      case 'processing':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: UploadNotification['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'uploading':
      case 'processing':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-muted/10 border-border';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-80 ${className}`}>
      <Card className="bg-card/95 backdrop-blur-md border-border shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-accent" />
            <h3 className="font-semibold text-foreground">
              Upload Queue {totalActiveUploads > 0 && `(${totalActiveUploads} active)`}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? '−' : '+'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border last:border-b-0 ${getStatusColor(notification.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(notification.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground text-sm truncate">
                        {notification.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {notification.metadata && (
                      <div className="text-xs text-muted-foreground mb-2">
                        {notification.metadata.fileName} • {formatFileSize(notification.metadata.fileSize)}
                        {notification.metadata.category && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {notification.metadata.category}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    {(notification.status === 'uploading' || notification.status === 'processing') && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {notification.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                          </span>
                          <span className="text-foreground">{Math.round(notification.progress)}%</span>
                        </div>
                        <Progress value={notification.progress} className="h-1" />
                      </div>
                    )}

                    {/* Error Message */}
                    {notification.status === 'error' && notification.error && (
                      <p className="text-xs text-red-500 mt-1">{notification.error}</p>
                    )}

                    {/* Status Badge */}
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          notification.status === 'completed' ? 'text-green-500 border-green-500' :
                          notification.status === 'error' ? 'text-red-500 border-red-500' :
                          'text-blue-500 border-blue-500'
                        }`}
                      >
                        {notification.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {totalActiveUploads > 0 && (
          <div className="p-3 bg-blue-500/5 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              {totalActiveUploads} upload{totalActiveUploads !== 1 ? 's' : ''} in progress
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// No default export needed
