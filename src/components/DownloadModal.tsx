"use client";

import type { User } from "@/types";
import { useState } from "react";
import { X, Download, Check, Lock, Star, Image as ImageIcon, Monitor, Smartphone, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AuthModal from "./AuthModal";

interface ResolutionOption {
  id: string;
  name: string;
  dimensions: string;
  size: string;
  fileSize: string;
  price: number;
  type: 'free' | 'premium' | 'purchase';
  icon: React.ElementType;
  popular?: boolean;
  recommended?: boolean;
}

interface ImageData {
  id: string;
  title: string;
  photographer: string;
  category: string;
  premium: boolean;
  url: string;
  thumbnail_url?: string;
}

interface DownloadModalProps {
  image: ImageData;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (resolution: ResolutionOption) => void;
}

const resolutionOptions: ResolutionOption[] = [
  {
    id: 'small',
    name: 'Small',
    dimensions: '640 × 480',
    size: 'Web & Social Media',
    fileSize: '0.3 MB',
    price: 0,
    type: 'free',
    icon: Smartphone,
  },
  {
    id: 'medium',
    name: 'Medium',
    dimensions: '1920 × 1080',
    size: 'Presentations & Web',
    fileSize: '1.8 MB',
    price: 0,
    type: 'free',
    icon: Monitor,
    popular: true,
  },
  {
    id: 'large',
    name: 'Large',
    dimensions: '3840 × 2160',
    size: 'Print & Commercial',
    fileSize: '8.5 MB',
    price: 9.99,
    type: 'premium',
    icon: ImageIcon,
    recommended: true,
  },
  {
    id: 'original',
    name: 'Original',
    dimensions: 'Full Resolution',
    size: 'Professional & Print',
    fileSize: '25.6 MB',
    price: 19.99,
    type: 'purchase',
    icon: Zap,
  },
];

export default function DownloadModal({ image, isOpen, onClose, onDownload }: DownloadModalProps) {
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>(resolutionOptions[1]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (resolution: ResolutionOption) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Track download analytics
      if (user) {
        await trackDownload(user.id, image.id, resolution);
      }

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Simulate file download
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${image.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${resolution.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadComplete(true);

      if (onDownload) {
        onDownload(resolution);
      }

      setTimeout(() => {
        setDownloadComplete(false);
        setIsDownloading(false);
        setDownloadProgress(0);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadClick = (resolution: ResolutionOption) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    handleDownload(resolution);
  };

  // Track download analytics
  const trackDownload = async (userId: string, imageId: string, resolution: ResolutionOption) => {
    try {
      const downloadData = {
        user_id: userId,
        image_id: imageId,
        download_type: resolution.type,
        resolution: resolution.name,
        price_paid: resolution.price
      };

      // Store in localStorage for demo (in real app would be database)
      const existingDownloads = JSON.parse(localStorage.getItem('user_downloads') || '[]');
      const newDownload = {
        ...downloadData,
        id: `dl_${Date.now()}`,
        downloaded_at: new Date().toISOString(),
        image_title: image.title,
        image_photographer: image.photographer
      };

      existingDownloads.unshift(newDownload);
      localStorage.setItem('user_downloads', JSON.stringify(existingDownloads.slice(0, 100))); // Keep last 100

      console.log('Download tracked:', newDownload);
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const handleAuthenticated = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
    // Automatically start download after authentication
    handleDownload(selectedResolution);
  };

  const getButtonText = (resolution: ResolutionOption) => {
    if (!user) return 'Sign in to Download';
    if (resolution.type === 'free') return 'Free Download';
    if (resolution.type === 'premium') return 'Premium Download';
    return `Buy for ${resolution.price}`;
  };

  const getButtonColor = (resolution: ResolutionOption) => {
    if (!user) return 'bg-blue-600 hover:bg-blue-700';
    if (resolution.type === 'free') return 'bg-green-accent hover:bg-green-accent/90';
    if (resolution.type === 'premium') return 'bg-blue-600 hover:bg-blue-700';
    return 'bg-purple-600 hover:bg-purple-700';
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <img
                src={image.thumbnail_url || image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{image.title}</h2>
              <p className="text-sm text-muted-foreground">by {image.photographer}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-accent/10 text-green-accent border-green-accent">
                  {image.category}
                </Badge>
                {image.premium && (
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
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

        {/* Content */}
        <div className="p-6">
          {!isDownloading && !downloadComplete ? (
            <>
              {/* Authentication Notice */}
              {!user && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-semibold text-foreground">Sign in required</h4>
                      <p className="text-sm text-muted-foreground">
                        Create a free account to download watermark-free, high-quality images
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Welcome */}
              {user && (
                <div className="mb-6 p-4 bg-green-accent/10 border border-green-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-accent/20 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Welcome back, {user.name}!</h4>
                      <p className="text-sm text-muted-foreground">
                        You can now download watermark-free images
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Choose Resolution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resolutionOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedResolution.id === option.id;

                    return (
                      <Card
                        key={option.id}
                        className={`relative p-4 cursor-pointer transition-all duration-200 border-2 ${
                          isSelected
                            ? 'border-green-accent bg-green-accent/5'
                            : 'border-border hover:border-green-accent/50'
                        }`}
                        onClick={() => setSelectedResolution(option)}
                      >
                        {option.popular && (
                          <Badge className="absolute -top-2 left-4 bg-blue-600 text-white">
                            Popular
                          </Badge>
                        )}
                        {option.recommended && (
                          <Badge className="absolute -top-2 right-4 bg-green-accent text-black">
                            Recommended
                          </Badge>
                        )}

                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${
                              isSelected ? 'bg-green-accent/20' : 'bg-muted'
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                isSelected ? 'text-green-accent' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{option.name}</h4>
                              <p className="text-sm text-muted-foreground">{option.dimensions}</p>
                              <p className="text-xs text-muted-foreground">{option.size}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {option.price === 0 ? 'Free' : `$${option.price}`}
                            </div>
                            <div className="text-xs text-muted-foreground">{option.fileSize}</div>
                            {option.type === 'premium' && (
                              <Lock className="h-3 w-3 text-purple-500 mt-1 ml-auto" />
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-green-accent rounded-full p-1">
                              <Check className="h-3 w-3 text-black" />
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* License Information */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">License Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {selectedResolution.type === 'free' && (
                    <>
                      <p>• Free for personal and commercial use</p>
                      <p>• Attribution not required but appreciated</p>
                      <p>• Cannot be resold or redistributed</p>
                    </>
                  )}
                  {selectedResolution.type === 'premium' && (
                    <>
                      <p>• Extended commercial license included</p>
                      <p>• Use in unlimited projects and campaigns</p>
                      <p>• No attribution required</p>
                      <p>• Print runs up to 500,000 copies</p>
                    </>
                  )}
                  {selectedResolution.type === 'purchase' && (
                    <>
                      <p>• Full exclusive commercial rights</p>
                      <p>• Unlimited usage and distribution</p>
                      <p>• Resale and modification rights included</p>
                      <p>• Lifetime license with no restrictions</p>
                    </>
                  )}
                </div>
              </div>

              {/* Download Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>File format: JPEG</p>
                  <p>Color space: sRGB</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDownloadClick(selectedResolution)}
                    className={`${getButtonColor(selectedResolution)} text-white font-semibold px-8`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {getButtonText(selectedResolution)}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Download Progress */
            <div className="text-center py-12">
              {!downloadComplete ? (
                <>
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (downloadProgress / 100) * 283}
                        className="text-green-accent transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold text-foreground">
                        {Math.round(downloadProgress)}%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Preparing your download...
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedResolution.name} resolution • {selectedResolution.fileSize}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto mb-6 bg-green-accent/20 rounded-full flex items-center justify-center">
                    <Check className="h-12 w-12 text-green-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Download Complete!
                  </h3>
                  <p className="text-muted-foreground">
                    Your image has been downloaded successfully.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
        defaultMode="signup"
      />
    </div>
    </>
  );
}
