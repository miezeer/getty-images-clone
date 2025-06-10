"use client";

import { useState } from "react";
import { Play, Download, Heart, Share2, ShoppingCart } from "lucide-react";
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

interface ImageGalleryProps {
  images?: ImageItem[];
  searchQuery?: string;
  searchFilters?: SearchFilters;
}

// Enhanced sample data with categories and more variety
const sampleImages: ImageItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    title: "Beautiful mountain landscape at sunset",
    photographer: "John Photography",
    type: "photo",
    width: 400,
    height: 600,
    premium: false,
    category: "Nature",
    tags: ["mountain", "sunset", "landscape", "nature", "scenic"]
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
    title: "Modern business team meeting",
    photographer: "Business Stock",
    type: "photo",
    width: 400,
    height: 300,
    premium: true,
    category: "Business",
    tags: ["business", "meeting", "team", "office", "corporate"]
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    title: "City skyline with financial district",
    photographer: "Urban Photography",
    type: "photo",
    width: 400,
    height: 500,
    premium: false,
    category: "Architecture",
    tags: ["city", "skyline", "architecture", "urban", "buildings"]
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    title: "Portrait of professional businessman",
    photographer: "Portrait Studio",
    type: "photo",
    width: 400,
    height: 600,
    premium: true,
    category: "People",
    tags: ["business", "portrait", "professional", "people", "corporate"]
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    title: "Creative workspace with laptop",
    photographer: "Workspace Images",
    type: "photo",
    width: 400,
    height: 400,
    premium: false,
    category: "Technology",
    tags: ["workspace", "laptop", "technology", "office", "creative"]
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
    title: "Woman using smartphone technology",
    photographer: "Tech Photography",
    type: "photo",
    width: 400,
    height: 500,
    premium: false,
    category: "Technology",
    tags: ["smartphone", "technology", "people", "communication", "mobile"]
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400",
    title: "Food and cooking ingredients",
    photographer: "Culinary Arts",
    type: "photo",
    width: 400,
    height: 600,
    premium: true,
    category: "Food",
    tags: ["food", "cooking", "ingredients", "kitchen", "culinary"]
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    title: "Abstract geometric pattern",
    photographer: "Design Studio",
    type: "illustration",
    width: 400,
    height: 400,
    premium: false,
    category: "Design",
    tags: ["abstract", "geometric", "pattern", "design", "illustration"]
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=400",
    title: "Fashion portrait with dramatic lighting",
    photographer: "Style Photography",
    type: "photo",
    width: 400,
    height: 600,
    premium: true,
    category: "Fashion",
    tags: ["fashion", "portrait", "style", "lighting", "dramatic"]
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    title: "Sports action shot of runner",
    photographer: "Sports Photography",
    type: "photo",
    width: 400,
    height: 500,
    premium: false,
    category: "Sports",
    tags: ["sports", "running", "action", "athlete", "fitness"]
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
    title: "Wild lion in African safari",
    photographer: "Wildlife Photos",
    type: "photo",
    width: 400,
    height: 600,
    premium: true,
    category: "Animals",
    tags: ["animals", "lion", "wildlife", "safari", "nature"]
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
    title: "Tropical beach vacation destination",
    photographer: "Travel Stock",
    type: "photo",
    width: 400,
    height: 300,
    premium: false,
    category: "Travel",
    tags: ["travel", "beach", "vacation", "tropical", "paradise"]
  }
];

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

  return (
    <Card
      className="group relative overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer green-glow-hover border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onImageClick(image)}
      style={{ aspectRatio: `${image.width}/${image.height}` }}
    >
      <div className="relative w-full h-full">
        <WatermarkedImage
          src={image.url}
          alt={image.title}
          className="w-full h-full"
          showWatermark={true}
        />

        {/* Premium Badge */}
        {image.premium && (
          <Badge className="absolute top-2 left-2 bg-green-accent text-black font-semibold">
            Premium
          </Badge>
        )}

        {/* Content Type Badge */}
        <Badge
          variant="outline"
          className="absolute top-2 right-2 bg-card/90 text-foreground border-border"
        >
          {image.type === "photo" && "📷"}
          {image.type === "video" && <Play className="h-3 w-3" />}
          {image.type === "illustration" && "🎨"}
          {image.type === "vector" && "📐"}
        </Badge>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
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

export default function ImageGallery({
  images = sampleImages,
  searchQuery,
  searchFilters = { contentType: "all", sortBy: "relevant", categories: [] }
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ImageItem | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

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

    const currentIndex = sortedImages.findIndex(img => img.id === lightboxImage.id);
    let newIndex = currentIndex;

    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < sortedImages.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      setLightboxImage(sortedImages[newIndex]);
    }
  };

  // Filter images based on search criteria
  const filteredImages = images.filter(image => {
    // Text search in title, photographer, tags, and category
    const searchText = searchQuery?.toLowerCase() || "";
    const matchesText = !searchText ||
      image.title.toLowerCase().includes(searchText) ||
      image.photographer.toLowerCase().includes(searchText) ||
      image.category.toLowerCase().includes(searchText) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchText));

    // Content type filter
    const matchesContentType = searchFilters.contentType === "all" ||
      (searchFilters.contentType === "images" && image.type === "photo") ||
      (searchFilters.contentType === "videos" && image.type === "video") ||
      (searchFilters.contentType === "illustrations" && image.type === "illustration") ||
      (searchFilters.contentType === "vectors" && image.type === "vector");

    // Category filter
    const matchesCategories = searchFilters.categories.length === 0 ||
      searchFilters.categories.includes(image.category);

    return matchesText && matchesContentType && matchesCategories;
  });

  // Sort images based on sort criteria
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (searchFilters.sortBy) {
      case "newest":
        return Number(b.id) - Number(a.id); // Assuming higher ID = newer
      case "oldest":
        return Number(a.id) - Number(b.id);
      case "popular":
        // For demo, shuffle but keep premium first
        return b.premium ? 1 : -1;
      default:
        // Default relevance: exact title matches first, then partial matches
        if (searchQuery) {
          const aRelevance = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          const bRelevance = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          return bRelevance - aRelevance;
        }
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Results Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          {searchQuery ? `Results for "${searchQuery}"` : "Browse Images"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {sortedImages.length.toLocaleString()} results found
          {searchFilters.categories.length > 0 && (
            <span className="ml-2 text-green-accent">
              in {searchFilters.categories.join(", ")}
            </span>
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
      {sortedImages.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          {sortedImages.map((image) => (
            <div key={image.id} className="break-inside-avoid">
              <ImageCard
                image={image}
                onDownload={handleDownload}
                onImageClick={handleImageClick}
              />
            </div>
          ))}
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

      {/* Load More */}
      {sortedImages.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Images ({sortedImages.length} shown)
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
            // Here you would integrate with your download tracking system
          }}
        />
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        image={lightboxImage}
        images={sortedImages}
        isOpen={showLightbox}
        onClose={handleCloseLightbox}
        onNavigate={handleLightboxNavigate}
      />
    </div>
  );
}
