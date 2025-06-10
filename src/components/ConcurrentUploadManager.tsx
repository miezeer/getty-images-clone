"use client";

import { useRef, useCallback } from "react";

interface UploadTask {
  id: string;
  file: File;
  uploadFn: (file: File) => Promise<unknown>;
  onProgress?: (progress: number) => void;
  onComplete?: (result: unknown) => void;
  onError?: (error: Error) => void;
}

interface ConcurrentUploadManagerOptions {
  maxConcurrency?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class ConcurrentUploadManager {
  private maxConcurrency: number;
  private retryAttempts: number;
  private retryDelay: number;
  private activeUploads: Set<string> = new Set();
  private uploadQueue: UploadTask[] = [];
  private completedUploads: Set<string> = new Set();
  private failedUploads: Map<string, Error> = new Map();

  constructor(options: ConcurrentUploadManagerOptions = {}) {
    this.maxConcurrency = options.maxConcurrency || 3;
    this.retryAttempts = options.retryAttempts || 2;
    this.retryDelay = options.retryDelay || 1000;
  }

  addUpload(task: UploadTask): void {
    this.uploadQueue.push(task);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.activeUploads.size >= this.maxConcurrency || this.uploadQueue.length === 0) {
      return;
    }

    const task = this.uploadQueue.shift();
    if (!task) return;

    this.activeUploads.add(task.id);
    this.executeUpload(task);
  }

  private async executeUpload(task: UploadTask, attempt = 0): Promise<void> {
    try {
      const result = await this.uploadWithProgress(task);
      this.completedUploads.add(task.id);
      task.onComplete?.(result);
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Upload failed');

      if (attempt < this.retryAttempts) {
        // Retry with exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeUpload(task, attempt + 1);
      } else {
        this.failedUploads.set(task.id, uploadError);
        task.onError?.(uploadError);
      }
    } finally {
      this.activeUploads.delete(task.id);
      // Process next item in queue
      this.processQueue();
    }
  }

  private async uploadWithProgress(task: UploadTask): Promise<unknown> {
    // Simulate file upload with progress tracking
    const simulateProgress = (onProgress?: (progress: number) => void) => {
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            resolve(progress);
          }
          onProgress?.(Math.round(progress));
        }, 200);
      });
    };

    // Start progress simulation
    const progressPromise = simulateProgress(task.onProgress);

    // Execute actual upload
    const uploadPromise = task.uploadFn(task.file);

    // Wait for both to complete
    const [, result] = await Promise.all([progressPromise, uploadPromise]);
    return result;
  }

  getStats() {
    return {
      active: this.activeUploads.size,
      queued: this.uploadQueue.length,
      completed: this.completedUploads.size,
      failed: this.failedUploads.size,
      total: this.activeUploads.size + this.uploadQueue.length + this.completedUploads.size + this.failedUploads.size
    };
  }

  clear(): void {
    this.uploadQueue.length = 0;
    this.activeUploads.clear();
    this.completedUploads.clear();
    this.failedUploads.clear();
  }

  pause(): void {
    // Implementation for pausing uploads
  }

  resume(): void {
    // Implementation for resuming uploads
    this.processQueue();
  }
}

export function useConcurrentUploadManager(options?: ConcurrentUploadManagerOptions) {
  const managerRef = useRef<ConcurrentUploadManager>();

  if (!managerRef.current) {
    managerRef.current = new ConcurrentUploadManager(options);
  }

  const addUpload = useCallback((task: UploadTask) => {
    managerRef.current?.addUpload(task);
  }, []);

  const getStats = useCallback(() => {
    return managerRef.current?.getStats() || {
      active: 0,
      queued: 0,
      completed: 0,
      failed: 0,
      total: 0
    };
  }, []);

  const clear = useCallback(() => {
    managerRef.current?.clear();
  }, []);

  const pause = useCallback(() => {
    managerRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    managerRef.current?.resume();
  }, []);

  return {
    addUpload,
    getStats,
    clear,
    pause,
    resume
  };
}
