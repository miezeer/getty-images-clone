"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
interface ContentItem {
  id: string;
  title: string;
  url: string;
  type: "photo" | "video" | "illustration" | "vector";
  category: string;
  uploadDate: string;
  status: "approved" | "pending" | "rejected";
  downloads: number;
  revenue: number;
}

const sampleContent: ContentItem[] = [
  {
    id: "1",
    title: "Business team meeting in modern office",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300",
    type: "photo",
    category: "Business",
    uploadDate: "2024-01-15",
    status: "approved",
    downloads: 234,
    revenue: 1170
  },
  {
    id: "2",
    title: "Mountain landscape at sunset",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
    type: "photo",
    category: "Nature",
    uploadDate: "2024-01-14",
    status: "approved",
    downloads: 189,
    revenue: 945
  },
  {
    id: "3",
    title: "Abstract geometric pattern design",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
    type: "illustration",
    category: "Design",
    uploadDate: "2024-01-13",
    status: "pending",
    downloads: 0,
    revenue: 0
  },
  {
    id: "4",
    title: "Food ingredients on kitchen counter",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300",
    type: "photo",
    category: "Food",
    uploadDate: "2024-01-12",
    status: "approved",
    downloads: 156,
    revenue: 780
  }
];

function ContentCard({ content }: { content: ContentItem }) {
  const statusColors = {
    approved: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    rejected: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={content.url}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <Badge
          variant="outline"
          className={`absolute top-2 left-2 ${statusColors[content.status]}`}
        >
          {content.status}
        </Badge>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
          {content.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="capitalize">{content.type}</span>
          <span>{content.category}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>{content.downloads} downloads</span>
          <span className="font-medium text-green-600">${content.revenue}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Uploaded {new Date(content.uploadDate).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
}

function UploadArea() {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <Card className="p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Upload New Content</h3>
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragOver
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            // Handle file drop
          }}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Drag and drop your files here
          </h4>
          <p className="text-gray-500 mb-4">
            or click to browse files
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Select Files
          </Button>
        </div>
        <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images (JPG, PNG, WebP)
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Videos (MP4, MOV)
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Vectors (SVG, AI)
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Upload, organize, and manage your digital assets</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </div>

        {/* Upload Area */}
        <UploadArea />

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search content by title, tags, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="illustration">Illustrations</SelectItem>
                <SelectItem value="vector">Vectors</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </Card>

        {/* Content Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-500">Total Assets</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">1,156</div>
            <div className="text-sm text-gray-500">Approved</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">67</div>
            <div className="text-sm text-gray-500">Pending Review</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">24</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </Card>
        </div>

        {/* Content Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Content Library</h2>
            <div className="text-sm text-gray-500">
              Showing {sampleContent.length} of {sampleContent.length} items
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline" size="lg">
          Load More Content
        </Button>
      </div>
    </div>
  );
}
