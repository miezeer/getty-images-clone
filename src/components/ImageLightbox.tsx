"use client";

import { useState, useEffect } from "react";
import { X, Download, Heart, Share2, ShoppingCart, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WatermarkedImage from "./WatermarkedImage";
import DownloadModal from "./DownloadModal";

interface ImageItem {
  id: string;
  url: string;
  title: string;
  photographer: string;
  type: "photo" | "video" | "illustration" | "vector";
  width: number;
  height: number;
  premium: boolean;
  category: string;
  tags: string[];
}

interface ImageLightboxProps {
  image: ImageItem | null;
  images: ImageItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export default function ImageLightbox({
  image,
  images,
  isOpen,
  onClose,
  onNavigate
}: ImageLightboxProps) {
  const [showMetadata, setShowMetadata] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  // Enhanced zoom settings
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.25;
  const WHEEL_ZOOM_SENSITIVITY = 0.001;

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [image?.id]);

  // Keyboard navigation with enhanced zoom controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onNavigate?.('prev');
          break;
        case 'ArrowRight':
          onNavigate?.('next');
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
          break;
        case '-':
          e.preventDefault();
          setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
          break;
        case '0':
          e.preventDefault();
          setZoomLevel(1);
          setImagePosition({ x: 0, y: 0 });
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          // Fit to screen
          setZoomLevel(0.9);
          setImagePosition({ x: 0, y: 0 });
          break;
        case 'i':
        case 'I':
          setShowMetadata(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !image) return null;

  const currentIndex = images.findIndex(img => img.id === image.id);
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < images.length - 1;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    setZoomLevel(0.9);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  // Enhanced double-click zoom functionality
  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (zoomLevel === 1) {
      setZoomLevel(2);
    } else {
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  // Touch support for mobile double-tap
  const handleImageTouch = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected - create a synthetic mouse event
      const touch = e.touches[0] || e.changedTouches[0];
      const syntheticEvent = {
        preventDefault: () => e.preventDefault(),
        clientX: touch?.clientX || 0,
        clientY: touch?.clientY || 0,
        target: e.target
      } as React.MouseEvent;
      handleImageDoubleClick(syntheticEvent);
    }
    setLastTap(currentTime);
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  // Enhanced wheel zoom with better sensitivity and bounds
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaY = e.deltaY;
    const zoomDelta = -deltaY * WHEEL_ZOOM_SENSITIVITY * zoomLevel;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + zoomDelta));

    if (newZoom !== zoomLevel) {
      // Zoom towards mouse position
      const scale = newZoom / zoomLevel;
      const newX = imagePosition.x + (mouseX - centerX) * (1 - scale);
      const newY = imagePosition.y + (mouseY - centerY) * (1 - scale);

      setZoomLevel(newZoom);
      setImagePosition({ x: newX, y: newY });
    }
  };

  // Get zoom percentage for display
  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex">
      {/* Main Image Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Navigation Buttons */}
        {canNavigatePrev && (
          <Button
            variant="secondary"
            size="lg"
            className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
            onClick={() => onNavigate?.('prev')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {canNavigateNext && (
          <Button
            variant="secondary"
            size="lg"
            className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
            onClick={() => onNavigate?.('next')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Image Container */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center"
          style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          onMouseDown={handleImageMouseDown}
          onMouseMove={handleImageMouseMove}
          onMouseUp={handleImageMouseUp}
          onMouseLeave={handleImageMouseUp}
          onWheel={handleWheel}
          onDoubleClick={handleImageDoubleClick}
          onTouchEnd={handleImageTouch}
        >
          <WatermarkedImage
            src={image.url}
            alt={image.title}
            className={`max-w-full max-h-full object-contain lightbox-image select-none ${
              isDragging ? 'dragging' : 'zoom-transition'
            }`}
            style={{
              transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            showWatermark={true}
          />
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
          {currentIndex + 1} of {images.length}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
            onClick={() => setShowMetadata(!showMetadata)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          {/* Zoom Percentage Indicator */}
          <div className="bg-black/60 text-white px-3 py-1 rounded text-xs text-center backdrop-blur-sm min-w-[60px]">
            {zoomPercentage}%
          </div>

          {/* Zoom Control Buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= MIN_ZOOM}
              title="Zoom Out (-)"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
              onClick={handleFitToScreen}
              title="Fit to Screen (F)"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
              onClick={handleResetZoom}
              title="Reset Zoom (0)"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= MAX_ZOOM}
              title="Zoom In (+)"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata Sidebar */}
      {showMetadata && (
        <div className="w-80 bg-card border-l border-border flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                  {image.title}
                </h2>
                <p className="text-muted-foreground">by {image.photographer}</p>
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

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {image.premium && (
                <Badge className="bg-green-accent text-black font-semibold">
                  Premium
                </Badge>
              )}
              <Badge variant="outline" className="bg-card text-foreground border-border">
                {image.type === "photo" && "📷 Photo"}
                {image.type === "video" && "🎥 Video"}
                {image.type === "illustration" && "🎨 Illustration"}
                {image.type === "vector" && "📐 Vector"}
              </Badge>
              <Badge variant="outline" className="bg-card text-foreground border-border">
                {image.category}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-green-accent hover:bg-green-accent/90 text-black flex-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="border-border">
                <ShoppingCart className="h-4 w-4 mr-2" />
                License
              </Button>
              <Button variant="outline" className="border-border">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="border-border">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Image Details */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Image Specifications */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Image Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="text-foreground">{image.width} × {image.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="text-foreground">JPEG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File size:</span>
                    <span className="text-foreground">2.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color space:</span>
                    <span className="text-foreground">sRGB</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-muted hover:bg-green-accent/20 hover:text-green-accent cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Licensing Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Licensing</h3>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standard License:</span>
                        <span className="text-foreground font-medium">$49</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Extended License:</span>
                        <span className="text-foreground font-medium">$199</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Includes commercial use, unlimited print runs, and digital distribution.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Similar Images */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Similar Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((similarImage) => (
                    <div key={similarImage.id} className="aspect-square relative group cursor-pointer">
                      <WatermarkedImage
                        src={similarImage.url}
                        alt={similarImage.title}
                        className="w-full h-full object-cover rounded"
                        showWatermark={false}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                        <span className="text-white text-xs text-center px-2">
                          {similarImage.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white p-3 rounded text-xs max-w-xs backdrop-blur-sm">
        <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
        <div className="space-y-1">
          <div>ESC: Close • ←→: Navigate • +/-: Zoom</div>
          <div>0: Reset • F: Fit • I: Toggle info</div>
          <div>Double-click: Zoom • Mouse wheel: Zoom</div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <DownloadModal
          image={{
            id: image.id,
            title: image.title,
            photographer: image.photographer,
            category: image.category,
            premium: image.premium,
            url: image.url,
            thumbnail_url: image.url
          }}
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          onDownload={(resolution) => {
            console.log('Downloaded:', image.title, 'Resolution:', resolution.name);
            setShowDownloadModal(false);
          }}
        />
      )}
    </div>
  );
}
