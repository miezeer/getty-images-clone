"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Download, Heart, Share2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WatermarkedImage from "./WatermarkedImage";
import DownloadModal from "./DownloadModal";
import ImageLightbox from "./ImageLightbox";

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

interface SearchFilters {
  contentType: string;
  sortBy: string;
  categories: string[];
}

interface InfiniteImageGalleryProps {
  searchQuery?: string;
  searchFilters?: SearchFilters;
  itemsPerPage?: number;
}

// Extended sample data to simulate infinite content
const generateSampleImages = (startId: number, count: number): ImageItem[] => {
  const categories = ["Nature", "Business", "Architecture", "Technology", "Food", "Fashion", "Sports", "Animals", "Travel"];
  const photographers = ["John Photography", "Business Stock", "Urban Photography", "Portrait Studio", "Workspace Images", "Tech Photography"];
  const baseUrls = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a",
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    "https://images.unsplash.com/photo-1434394354979-a235cd36269d",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1547036967-23d11aacaee0",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828"
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const baseUrl = baseUrls[index % baseUrls.length];
    return {
      id: id.toString(),
      url: `${baseUrl}?w=400&h=${300 + (index % 3) * 100}&fit=crop&ixid=${id}`,
      title: `Professional Image ${id} - ${categories[index % categories.length]}`,
      photographer: photographers[index % photographers.length],
      type: (index % 4 === 0 ? "video" : "photo") as "photo" | "video",
      width: 400,
      height: 300 + (index % 3) * 100,
      premium: index % 3 === 0,
      category: categories[index % categories.length],
      tags: [`tag${index}`, `category${index % 3}`, categories[index % categories.length].toLowerCase()]
    };
  });
};

function ImageCard({
  image,
  onDownload,
  onImageClick
}: {
  image: ImageItem;
  onDownload: (image: ImageItem) => void;
  onImageClick: (image: ImageItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer green-glow-hover border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onImageClick(image)}
      style={{ aspectRatio: `${image.width}/${image.height}` }}
    >
      <div className="relative w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        <WatermarkedImage
          src={image.url}
          alt={image.title}
          className={`w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          showWatermark={true}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Premium Badge */}
        {image.premium && (
          <Badge className="absolute top-2 left-2 bg-green-accent text-black font-semibold z-10">
            Premium
          </Badge>
        )}

        {/* Content Type Badge */}
        <Badge
          variant="outline"
          className="absolute top-2 right-2 bg-card/90 text-foreground border-border z-10"
        >
          {image.type === "photo" && "📷"}
          {image.type === "video" && <Play className="h-3 w-3" />}
          {image.type === "illustration" && "🎨"}
          {image.type === "vector" && "📐"}
        </Badge>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 z-20 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{image.title}</h3>
            <p className="text-xs opacity-80 mb-3">by {image.photographer}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-accent hover:bg-green-accent/90 text-black flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(image);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function InfiniteImageGallery({
  searchQuery,
  searchFilters = { contentType: "all", sortBy: "relevant", categories: [] },
  itemsPerPage = 20
}: InfiniteImageGalleryProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ImageItem | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const observerRef = useRef<IntersectionObserver>();
  const lastImageElementRef = useRef<HTMLDivElement | null>(null);

  // Initialize with first page
  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasNextPage(true);
    loadImages(1, true);
  }, [searchQuery, searchFilters]);

  const loadImages = useCallback(async (pageNumber: number, reset = false) => {
    if (loading) return;

    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startId = (pageNumber - 1) * itemsPerPage + 1;
    const newImages = generateSampleImages(startId, itemsPerPage);

    // Apply filters (simplified)
    let filteredImages = newImages;

    if (searchQuery) {
      filteredImages = filteredImages.filter(image =>
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (searchFilters.contentType !== "all") {
      filteredImages = filteredImages.filter(image => {
        if (searchFilters.contentType === "images") return image.type === "photo";
        if (searchFilters.contentType === "videos") return image.type === "video";
        if (searchFilters.contentType === "illustrations") return image.type === "illustration";
        if (searchFilters.contentType === "vectors") return image.type === "vector";
        return true;
      });
    }

    if (searchFilters.categories.length > 0) {
      filteredImages = filteredImages.filter(image =>
        searchFilters.categories.includes(image.category)
      );
    }

    // Sort images
    filteredImages.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case "newest":
          return Number(b.id) - Number(a.id);
        case "oldest":
          return Number(a.id) - Number(b.id);
        case "popular":
          return b.premium ? 1 : -1;
        default:
          return 0;
      }
    });

    if (reset) {
      setImages(filteredImages);
    } else {
      setImages(prev => [...prev, ...filteredImages]);
    }

    // Simulate finite data (stop loading after page 10)
    setHasNextPage(pageNumber < 10 && filteredImages.length === itemsPerPage);
    setLoading(false);
  }, [itemsPerPage, searchQuery, searchFilters]);

  // Intersection Observer for infinite scroll
  const lastImageElementRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          loadImages(nextPage);
          return nextPage;
        });
      }
    }, {
      rootMargin: '100px' // Start loading 100px before the element comes into view
    });

    if (node) observerRef.current.observe(node);
    lastImageElementRef.current = node;
  }, [loading, hasNextPage, loadImages]);

  const handleDownload = (image: ImageItem) => {
    setSelectedImage(image);
    setShowDownloadModal(true);
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
    setSelectedImage(null);
  };

  const handleImageClick = (image: ImageItem) => {
    setLightboxImage(image);
    setShowLightbox(true);
  };

  const handleCloseLightbox = () => {
    setShowLightbox(false);
    setLightboxImage(null);
  };

  const handleLightboxNavigate = (direction: 'prev' | 'next') => {
    if (!lightboxImage) return;

    const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
    let newIndex = currentIndex;

    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < images.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      setLightboxImage(images[newIndex]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Results Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          {searchQuery ? `Results for "${searchQuery}"` : "Browse Images"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {images.length.toLocaleString()} results found
          {searchFilters.categories.length > 0 && (
            <span className="ml-2 text-green-accent">
              in {searchFilters.categories.join(", ")}
            </span>
          )}
          {hasNextPage && (
            <span className="ml-2 text-muted-foreground">• Loading more...</span>
          )}
        </p>

        {/* Active filters display */}
        {(searchFilters.contentType !== "all" || searchFilters.categories.length > 0) && (
          <div className="flex gap-2 mt-2">
            {searchFilters.contentType !== "all" && (
              <Badge variant="secondary" className="bg-green-accent/20 text-green-accent border border-green-accent/30">
                {searchFilters.contentType}
              </Badge>
            )}
            {searchFilters.categories.map(category => (
              <Badge key={category} variant="secondary" className="bg-green-accent/10 text-green-accent border border-green-accent/30">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Masonry Grid */}
      {images.length > 0 ? (
        <>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid"
                ref={index === images.length - 1 ? lastImageElementRefCallback : null}
              >
                <ImageCard
                  image={image}
                  onDownload={handleDownload}
                  onImageClick={handleImageClick}
                />
              </div>
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading more images...</span>
              </div>
            </div>
          )}

          {/* End of Results */}
          {!hasNextPage && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You've reached the end of the results
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </div>
          )}
        </>
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading images...</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-muted-foreground text-4xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">No results found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="bg-green-accent/10 text-green-accent hover:bg-green-accent/20 border-green-accent"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Download Modal */}
      {selectedImage && (
        <DownloadModal
          image={{
            id: selectedImage.id,
            title: selectedImage.title,
            photographer: selectedImage.photographer,
            category: selectedImage.category,
            premium: selectedImage.premium,
            url: selectedImage.url,
            thumbnail_url: selectedImage.url
          }}
          isOpen={showDownloadModal}
          onClose={handleCloseDownloadModal}
          onDownload={(resolution) => {
            console.log('Downloaded:', selectedImage.title, 'Resolution:', resolution.name);
          }}
        />
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        image={lightboxImage}
        images={images}
        isOpen={showLightbox}
        onClose={handleCloseLightbox}
        onNavigate={handleLightboxNavigate}
      />
    </div>
  );
}
