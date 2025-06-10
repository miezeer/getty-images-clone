"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  Upload,
  Calendar,
  Star,
  Image as ImageIcon,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  ArrowUpRight,
  ArrowRight,
  Camera,
  FileText,
  CreditCard
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Link from "next/link";

// Sample data for the dashboard
const dashboardData = {
  photographer: {
    name: "Sarah Johnson",
    level: "Pro Contributor",
    joinDate: "March 2024",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    rating: 4.8,
    totalImages: 156,
    approvedImages: 142,
    pendingImages: 8,
    rejectedImages: 6
  },
  earnings: {
    thisMonth: 2840,
    lastMonth: 2156,
    allTime: 15420,
    pendingPayout: 840,
    nextPayoutDate: "March 15, 2025"
  },
  stats: {
    totalViews: 48500,
    totalDownloads: 3240,
    conversionRate: 6.7,
    topImage: {
      title: "Modern Business Team Meeting",
      views: 2840,
      downloads: 156,
      earnings: 284
    }
  },
  recentActivity: [
    { type: "download", image: "Modern office workspace", earnings: 12, time: "2 hours ago" },
    { type: "approved", image: "City skyline at sunset", time: "5 hours ago" },
    { type: "download", image: "Fashion portrait studio", earnings: 8, time: "1 day ago" },
    { type: "upload", image: "3 new images uploaded", time: "2 days ago" },
    { type: "download", image: "Travel destination beach", earnings: 15, time: "3 days ago" }
  ]
};

const monthlyEarnings = [
  { month: "Sep", earnings: 1200 },
  { month: "Oct", earnings: 1580 },
  { month: "Nov", earnings: 1840 },
  { month: "Dec", earnings: 2156 },
  { month: "Jan", earnings: 2380 },
  { month: "Feb", earnings: 2840 }
];

const topPerformingImages = [
  {
    id: "1",
    title: "Modern Business Team Meeting",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300",
    downloads: 156,
    views: 2840,
    earnings: 284,
    category: "Business"
  },
  {
    id: "2",
    title: "City Architecture Skyline",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300",
    downloads: 98,
    views: 1920,
    earnings: 196,
    category: "Architecture"
  },
  {
    id: "3",
    title: "Fashion Portrait Studio",
    url: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=300",
    downloads: 87,
    views: 1640,
    earnings: 174,
    category: "Fashion"
  }
];

export default function PhotographerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "download":
        return <Download className="h-4 w-4 text-green-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "upload":
        return <Upload className="h-4 w-4 text-blue-600" />;
      default:
        return <ImageIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "download":
        return "text-green-600";
      case "approved":
        return "text-green-600";
      case "upload":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header />

      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={dashboardData.photographer.avatar}
              alt={dashboardData.photographer.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
            />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Welcome back, {dashboardData.photographer.name}!
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                <Badge className="bg-green-accent/20 text-green-accent w-fit">
                  {dashboardData.photographer.level}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-muted-foreground">
                    {dashboardData.photographer.rating} rating
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Member since {dashboardData.photographer.joinDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <Link href="/photographer/upload" className="w-full sm:w-auto">
              <Button className="bg-green-accent hover:bg-green-accent/90 text-black w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View </span>Analytics
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${dashboardData.earnings.thisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +32% from last month
                </p>
              </div>
              <div className="p-3 bg-green-accent/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.stats.totalDownloads.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  +18% this month
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.photographer.totalImages}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {dashboardData.photographer.approvedImages} approved
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.stats.conversionRate}%
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Above average
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.image}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.earnings && (
                        <Badge className="bg-green-accent/20 text-green-accent">
                          +${activity.earnings}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Next Payout & Quick Stats */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="h-5 w-5 text-green-accent" />
                    <h3 className="text-lg font-semibold text-foreground">Next Payout</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Available for payout</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${dashboardData.earnings.pendingPayout}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next payout date</p>
                      <p className="text-sm font-medium text-foreground">
                        {dashboardData.earnings.nextPayoutDate}
                      </p>
                    </div>
                    <Button size="sm" className="w-full bg-green-accent hover:bg-green-accent/90 text-black">
                      Request Early Payout
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Content Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">Approved</span>
                      <Badge className="bg-green-accent/20 text-green-accent">
                        {dashboardData.photographer.approvedImages}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">Pending Review</span>
                      <Badge className="bg-yellow-500/20 text-yellow-700">
                        {dashboardData.photographer.pendingImages}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">Needs Revision</span>
                      <Badge className="bg-red-500/20 text-red-700">
                        {dashboardData.photographer.rejectedImages}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Top Performing Images */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Top Performing Images</h3>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPerformingImages.map((image) => (
                  <div key={image.id} className="group cursor-pointer">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <h4 className="font-medium text-foreground mb-2 line-clamp-1">
                      {image.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                      <span>{image.downloads} downloads</span>
                      <span>{image.views} views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {image.category}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">
                        ${image.earnings}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics content would go here */}
            <Card className="p-8 text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Detailed analytics and insights about your content performance.
              </p>
              <Button className="bg-green-accent hover:bg-green-accent/90 text-black">
                View Full Analytics
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Content management would go here */}
            <Card className="p-8 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Content Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage all your uploaded images, track approval status, and optimize metadata.
              </p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-green-accent hover:bg-green-accent/90 text-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Images
                </Button>
                <Button variant="outline">
                  Manage Existing Content
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            {/* Earnings details would go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Earnings Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">All Time Earnings</span>
                    <span className="font-semibold text-green-600">
                      ${dashboardData.earnings.allTime.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">This Month</span>
                    <span className="font-semibold text-foreground">
                      ${dashboardData.earnings.thisMonth.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">Last Month</span>
                    <span className="font-semibold text-foreground">
                      ${dashboardData.earnings.lastMonth.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium text-foreground">PayPal (sarah@email.com)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Share</p>
                    <p className="font-medium text-foreground">70% (Industry Leading)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payout Schedule</p>
                    <p className="font-medium text-foreground">Monthly on 15th</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Update Payment Settings
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Earnings Trend</h3>
              <div className="space-y-4">
                {monthlyEarnings.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-foreground w-12">
                      {data.month}
                    </span>
                    <div className="flex-1">
                      <Progress
                        value={(data.earnings / 3000) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-20">
                      ${data.earnings.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
