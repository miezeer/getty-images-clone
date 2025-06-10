"use client";

export const dynamic = 'force-dynamic';

import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Eye,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Calendar,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  description?: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, description }: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-500",
    neutral: "text-gray-500"
  }[changeType];

  const changeBg = {
    positive: "bg-green-50",
    negative: "bg-red-50",
    neutral: "bg-gray-50"
  }[changeType];

  return (
    <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeBg} ${changeColor}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </div>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Icon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentActivityItem {
  id: string;
  type: "upload" | "download" | "user" | "moderation";
  message: string;
  time: string;
  status: "success" | "warning" | "error";
}

const recentActivity: RecentActivityItem[] = [
  {
    id: "1",
    type: "upload",
    message: "New image uploaded: 'Business Meeting'",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: "2",
    type: "download",
    message: "Premium download by user_123",
    time: "5 minutes ago",
    status: "success"
  },
  {
    id: "3",
    type: "moderation",
    message: "Content flagged for review",
    time: "10 minutes ago",
    status: "warning"
  },
  {
    id: "4",
    type: "user",
    message: "New user registration: john@example.com",
    time: "15 minutes ago",
    status: "success"
  },
  {
    id: "5",
    type: "moderation",
    message: "Copyright claim resolved",
    time: "1 hour ago",
    status: "success"
  }
];

function ActivityFeed() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
          <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivity.map((activity) => {
          const statusIcon = {
            success: CheckCircle,
            warning: AlertTriangle,
            error: AlertTriangle
          }[activity.status];

          const statusColor = {
            success: "text-green-600",
            warning: "text-yellow-500",
            error: "text-red-500"
          }[activity.status];

          const StatusIcon = statusIcon;

          return (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <StatusIcon className={`h-4 w-4 ${statusColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
        <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 days
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            Quick Upload
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Images"
          value="1,247,593"
          change="+12% from last month"
          changeType="positive"
          icon={BarChart3}
          description="Across all categories"
        />
        <StatCard
          title="Active Users"
          value="23,456"
          change="+8% from last month"
          changeType="positive"
          icon={Users}
          description="Monthly active users"
        />
        <StatCard
          title="Downloads Today"
          value="8,924"
          change="+15% from yesterday"
          changeType="positive"
          icon={Download}
          description="Premium & free downloads"
        />
        <StatCard
          title="Revenue (MTD)"
          value="$89,234"
          change="+5% from last month"
          changeType="positive"
          icon={DollarSign}
          description="This month's earnings"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/downloads">
          <Card className="group cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700">Download Analytics</h3>
                  <p className="text-sm text-gray-500">View detailed download metrics and trends</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/content">
          <Card className="group cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">Content Management</h3>
                  <p className="text-sm text-gray-500">Organize and manage your image library</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="group cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">User Management</h3>
                  <p className="text-sm text-gray-500">Handle user accounts and permissions</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Overview */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Traffic Overview</CardTitle>
              <Badge className="bg-green-100 text-green-800 border-green-200">Last 7 days</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Analytics Dashboard</h3>
                  <p className="text-gray-500 mb-2">Chart visualization would be integrated here</p>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    View Full Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* Performance & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Business Meeting Photos", downloads: "2,340", trend: "+15%", category: "Business" },
              { title: "Nature Landscapes", downloads: "1,890", trend: "+8%", category: "Nature" },
              { title: "Technology Vectors", downloads: "1,567", trend: "+12%", category: "Technology" },
              { title: "Food Photography", downloads: "1,234", trend: "+5%", category: "Lifestyle" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-500">{item.downloads} downloads</p>
                    <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">{item.category}</Badge>
                  </div>
                </div>
                <div className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                  {item.trend}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { service: "Image Upload Service", status: "Operational", color: "green" },
              { service: "Search Engine", status: "Operational", color: "green" },
              { service: "Payment Processing", status: "Minor Issues", color: "yellow" },
              { service: "Content Delivery", status: "Operational", color: "green" },
              { service: "User Authentication", status: "Operational", color: "green" },
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{item.service}</p>
                </div>
                <Badge
                  className={`${
                    item.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                    item.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
