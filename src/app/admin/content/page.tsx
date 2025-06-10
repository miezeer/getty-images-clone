"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
  Edit,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Star,
  Trash2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Tags,
  Calendar,
  User,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Heart,
  Share2
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import FaceTagging from "@/components/FaceTagging";
import { Switch } from "@/components/ui/switch";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  photographer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  type: "photo" | "video" | "illustration" | "vector";
  status: "active" | "inactive" | "featured" | "archived";
  uploadedAt: string;
  lastModified: string;
  stats: {
    views: number;
    downloads: number;
    likes: number;
    shares: number;
  };
  pricing: {
    free: boolean;
    premium: boolean;
    price?: number;
  };
  technical: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
    dpi?: number;
  };
  seo: {
    altText: string;
    keywords: string[];
    metaDescription: string;
  };
}

// Sample content data
const sampleContent: ContentItem[] = [
  {
    id: "1",
    title: "Modern Business Team Meeting",
    description: "Professional team collaborating in modern office environment with natural lighting",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300",
    photographer: {
      id: "p1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60"
    },
    category: "Business",
    tags: ["business", "team", "meeting", "office", "collaboration", "professional"],
    type: "photo",
    status: "featured",
    uploadedAt: "2024-12-15T10:30:00Z",
    lastModified: "2025-01-08T14:22:00Z",
    stats: {
      views: 12450,
      downloads: 892,
      likes: 234,
      shares: 67
    },
    pricing: {
      free: false,
      premium: true,
      price: 25
    },
    technical: {
      width: 4000,
      height: 2667,
      fileSize: 2.4,
      format: "JPEG",
      dpi: 300
    },
    seo: {
      altText: "Modern business team meeting in bright office space",
      keywords: ["business meeting", "teamwork", "corporate", "office collaboration"],
      metaDescription: "Professional business team meeting photo perfect for corporate presentations and marketing materials"
    }
  },
  {
    id: "2",
    title: "Urban Architecture Skyline",
    description: "Stunning city skyline with modern skyscrapers during golden hour",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300",
    photographer: {
      id: "p2",
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60"
    },
    category: "Architecture",
    tags: ["architecture", "city", "skyline", "urban", "buildings", "golden hour"],
    type: "photo",
    status: "active",
    uploadedAt: "2024-12-10T16:45:00Z",
    lastModified: "2024-12-28T09:15:00Z",
    stats: {
      views: 8920,
      downloads: 445,
      likes: 189,
      shares: 32
    },
    pricing: {
      free: true,
      premium: false
    },
    technical: {
      width: 5000,
      height: 3333,
      fileSize: 3.2,
      format: "JPEG",
      dpi: 300
    },
    seo: {
      altText: "Urban city skyline with modern architecture at sunset",
      keywords: ["city skyline", "urban architecture", "modern buildings", "cityscape"],
      metaDescription: "Beautiful urban skyline photograph showcasing modern architecture and city planning"
    }
  },
  {
    id: "3",
    title: "Creative Food Photography",
    description: "Artistic arrangement of fresh ingredients with natural lighting",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300",
    photographer: {
      id: "p3",
      name: "Emma Rodriguez",
      email: "emma@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60"
    },
    category: "Food",
    tags: ["food", "photography", "ingredients", "cooking", "natural", "artistic"],
    type: "photo",
    status: "active",
    uploadedAt: "2024-12-05T11:20:00Z",
    lastModified: "2025-01-02T13:45:00Z",
    stats: {
      views: 6780,
      downloads: 287,
      likes: 156,
      shares: 23
    },
    pricing: {
      free: false,
      premium: true,
      price: 18
    },
    technical: {
      width: 3600,
      height: 5400,
      fileSize: 2.8,
      format: "JPEG",
      dpi: 300
    },
    seo: {
      altText: "Fresh ingredients arranged for creative food photography",
      keywords: ["food photography", "fresh ingredients", "cooking", "culinary art"],
      metaDescription: "Professional food photography showcasing fresh ingredients in artistic composition"
    }
  },
  {
    id: "4",
    title: "Technology Workspace Setup",
    description: "Modern workspace with laptop, smartphone and tech accessories",
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300",
    photographer: {
      id: "p4",
      name: "Alex Kim",
      email: "alex@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60"
    },
    category: "Technology",
    tags: ["technology", "workspace", "laptop", "smartphone", "modern", "office"],
    type: "photo",
    status: "inactive",
    uploadedAt: "2024-11-28T14:10:00Z",
    lastModified: "2024-12-20T16:30:00Z",
    stats: {
      views: 4320,
      downloads: 178,
      likes: 89,
      shares: 15
    },
    pricing: {
      free: true,
      premium: false
    },
    technical: {
      width: 4200,
      height: 2800,
      fileSize: 1.9,
      format: "JPEG",
      dpi: 300
    },
    seo: {
      altText: "Modern technology workspace with laptop and devices",
      keywords: ["tech workspace", "modern office", "laptop setup", "technology"],
      metaDescription: "Clean modern workspace setup featuring technology devices and accessories"
    }
  }
];

const categories = ["Business", "Architecture", "Food", "Technology", "Nature", "People", "Travel", "Sports", "Fashion", "Art"];
const statusOptions = [
  { value: "active", label: "Active", color: "bg-green-600" },
  { value: "inactive", label: "Inactive", color: "bg-gray-500" },
  { value: "featured", label: "Featured", color: "bg-blue-600" },
  { value: "archived", label: "Archived", color: "bg-red-600" }
];

function BulkEditModal({
  selectedItems,
  isOpen,
  onClose,
  onSave
}: {
  selectedItems: ContentItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<ContentItem>) => void;
}) {
  const [bulkUpdates, setBulkUpdates] = useState<Partial<ContentItem>>({});
  const [updateFields, setUpdateFields] = useState<Set<string>>(new Set());

  const handleFieldToggle = (field: string, enabled: boolean) => {
    const newUpdateFields = new Set(updateFields);
    if (enabled) {
      newUpdateFields.add(field);
    } else {
      newUpdateFields.delete(field);
      const newUpdates = { ...bulkUpdates };
      delete newUpdates[field as keyof ContentItem];
      setBulkUpdates(newUpdates);
    }
    setUpdateFields(newUpdateFields);
  };

  const handleSave = () => {
    onSave(bulkUpdates);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Content</DialogTitle>
          <DialogDescription>
            Update {selectedItems.length} selected content items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Update */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={updateFields.has('status')}
                onCheckedChange={(checked) => handleFieldToggle('status', checked)}
              />
              <Label>Update Status</Label>
            </div>
            {updateFields.has('status') && (
              <Select
                value={bulkUpdates.status || ''}
                onValueChange={(value) => setBulkUpdates({ ...bulkUpdates, status: value as "active" | "inactive" | "featured" | "archived" })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Category Update */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={updateFields.has('category')}
                onCheckedChange={(checked) => handleFieldToggle('category', checked)}
              />
              <Label>Update Category</Label>
            </div>
            {updateFields.has('category') && (
              <Select
                value={bulkUpdates.category || ''}
                onValueChange={(value) => setBulkUpdates({ ...bulkUpdates, category: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tags Update */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={updateFields.has('tags')}
                onCheckedChange={(checked) => handleFieldToggle('tags', checked)}
              />
              <Label>Update Tags</Label>
            </div>
            {updateFields.has('tags') && (
              <div className="space-y-2">
                <Input
                  placeholder="Add tags (comma separated)"
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    setBulkUpdates({ ...bulkUpdates, tags });
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBulkUpdates({ ...bulkUpdates, tags: [] })}
                  >
                    Clear All Tags
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Update */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={updateFields.has('pricing')}
                onCheckedChange={(checked) => handleFieldToggle('pricing', checked)}
              />
              <Label>Update Pricing</Label>
            </div>
            {updateFields.has('pricing') && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="bulk-free"
                    checked={bulkUpdates.pricing?.free || false}
                    onChange={(e) => setBulkUpdates({
                      ...bulkUpdates,
                      pricing: {
                        free: e.target.checked,
                        premium: bulkUpdates.pricing?.premium ?? false,
                        ...bulkUpdates.pricing
                      }
                    })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="bulk-free" className="text-sm">Free</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="bulk-premium"
                    checked={bulkUpdates.pricing?.premium || false}
                    onChange={(e) => setBulkUpdates({
                      ...bulkUpdates,
                      pricing: {
                        free: bulkUpdates.pricing?.free ?? false,
                        premium: e.target.checked,
                        ...bulkUpdates.pricing
                      }
                    })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="bulk-premium" className="text-sm">Premium</Label>
                </div>
                {bulkUpdates.pricing?.premium && (
                  <div>
                    <Label className="text-sm">Price ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="w-32"
                      onChange={(e) => setBulkUpdates({
                        ...bulkUpdates,
                        pricing: {
                          free: bulkUpdates.pricing?.free ?? false,
                          premium: bulkUpdates.pricing?.premium ?? false,
                          price: Number(e.target.value),
                          ...bulkUpdates.pricing
                        }
                      })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateFields.size === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Apply to {selectedItems.length} Items
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContentEditModal({
  content,
  isOpen,
  onClose,
  onSave
}: {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
}) {
  const [editedContent, setEditedContent] = useState<ContentItem | null>(content);
  const [imageReplacement, setImageReplacement] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    setEditedContent(content);
    setImageReplacement(null);
    setPreviewUrl('');
  }, [content]);

  if (!editedContent) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageReplacement(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    let updatedContent = { ...editedContent };

    // If image was replaced, update URLs
    if (imageReplacement && previewUrl) {
      updatedContent = {
        ...updatedContent,
        url: previewUrl,
        thumbnail: previewUrl,
        technical: {
          ...updatedContent.technical,
          fileSize: imageReplacement.size / (1024 * 1024), // Convert to MB
          format: imageReplacement.type.split('/')[1].toUpperCase()
        }
      };
    }

    onSave(updatedContent);
    onClose();
  };

  const updateTags = (tagInput: string) => {
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setEditedContent({ ...editedContent, tags });
  };

  const updateKeywords = (keywordInput: string) => {
    const keywords = keywordInput.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
    setEditedContent({
      ...editedContent,
      seo: { ...editedContent.seo, keywords }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Update content information, metadata, and settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="faces">Face Tags</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editedContent.title}
                    onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={editedContent.description}
                    onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editedContent.category}
                    onValueChange={(value) => setEditedContent({ ...editedContent, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={editedContent.tags.join(', ')}
                    onChange={(e) => updateTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedContent.status}
                    onValueChange={(value) => setEditedContent({ ...editedContent, status: value as "active" | "inactive" | "featured" | "archived" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Preview</Label>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={previewUrl || editedContent.thumbnail}
                      alt={editedContent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs">Dimensions</Label>
                    <p className="text-muted-foreground">
                      {editedContent.technical.width} × {editedContent.technical.height}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">File Size</Label>
                    <p className="text-muted-foreground">
                      {editedContent.technical.fileSize} MB
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">Format</Label>
                    <p className="text-muted-foreground">
                      {editedContent.technical.format}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <p className="text-muted-foreground capitalize">
                      {editedContent.type}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Current Image</Label>
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted max-w-md">
                  <img
                    src={previewUrl || editedContent.url}
                    alt={editedContent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Replace Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload a new image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, WebP up to 50MB
                      </p>
                    </div>
                  </label>
                </div>
                {imageReplacement && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <p className="text-green-800">
                      New image selected: {imageReplacement.name} ({(imageReplacement.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Image Replacement Notes:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Replacing the image will update the content URL</li>
                  <li>• Existing downloads and views will remain unchanged</li>
                  <li>• Face detection data will be cleared and need to be re-run</li>
                  <li>• Consider the impact on SEO and existing backlinks</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Photographer</Label>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <img
                      src={editedContent.photographer.avatar}
                      alt={editedContent.photographer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{editedContent.photographer.name}</p>
                      <p className="text-sm text-muted-foreground">{editedContent.photographer.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Upload Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(editedContent.uploadedAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label>Last Modified</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(editedContent.lastModified).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Performance Stats</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Views</span>
                      </div>
                      <p className="text-lg font-semibold">{editedContent.stats.views.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Downloads</span>
                      </div>
                      <p className="text-lg font-semibold">{editedContent.stats.downloads.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-muted-foreground">Likes</span>
                      </div>
                      <p className="text-lg font-semibold">{editedContent.stats.likes.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-muted-foreground">Shares</span>
                      </div>
                      <p className="text-lg font-semibold">{editedContent.stats.shares.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faces" className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Face Detection & Tagging</Label>
              <FaceTagging
                imageUrl={editedContent.url}
                imageId={editedContent.id}
                onTaggingComplete={(faces) => {
                  console.log('Face tagging completed:', faces);
                  // In a real app, you would save the face data to the content item
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  value={editedContent.seo.altText}
                  onChange={(e) => setEditedContent({
                    ...editedContent,
                    seo: { ...editedContent.seo, altText: e.target.value }
                  })}
                  placeholder="Descriptive alt text for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  value={editedContent.seo.metaDescription}
                  onChange={(e) => setEditedContent({
                    ...editedContent,
                    seo: { ...editedContent.seo, metaDescription: e.target.value }
                  })}
                  placeholder="Brief description for search engines"
                />
              </div>

              <div>
                <Label htmlFor="keywords">SEO Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  value={editedContent.seo.keywords.join(', ')}
                  onChange={(e) => updateKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">SEO Tips:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use descriptive, specific alt text</li>
                  <li>• Keep meta descriptions under 160 characters</li>
                  <li>• Include relevant keywords naturally</li>
                  <li>• Focus on user intent and search relevance</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-6">
              <div>
                <Label>Pricing Settings</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="free"
                      checked={editedContent.pricing.free}
                      onChange={(e) => setEditedContent({
                        ...editedContent,
                        pricing: { ...editedContent.pricing, free: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="free" className="text-sm">Available for free</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="premium"
                      checked={editedContent.pricing.premium}
                      onChange={(e) => setEditedContent({
                        ...editedContent,
                        pricing: { ...editedContent.pricing, premium: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="premium" className="text-sm">Premium content</Label>
                  </div>

                  {editedContent.pricing.premium && (
                    <div>
                      <Label htmlFor="price" className="text-sm">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editedContent.pricing.price || ''}
                        onChange={(e) => setEditedContent({
                          ...editedContent,
                          pricing: { ...editedContent.pricing, price: Number(e.target.value) }
                        })}
                        placeholder="0.00"
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Technical Information</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="width" className="text-sm">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={editedContent.technical.width}
                      onChange={(e) => setEditedContent({
                        ...editedContent,
                        technical: { ...editedContent.technical, width: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={editedContent.technical.height}
                      onChange={(e) => setEditedContent({
                        ...editedContent,
                        technical: { ...editedContent.technical, height: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dpi" className="text-sm">DPI (optional)</Label>
                    <Input
                      id="dpi"
                      type="number"
                      value={editedContent.technical.dpi || ''}
                      onChange={(e) => setEditedContent({
                        ...editedContent,
                        technical: { ...editedContent.technical, dpi: Number(e.target.value) || undefined }
                      })}
                      placeholder="300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="format" className="text-sm">Format</Label>
                    <Select
                      value={editedContent.technical.format}
                      onValueChange={(value) => setEditedContent({
                        ...editedContent,
                        technical: { ...editedContent.technical, format: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JPEG">JPEG</SelectItem>
                        <SelectItem value="PNG">PNG</SelectItem>
                        <SelectItem value="WebP">WebP</SelectItem>
                        <SelectItem value="SVG">SVG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContentCard({
  content,
  onEdit,
  onDelete,
  onToggleStatus,
  isSelected,
  onSelect
}: {
  content: ContentItem;
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: string) => void;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}) {
  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.color || "bg-gray-500";
  };

  return (
    <Card className={`overflow-hidden border transition-all duration-200 ${
      isSelected ? "border-green-accent bg-green-accent/5" : "border-border"
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(content.id, e.target.checked)}
              className="mt-1 rounded border-gray-300"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                {content.title}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={content.photographer.avatar}
                  alt={content.photographer.name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-muted-foreground">
                  {content.photographer.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs text-white ${getStatusColor(content.status)}`}>
              {content.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(content)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    onClick={() => onToggleStatus(content.id, status.value)}
                    disabled={content.status === status.value}
                  >
                    <div className={`h-2 w-2 rounded-full mr-2 ${status.color}`} />
                    Mark as {status.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(content.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative aspect-[4/3] mb-3 rounded-lg overflow-hidden bg-muted">
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {content.type}
          </div>
          {content.pricing.premium && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
              ${content.pricing.price}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="outline" className="text-xs">
              {content.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Downloads</span>
            <span className="font-medium">{content.stats.downloads.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Views</span>
            <span className="font-medium">{content.stats.views.toLocaleString()}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {content.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {content.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{content.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onEdit(content)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentItem[]>(sampleContent);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  const filteredContent = content.filter(item => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.photographer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesType && matchesSearch;
  });

  const handleEdit = (contentItem: ContentItem) => {
    setEditingContent(contentItem);
    setShowEditModal(true);
  };

  const handleSave = (updatedContent: ContentItem) => {
    setContent(prev => prev.map(item =>
      item.id === updatedContent.id
        ? { ...updatedContent, lastModified: new Date().toISOString() }
        : item
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      setContent(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleToggleStatus = (id: string, status: string) => {
    setContent(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: status as "active" | "inactive" | "featured" | "archived", lastModified: new Date().toISOString() }
        : item
    ));
  };

  const handleBatchStatusUpdate = (status: string) => {
    setContent(prev => prev.map(item =>
      selectedContent.includes(item.id)
        ? { ...item, status: status as "active" | "inactive" | "featured" | "archived", lastModified: new Date().toISOString() }
        : item
    ));
    setSelectedContent([]);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedContent.length} content items? This action cannot be undone.`)) {
      setContent(prev => prev.filter(item => !selectedContent.includes(item.id)));
      setSelectedContent([]);
    }
  };

  const handleSelectContent = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedContent(prev => [...prev, id]);
    } else {
      setSelectedContent(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedContent.length === filteredContent.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(filteredContent.map(item => item.id));
    }
  };

  const handleBulkEdit = () => {
    setShowBulkEditModal(true);
  };

  const handleBulkSave = (updates: Partial<ContentItem>) => {
    setContent(prev => prev.map(item =>
      selectedContent.includes(item.id)
        ? { ...item, ...updates, lastModified: new Date().toISOString() }
        : item
    ));
    setSelectedContent([]);
  };

  const stats = {
    total: content.length,
    active: content.filter(c => c.status === "active").length,
    featured: content.filter(c => c.status === "featured").length,
    inactive: content.filter(c => c.status === "inactive").length,
    totalViews: content.reduce((sum, c) => sum + c.stats.views, 0),
    totalDownloads: content.reduce((sum, c) => sum + c.stats.downloads, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Content</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          <div className="text-sm text-muted-foreground">Inactive</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.totalDownloads.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Downloads</div>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage and edit your content library</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content, photographers, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="illustration">Illustrations</SelectItem>
                <SelectItem value="vector">Vectors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Batch Actions */}
      {selectedContent.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              {selectedContent.length} item{selectedContent.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkEdit}
                className="text-xs"
              >
                <Edit className="h-4 w-4 mr-2" />
                Bulk Edit
              </Button>
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  size="sm"
                  variant="outline"
                  onClick={() => handleBatchStatusUpdate(status.value)}
                  className="text-xs"
                >
                  Mark as {status.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBatchDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedContent([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Content Grid */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredContent.length} of {content.length} content items
        </p>
        {filteredContent.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedContent.length === filteredContent.length ? "Deselect All" : "Select All"}
          </Button>
        )}
      </div>

      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContent.map((contentItem) => (
            <ContentCard
              key={contentItem.id}
              content={contentItem}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isSelected={selectedContent.includes(contentItem.id)}
              onSelect={handleSelectContent}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No content found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "Upload your first content to get started."
            }
          </p>
        </Card>
      )}

      {/* Bulk Edit Modal */}
      <BulkEditModal
        selectedItems={content.filter(item => selectedContent.includes(item.id))}
        isOpen={showBulkEditModal}
        onClose={() => setShowBulkEditModal(false)}
        onSave={handleBulkSave}
      />

      {/* Edit Modal */}
      <ContentEditModal
        content={editingContent}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingContent(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
