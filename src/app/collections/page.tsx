"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Search, Eye, Download, Heart, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

interface Collection {
  id: string;
  title: string;
  description: string;
  imageCount: number;
  coverImage: string;
  tags: string[];
  curator: string;
  views: number;
  downloads: number;
  featured: boolean;
}

const sampleCollections: Collection[] = [
  {
    id: "1",
    title: "Modern Business Essentials",
    description: "Contemporary business photography for the modern workplace",
    imageCount: 145,
    coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600",
    tags: ["business", "corporate", "office", "team"],
    curator: "Miezeer Team",
    views: 12500,
    downloads: 3240,
    featured: true
  },
  {
    id: "2",
    title: "Urban Architecture",
    description: "Stunning architectural photography from cities around the world",
    imageCount: 89,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
    tags: ["architecture", "urban", "city", "buildings"],
    curator: "Architecture Pro",
    views: 8750,
    downloads: 1890,
    featured: true
  },
  {
    id: "3",
    title: "Nature's Beauty",
    description: "Breathtaking landscapes and natural wonders",
    imageCount: 230,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    tags: ["nature", "landscape", "mountains", "outdoors"],
    curator: "Nature Photos",
    views: 15600,
    downloads: 4320,
    featured: false
  },
  {
    id: "4",
    title: "Technology & Innovation",
    description: "Cutting-edge technology and innovation imagery",
    imageCount: 120,
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
    tags: ["technology", "innovation", "digital", "future"],
    curator: "Tech Vision",
    views: 9800,
    downloads: 2150,
    featured: false
  },
  {
    id: "5",
    title: "Food & Culinary",
    description: "Mouth-watering food photography for culinary projects",
    imageCount: 176,
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600",
    tags: ["food", "culinary", "restaurant", "cooking"],
    curator: "Culinary Arts",
    views: 11200,
    downloads: 2890,
    featured: true
  },
  {
    id: "6",
    title: "Fashion Forward",
    description: "Contemporary fashion and style photography",
    imageCount: 98,
    coverImage: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=600",
    tags: ["fashion", "style", "portrait", "model"],
    curator: "Style Studio",
    views: 7400,
    downloads: 1670,
    featured: false
  }
];

function CollectionCard({ collection }: { collection: Collection }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden bg-card border-border transition-all duration-300 cursor-pointer green-glow-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={collection.coverImage}
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Featured Badge */}
        {collection.featured && (
          <Badge className="absolute top-3 left-3 bg-green-accent text-black font-semibold">
            Featured
          </Badge>
        )}

        {/* Stats Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-sm mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {collection.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {collection.downloads.toLocaleString()}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full bg-green-accent hover:bg-green-accent/90 text-black"
            >
              View Collection
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-1">{collection.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{collection.description}</p>
            <p className="text-sm text-green-accent">{collection.imageCount} images</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {collection.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-green-accent/10 text-green-accent border border-green-accent/30"
            >
              {tag}
            </Badge>
          ))}
          {collection.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="bg-muted/50 text-muted-foreground"
            >
              +{collection.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Curator */}
        <div className="text-xs text-muted-foreground">
          Curated by {collection.curator}
        </div>
      </div>
    </Card>
  );
}

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredCollections = sampleCollections.filter(collection => {
    const matchesSearch = searchQuery === "" ||
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === "all" ||
      (selectedFilter === "featured" && collection.featured);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Curated Collections
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover professionally curated image collections for every project need
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="p-6 bg-card border-border glass-effect">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("all")}
                  className={selectedFilter === "all" ? "bg-green-accent text-black" : "border-border text-foreground hover:bg-green-accent/10"}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === "featured" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("featured")}
                  className={selectedFilter === "featured" ? "bg-green-accent text-black" : "border-border text-foreground hover:bg-green-accent/10"}
                >
                  Featured
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {selectedFilter === "featured" ? "Featured Collections" : "All Collections"}
          </h2>
          <p className="text-muted-foreground">
            {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📁</div>
            <h3 className="text-xl font-medium text-foreground mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="bg-green-accent/10 text-green-accent hover:bg-green-accent/20 border-green-accent"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredCollections.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="px-8 border-green-accent text-green-accent hover:bg-green-accent hover:text-black">
              Load More Collections
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
