"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Camera,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  MoreHorizontal,
  Image,
  Save,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  createdAt: string;
  updatedAt: string;
}

// Sample events data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Global Tech Summit 2024",
    description: "Leading technology companies showcase their latest innovations",
    date: "2024-03-15",
    location: "San Francisco, CA",
    category: "Technology",
    imageCount: 284,
    attendees: 5000,
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    photographer: "Tech Events Pro",
    featured: true,
    status: "completed",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-16T15:30:00Z"
  },
  {
    id: "2",
    title: "Fashion Week Milan",
    description: "The most prestigious fashion event showcasing latest runway trends",
    date: "2024-04-08",
    location: "Milan, Italy",
    category: "Fashion",
    imageCount: 456,
    attendees: 2500,
    coverImage: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=600",
    photographer: "Fashion Focus",
    featured: true,
    status: "completed",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-04-09T18:00:00Z"
  },
  {
    id: "3",
    title: "Olympic Games Paris",
    description: "The world's greatest sporting event returns to Paris",
    date: "2024-07-26",
    location: "Paris, France",
    category: "Sports",
    imageCount: 1024,
    attendees: 15000,
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    photographer: "Sports Action",
    featured: true,
    status: "live",
    createdAt: "2024-03-01T12:00:00Z",
    updatedAt: "2024-07-26T08:00:00Z"
  },
  {
    id: "4",
    title: "Music Festival Coachella",
    description: "America's premier music and arts festival",
    date: "2024-04-12",
    location: "California, USA",
    category: "Music",
    imageCount: 678,
    attendees: 75000,
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    photographer: "Concert Photos",
    featured: false,
    status: "completed",
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-04-15T20:00:00Z"
  },
  {
    id: "5",
    title: "Art Basel Miami",
    description: "International contemporary art fair featuring world-class galleries",
    date: "2024-12-06",
    location: "Miami, FL",
    category: "Art",
    imageCount: 189,
    attendees: 3000,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
    photographer: "Art Gallery Photos",
    featured: false,
    status: "upcoming",
    createdAt: "2024-08-15T11:00:00Z",
    updatedAt: "2024-11-01T16:00:00Z"
  }
];

const categories = ["Technology", "Fashion", "Sports", "Music", "Art", "Food", "Business", "Culture"];

function EventFormDialog({
  event,
  isOpen,
  onClose,
  onSave
}: {
  event?: Event;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    attendees: 0,
    photographer: "",
    featured: false,
    status: "upcoming",
    coverImage: ""
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        attendees: 0,
        photographer: "",
        featured: false,
        status: "upcoming",
        coverImage: ""
      });
    }
  }, [event, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update event details and settings" : "Add a new event to the platform"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Event Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Event location"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Event["status"] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="attendees">Expected Attendees</Label>
              <Input
                id="attendees"
                type="number"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="photographer">Photographer</Label>
              <Input
                id="photographer"
                value={formData.photographer}
                onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                placeholder="Photographer name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured">Featured Event</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EventCard({ event, onEdit, onDelete, onViewImages }: {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onViewImages: (eventId: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="overflow-hidden border-border">
      <div className="relative aspect-[16/10]">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${getStatusColor(event.status)}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
        {event.featured && (
          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
            Featured
          </Badge>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewImages(event.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(event.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {event.attendees.toLocaleString()} attendees
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Camera className="h-4 w-4" />
            {event.imageCount} photos
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {event.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            by {event.photographer}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.photographer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      ));
    } else {
      // Create new event
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        imageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...eventData
      } as Event;
      setEvents(prev => [newEvent, ...prev]);
    }
    setEditingEvent(undefined);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleViewImages = (eventId: string) => {
    // In a real app, this would navigate to the event's image gallery
    console.log("Viewing images for event:", eventId);
  };

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === "upcoming").length,
    live: events.filter(e => e.status === "live").length,
    completed: events.filter(e => e.status === "completed").length,
    featured: events.filter(e => e.featured).length,
    totalImages: events.reduce((sum, e) => sum + e.imageCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Events</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{stats.live}</div>
          <div className="text-sm text-muted-foreground">Live</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.featured}</div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.totalImages.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Images</div>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Create and manage events on the platform</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, locations, photographers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEvents.length} of {events.length} events
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Sort by: Latest</span>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onViewImages={handleViewImages}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
              ? "Try adjusting your search criteria or filters."
              : "Get started by creating your first event."
            }
          </p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Card>
      )}

      {/* Create/Edit Event Modal */}
      <EventFormDialog
        event={editingEvent}
        isOpen={createModalOpen || !!editingEvent}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingEvent(undefined);
        }}
        onSave={handleSaveEvent}
      />
    </div>
  );
}
