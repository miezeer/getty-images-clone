// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'contributor' | 'user';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  downloads: number;
  uploads: number;
  revenue: number;
  metadata?: {
    lastLoginIP?: string;
    emailVerified?: boolean;
    twoFactorEnabled?: boolean;
  };
}

// Image and content types
export interface ImageItem {
  id: string;
  url: string;
  title: string;
  photographer: string;
  type: 'photo' | 'video' | 'illustration' | 'vector';
  width: number;
  height: number;
  premium: boolean;
  downloads: number;
  tags: string[];
  createdAt: string;
  fileSize: number;
  resolution: string;
  category: string;
  description?: string;
  price?: number;
  license: string;
  faces?: Face[];
}

// Face detection types
export interface Face {
  id: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  person?: Person;
  imageId: string;
}

export interface Person {
  id: string;
  name: string;
  imageCount: number;
  confidence: number;
}

// Download types
export interface Download {
  id: string;
  user_id: string;
  image_id: string;
  image_title: string;
  image_url: string;
  resolution: string;
  price_paid: number;
  download_date: string;
  license_type: string;
}

// Detection history types
export interface DetectionHistoryItem {
  id: string;
  imageId: string;
  imageName: string;
  facesDetected: number;
  personsRecognized: number;
  processedAt: string;
  confidence: number;
  status: 'success' | 'failed' | 'processing';
}

// Upload types
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  status: 'uploading' | 'completed' | 'failed';
  progress?: number;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  imageCount: number;
  location?: string;
}

// Error handling types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface AppError {
  message: string;
  code?: string;
  timestamp: string;
  stack?: string;
}

// Analytics types
export interface AnalyticsData {
  totalImages: number;
  totalUsers: number;
  dailyDownloads: number;
  monthlyRevenue: number;
  topCategories: Array<{
    name: string;
    count: number;
  }>;
}

// Table types
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
