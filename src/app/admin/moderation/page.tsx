"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Eye,
  Clock,
  User,
  MessageSquare
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
interface ModerationItem {
  id: string;
  type: "copyright" | "inappropriate" | "spam" | "quality";
  content: {
    title: string;
    url: string;
    contentType: "photo" | "video" | "illustration";
  };
  reporter: {
    name: string;
    avatar: string;
  };
  reportDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
}

const moderationQueue: ModerationItem[] = [
  {
    id: "1",
    type: "copyright",
    content: {
      title: "Business meeting in conference room",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300",
      contentType: "photo"
    },
    reporter: {
      name: "Getty Legal Team",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    reportDate: "2024-01-20",
    reason: "Potential copyright infringement claim from rival stock agency",
    status: "pending",
    priority: "high"
  },
  {
    id: "2",
    type: "inappropriate",
    content: {
      title: "Abstract geometric design",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      contentType: "illustration"
    },
    reporter: {
      name: "Community User",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b96d10a0?w=100"
    },
    reportDate: "2024-01-19",
    reason: "Contains hidden inappropriate imagery",
    status: "pending",
    priority: "medium"
  },
  {
    id: "3",
    type: "quality",
    content: {
      title: "Mountain landscape sunset",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
      contentType: "photo"
    },
    reporter: {
      name: "Quality Team",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    reportDate: "2024-01-18",
    reason: "Image quality does not meet our standards - pixelated and blurry",
    status: "pending",
    priority: "low"
  }
];

function ModerationCard({ item }: { item: ModerationItem }) {
  const typeColors = {
    copyright: "bg-red-50 text-red-700 border-red-200",
    inappropriate: "bg-orange-50 text-orange-700 border-orange-200",
    spam: "bg-yellow-50 text-yellow-700 border-yellow-200",
    quality: "bg-blue-50 text-blue-700 border-blue-200"
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  };

  const typeIcons = {
    copyright: AlertTriangle,
    inappropriate: Flag,
    spam: MessageSquare,
    quality: Eye
  };

  const TypeIcon = typeIcons[item.type];

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        {/* Content Preview */}
        <div className="flex-shrink-0">
          <img
            src={item.content.url}
            alt={item.content.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {item.content.title}
            </h3>
            <div className="flex gap-2 ml-4">
              <Badge variant="outline" className={typeColors[item.type]}>
                <TypeIcon className="mr-1 h-3 w-3" />
                {item.type}
              </Badge>
              <Badge className={priorityColors[item.priority]}>
                {item.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <img src={item.reporter.avatar} alt={item.reporter.name} className="rounded-full" />
            </Avatar>
            <span className="text-sm text-gray-600">
              Reported by {item.reporter.name}
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">
              {new Date(item.reportDate).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {item.reason}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {item.content.contentType}
              </Badge>
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {Math.floor(Math.random() * 48) + 1}h ago
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                <CheckCircle className="mr-1 h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="mr-1 h-4 w-4" />
                Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ModerationStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-orange-600">12</div>
        <div className="text-sm text-gray-500">Pending Review</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-red-600">3</div>
        <div className="text-sm text-gray-500">High Priority</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-green-600">89</div>
        <div className="text-sm text-gray-500">Resolved Today</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">2.4h</div>
        <div className="text-sm text-gray-500">Avg. Response Time</div>
      </Card>
    </div>
  );
}

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const pendingItems = moderationQueue.filter(item => item.status === "pending");
  const approvedItems = moderationQueue.filter(item => item.status === "approved");
  const rejectedItems = moderationQueue.filter(item => item.status === "rejected");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600">Review flagged content and manage community reports</p>
      </div>

        {/* Statistics */}
        <ModerationStats />

        {/* Moderation Queue */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Pending Review
              <Badge className="ml-2 bg-orange-500 text-white text-xs">
                {pendingItems.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge className="ml-2 bg-green-500 text-white text-xs">
                {approvedItems.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {rejectedItems.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pending Review ({pendingItems.length})</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Bulk Review
              </Button>
            </div>
            {pendingItems.length > 0 ? (
              <div className="space-y-4">
                {pendingItems.map((item) => (
                  <ModerationCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No content pending review at the moment.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recently Approved</h2>
            </div>
            <Card className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approved items</h3>
              <p className="text-gray-500">Approved content will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Rejected Content</h2>
            </div>
            <Card className="p-12 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected items</h3>
              <p className="text-gray-500">Rejected content will appear here.</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Moderation Activity</h3>
          <div className="space-y-4">
            {[
              {
                action: "Content approved",
                item: "Business Meeting Photos",
                moderator: "Sarah Johnson",
                time: "2 minutes ago",
                type: "approve"
              },
              {
                action: "Content rejected",
                item: "Low quality landscape",
                moderator: "Mike Chen",
                time: "15 minutes ago",
                type: "reject"
              },
              {
                action: "Copyright claim resolved",
                item: "Corporate headshots",
                moderator: "Legal Team",
                time: "1 hour ago",
                type: "resolve"
              }
            ].map((activity) => (
              <div key={`${activity.action}-${activity.item}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {activity.type === "approve" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {activity.type === "reject" && <XCircle className="h-5 w-5 text-red-600" />}
                  {activity.type === "resolve" && <AlertTriangle className="h-5 w-5 text-blue-600" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}: {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {activity.moderator} • {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </div>
  );
}
