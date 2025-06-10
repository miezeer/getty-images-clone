"use client";

import { useState, useEffect } from "react";
import { Upload, Clock, CheckCircle, AlertCircle, Activity, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRealtimeUpload } from "@/components/RealtimeUploadManager";

interface RealtimeUploadDashboardProps {
  className?: string;
}

export default function RealtimeUploadDashboard({ className = "" }: RealtimeUploadDashboardProps) {
  const { notifications, totalActiveUploads, globalProgress } = useRealtimeUpload();
  const [uploadRate, setUploadRate] = useState(0);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  // Calculate upload statistics
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const lastMinute = now - 60000; // 1 minute ago

      // Count uploads completed in the last minute
      const recentUploads = notifications.filter(
        notification =>
          notification.status === 'completed' &&
          notification.timestamp > lastMinute
      );

      setUploadRate(recentUploads.length);

      // Calculate total uploaded files
      const completed = notifications.filter(n => n.status === 'completed');
      setTotalUploaded(completed.length);

      // Calculate average speed (files per minute)
      const oldestUpload = Math.min(...notifications.map(n => n.timestamp));
      const timeElapsed = (now - oldestUpload) / 60000; // minutes
      setAverageSpeed(timeElapsed > 0 ? completed.length / timeElapsed : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [notifications]);

  const pendingUploads = notifications.filter(n => n.status === 'pending').length;
  const processingUploads = notifications.filter(n => n.status === 'processing').length;
  const uploadingUploads = notifications.filter(n => n.status === 'uploading').length;
  const completedUploads = notifications.filter(n => n.status === 'completed').length;
  const failedUploads = notifications.filter(n => n.status === 'error').length;

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} files/min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Live Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Uploads */}
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{totalActiveUploads}</h3>
              <p className="text-sm text-muted-foreground">Active Uploads</p>
              {totalActiveUploads > 0 && (
                <div className="mt-2">
                  <Progress value={globalProgress} className="h-1" />
                  <p className="text-xs text-blue-500 mt-1">{Math.round(globalProgress)}% complete</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Upload Rate */}
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{uploadRate}</h3>
              <p className="text-sm text-muted-foreground">Files/Minute</p>
              <p className="text-xs text-green-500">Current rate</p>
            </div>
          </div>
        </Card>

        {/* Total Completed */}
        <Card className="p-4 bg-gradient-to-br from-green-accent/10 to-green-accent/5 border-green-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-accent/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{completedUploads}</h3>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xs text-green-accent">Total uploaded</p>
            </div>
          </div>
        </Card>

        {/* Average Speed */}
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{formatSpeed(averageSpeed)}</h3>
              <p className="text-sm text-muted-foreground">Avg Speed</p>
              <p className="text-xs text-purple-500">Overall rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Queue Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-green-accent" />
          Real-time Upload Queue
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{pendingUploads}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{uploadingUploads}</div>
            <div className="text-sm text-muted-foreground">Uploading</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{processingUploads}</div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{completedUploads}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{failedUploads}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>

        {/* Overall Progress */}
        {totalActiveUploads > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-foreground">{Math.round(globalProgress)}%</span>
            </div>
            <Progress value={globalProgress} className="h-2" />
          </div>
        )}

        {/* Live Status Indicators */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${totalActiveUploads > 0 ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm text-muted-foreground">
              {totalActiveUploads > 0 ? 'Live uploads in progress' : 'No active uploads'}
            </span>
          </div>

          {uploadRate > 0 && (
            <Badge variant="outline" className="bg-green-accent/10 text-green-accent border-green-accent">
              {uploadRate} uploads/min
            </Badge>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      {notifications.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    notification.status === 'completed' ? 'bg-green-500' :
                    notification.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm text-foreground truncate max-w-48">
                    {notification.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
