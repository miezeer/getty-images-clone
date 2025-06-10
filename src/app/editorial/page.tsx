"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Clock, Globe, Bookmark, Share2, ArrowRight, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

interface EditorialStory {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishDate: string;
  location: string;
  imageCount: number;
  coverImage: string;
  photographer: string;
  agency: string;
  breaking: boolean;
  featured: boolean;
}

const sampleStories: EditorialStory[] = [
  {
    id: "1",
    title: "Global Climate Summit Reaches Historic Agreement",
    summary: "World leaders unite on unprecedented climate action plan with binding commitments",
    category: "Politics",
    publishDate: "2 hours ago",
    location: "Geneva, Switzerland",
    imageCount: 47,
    coverImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=600",
    photographer: "International News",
    agency: "Miezeer Editorial",
    breaking: true,
    featured: true
  },
  {
    id: "2",
    title: "Tech Innovation Awards Ceremony",
    summary: "Industry pioneers recognized for breakthrough achievements in artificial intelligence",
    category: "Technology",
    publishDate: "4 hours ago",
    location: "Silicon Valley, CA",
    imageCount: 89,
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    photographer: "Tech Reporter",
    agency: "Innovation Press",
    breaking: false,
    featured: true
  },
  {
    id: "3",
    title: "International Film Festival Opens",
    summary: "Celebrities and filmmakers gather for the most prestigious cinema celebration",
    category: "Entertainment",
    publishDate: "6 hours ago",
    location: "Cannes, France",
    imageCount: 156,
    coverImage: "https://images.unsplash.com/photo-1489599162367-4e4bcdb4c80e?w=600",
    photographer: "Celebrity Photos",
    agency: "Entertainment Weekly",
    breaking: false,
    featured: false
  },
  {
    id: "4",
    title: "Olympic Athletes Train for Paris 2024",
    summary: "Elite athletes prepare for the upcoming Olympic Games with intensive training",
    category: "Sports",
    publishDate: "8 hours ago",
    location: "Paris, France",
    imageCount: 234,
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    photographer: "Sports Action",
    agency: "Olympic News",
    breaking: false,
    featured: true
  },
  {
    id: "5",
    title: "Natural Disaster Relief Efforts",
    summary: "International aid organizations coordinate massive humanitarian response",
    category: "World News",
    publishDate: "12 hours ago",
    location: "Southeast Asia",
    imageCount: 78,
    coverImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600",
    photographer: "Humanitarian Reporter",
    agency: "World Press",
    breaking: false,
    featured: false
  },
  {
    id: "6",
    title: "Fashion Week Highlights",
    summary: "Designers showcase sustainable fashion trends for the upcoming season",
    category: "Fashion",
    publishDate: "1 day ago",
    location: "Milan, Italy",
    imageCount: 145,
    coverImage: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=600",
    photographer: "Fashion Editorial",
    agency: "Style International",
    breaking: false,
    featured: false
  }
];

function StoryCard({ story }: { story: EditorialStory }) {
  return (
    <Card className="group relative overflow-hidden bg-card border-border transition-all duration-300 cursor-pointer green-glow-hover">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Breaking News Badge */}
        {story.breaking && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white font-semibold animate-pulse">
            Breaking
          </Badge>
        )}

        {/* Featured Badge */}
        {story.featured && !story.breaking && (
          <Badge className="absolute top-3 left-3 bg-green-accent text-black font-semibold">
            Featured
          </Badge>
        )}

        {/* Category Badge */}
        <Badge variant="outline" className="absolute top-3 right-3 bg-background/90 text-foreground border-border">
          {story.category}
        </Badge>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-3">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 flex-1">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full bg-green-accent hover:bg-green-accent/90 text-black"
            >
              <Newspaper className="h-4 w-4 mr-2" />
              View Story
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">{story.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{story.summary}</p>
        </div>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {story.publishDate}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            {story.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-green-accent">
            <Newspaper className="h-4 w-4" />
            {story.imageCount} editorial photos
          </div>
        </div>

        {/* Source */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          <div>Photo by {story.photographer}</div>
          <div className="font-medium">{story.agency}</div>
        </div>
      </div>
    </Card>
  );
}

export default function EditorialPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");

  const categories = ["all", "Politics", "Technology", "Entertainment", "Sports", "World News", "Fashion"];
  const timeFilters = ["all", "1hour", "24hours", "week", "month"];

  const getTimeFilterText = (filter: string) => {
    switch (filter) {
      case "1hour": return "Last Hour";
      case "24hours": return "Last 24 Hours";
      case "week": return "Last Week";
      case "month": return "Last Month";
      default: return "All Time";
    }
  };

  const filteredStories = sampleStories.filter(story => {
    const matchesSearch = searchQuery === "" ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;

    // For demo purposes, we'll just filter based on the text
    const matchesTime = selectedTime === "all" ||
      (selectedTime === "1hour" && story.publishDate.includes("hour")) ||
      (selectedTime === "24hours" && (story.publishDate.includes("hour") || story.publishDate.includes("today"))) ||
      (selectedTime === "week" && !story.publishDate.includes("day")) ||
      (selectedTime === "month");

    return matchesSearch && matchesCategory && matchesTime;
  });

  const breakingStories = filteredStories.filter(story => story.breaking);
  const featuredStories = filteredStories.filter(story => story.featured && !story.breaking);
  const regularStories = filteredStories.filter(story => !story.featured && !story.breaking);

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Editorial Photography
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with professional editorial photography from breaking news to feature stories worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="p-6 bg-card border-border glass-effect">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Search Stories</h3>
                <Input
                  placeholder="Search editorial stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ?
                        "bg-green-accent text-black" :
                        "border-border text-foreground hover:bg-green-accent/10"
                      }
                    >
                      {category === "all" ? "All" : category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Filter */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Time Period</h3>
                <div className="flex flex-wrap gap-2">
                  {timeFilters.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ?
                        "bg-green-accent text-black" :
                        "border-border text-foreground hover:bg-green-accent/10"
                      }
                    >
                      {getTimeFilterText(time)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Breaking News Section */}
        {breakingStories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-red-500 text-white animate-pulse">Breaking</Badge>
              <h2 className="text-2xl font-semibold text-foreground">Breaking News</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breakingStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Stories Section */}
        {featuredStories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}

        {/* All Stories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {selectedCategory === "all" ? "All Stories" : `${selectedCategory} Stories`}
            </h2>
            <p className="text-muted-foreground">
              {filteredStories.length} stor{filteredStories.length !== 1 ? 'ies' : 'y'} found
            </p>
          </div>

          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(breakingStories.length === 0 && featuredStories.length === 0 ?
                filteredStories : regularStories).map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">📰</div>
              <h3 className="text-xl font-medium text-foreground mb-2">No stories found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedTime("all");
                }}
                className="bg-green-accent/10 text-green-accent hover:bg-green-accent/20 border-green-accent"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredStories.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline" size="lg" className="px-8 border-green-accent text-green-accent hover:bg-green-accent hover:text-black">
              Load More Stories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
