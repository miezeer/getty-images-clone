"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Calendar, MapPin, Users, Clock, Camera, ArrowRight, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import EventImageUploadModal from "@/components/EventImageUploadModal";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  url?: string;
  thumbnailUrl?: string;
  metadata: {
    title: string;
    photographer: string;
    category: string;
    tags: string[];
    type: 'photo' | 'video' | 'illustration' | 'vector';
    premium: boolean;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageCount: number;
  attendees: number;
  coverImage: string;
  photographer: string;
  featured: boolean;
  status: "upcoming" | "live" | "completed";
}

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Global Tech Summit 2024",
    description: "Leading technology companies showcase their latest innovations",
    date: "March 15, 2024",
    location: "San Francisco, CA",
    category: "Technology",
    imageCount: 284,
    attendees: 5000,
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    photographer: "Tech Events Pro",
    featured: true,
    status: "completed"
  },
  {
    id: "2",
    title: "Fashion Week Milan",
    description: "The most prestigious fashion event showcasing latest runway trends",
    date: "April 8, 2024",
    location: "Milan, Italy",
    category: "Fashion",
    imageCount: 456,
    attendees: 2500,
    coverImage: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=600",
    photographer: "Fashion Focus",
    featured: true,
    status: "completed"
  },
  {
    id: "3",
    title: "Olympic Games Paris",
    description: "The world's greatest sporting event returns to Paris",
    date: "July 26, 2024",
    location: "Paris, France",
    category: "Sports",
    imageCount: 1024,
    attendees: 15000,
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    photographer: "Sports Action",
    featured: true,
    status: "live"
  },
  {
    id: "4",
    title: "Music Festival Coachella",
    description: "America's premier music and arts festival",
    date: "April 12, 2024",
    location: "California, USA",
    category: "Music",
    imageCount: 678,
    attendees: 75000,
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    photographer: "Concert Photos",
    featured: false,
    status: "completed"
  },
  {
    id: "5",
    title: "Art Basel Miami",
    description: "International contemporary art fair featuring world-class galleries",
    date: "December 6, 2024",
    location: "Miami, FL",
    category: "Art",
    imageCount: 189,
    attendees: 3000,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    photographer: "Art Gallery Photos",
    featured: false,
    status: "upcoming"
  },
  {
    id: "6",
    title: "International Food Expo",
    description: "Culinary professionals gather to showcase global cuisine",
    date: "November 18, 2024",
    location: "New York, NY",
    category: "Food",
    imageCount: 234,
    attendees: 4500,
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600",
    photographer: "Food Photography Pro",
    featured: true,
    status: "upcoming"
  }
];

function EventCard({ event, onUploadClick }: { event: Event; onUploadClick?: (event: Event) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-accent text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live Now";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "View Gallery";
      default:
        return status;
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border transition-all duration-300 cursor-pointer green-glow-hover">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status Badge */}
        <Badge className={`absolute top-3 left-3 ${getStatusColor(event.status)} font-semibold`}>
          {getStatusText(event.status)}
        </Badge>

        {/* Featured Badge */}
        {event.featured && (
          <Badge className="absolute top-3 right-3 bg-green-accent text-black font-semibold">
            Featured
          </Badge>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              size="sm"
              className="w-full bg-green-accent hover:bg-green-accent/90 text-black"
            >
              <Camera className="h-4 w-4 mr-2" />
              {event.status === "completed" ? "View Photos" : "Learn More"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <Badge variant="outline" className="bg-green-accent/10 text-green-accent border-green-accent mb-3">
            {event.category}
          </Badge>
          <h3 className="font-semibold text-foreground text-lg mb-2">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {event.date}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {event.attendees.toLocaleString()} attendees
          </div>
          <div className="flex items-center gap-2 text-sm text-green-accent">
            <Camera className="h-4 w-4" />
            {event.imageCount} photos available
          </div>
        </div>

        {/* Photographer */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3 flex items-center justify-between">
          <span>Photography by {event.photographer}</span>
          {onUploadClick && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onUploadClick(event);
              }}
              className="h-6 px-2 text-xs text-green-accent hover:text-green-accent/80 hover:bg-green-accent/10"
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function EventsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAdmin, setIsAdmin] = useState(true); // In real app, get from auth context

  const categories = ["all", "Technology", "Fashion", "Sports", "Music", "Art", "Food"];

  const filteredEvents = sampleEvents.filter(event => {
    const matchesStatus = selectedFilter === "all" || event.status === selectedFilter;
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const handleUploadClick = (event: Event) => {
    setSelectedEvent(event);
    setUploadModalOpen(true);
  };

  const handleUploadComplete = (uploadedFiles: UploadFile[]) => {
    console.log(`Successfully uploaded ${uploadedFiles.length} files to ${selectedEvent?.title}`);
    // In real app, you would refresh the event data to show updated image count
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Event Photography
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Capture the moments that matter with professional event photography from around the world
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="p-6 bg-card border-border glass-effect">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Event Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "live", "upcoming", "completed"].map((status) => (
                    <Button
                      key={status}
                      variant={selectedFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter(status)}
                      className={selectedFilter === status ?
                        "bg-green-accent text-black" :
                        "border-border text-foreground hover:bg-green-accent/10"
                      }
                    >
                      {status === "all" ? "All Events" :
                       status === "live" ? "Live Now" :
                       status === "upcoming" ? "Upcoming" : "Completed"}
                    </Button>
                  ))}
                </div>
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
                      {category === "all" ? "All Categories" : category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {selectedFilter === "all" ? "All Events" :
             selectedFilter === "live" ? "Live Events" :
             selectedFilter === "upcoming" ? "Upcoming Events" : "Event Galleries"}
          </h2>
          <p className="text-muted-foreground">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Admin Upload Notice */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-green-accent/10 border border-green-accent/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-green-accent" />
              <div>
                <h4 className="font-semibold text-foreground">Admin Mode</h4>
                <p className="text-sm text-muted-foreground">
                  You can upload images to events by clicking the "Upload" button on each event card
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onUploadClick={isAdmin ? handleUploadClick : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📅</div>
            <h3 className="text-xl font-medium text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to find what you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFilter("all");
                setSelectedCategory("all");
              }}
              className="bg-green-accent/10 text-green-accent hover:bg-green-accent/20 border-green-accent"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="px-8 border-green-accent text-green-accent hover:bg-green-accent hover:text-black">
              Load More Events
            </Button>
          </div>
        )}
      </div>

      {/* Event Image Upload Modal */}
      {selectedEvent && (
        <EventImageUploadModal
          event={selectedEvent}
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setSelectedEvent(null);
          }}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
}
