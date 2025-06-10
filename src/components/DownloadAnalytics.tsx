"use client";

import type { Download as DownloadType } from "@/types";
import { useState, useEffect } from "react";
import { Download, TrendingUp, DollarSign, Users, Calendar, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DownloadStats {
  totalDownloads: number;
  totalRevenue: number;
  activeUsers: number;
  averageDownloadsPerUser: number;
  popularResolution: string;
  popularType: string;
  recentDownloads: DownloadType[];
}

interface DownloadAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export default function DownloadAnalytics({ timeRange = '30d' }: DownloadAnalyticsProps) {
  const [stats, setStats] = useState<DownloadStats>({
    totalDownloads: 0,
    totalRevenue: 0,
    activeUsers: 0,
    averageDownloadsPerUser: 0,
    popularResolution: 'Medium',
    popularType: 'free',
    recentDownloads: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your analytics service
      // For demo, we're simulating data from localStorage
      const storedDownloads = localStorage.getItem('user_downloads');
      let downloads = [];

      if (storedDownloads) {
        downloads = JSON.parse(storedDownloads);
      }

      // Calculate analytics from the demo data
      const totalDownloads = downloads.length;
      const totalRevenue = downloads.reduce((sum: number, download: DownloadType) => sum + (download.price_paid || 0), 0);
      const uniqueUsers = new Set(downloads.map((d: DownloadType) => d.user_id)).size;
      const averageDownloadsPerUser = uniqueUsers > 0 ? totalDownloads / uniqueUsers : 0;

      // Find most popular resolution and type
      const resolutionCounts = downloads.reduce((acc: Record<string, number>, d: DownloadType) => {
        acc[d.resolution] = (acc[d.resolution] || 0) + 1;
        return acc;
      }, {});

      const typeCounts = downloads.reduce((acc: Record<string, number>, d: DownloadType) => {
        acc[d.license_type] = (acc[d.license_type] || 0) + 1;
        return acc;
      }, {});

      const popularResolution = Object.keys(resolutionCounts).reduce((a, b) =>
        resolutionCounts[a] > resolutionCounts[b] ? a : b, 'Medium'
      );

      const popularType = Object.keys(typeCounts).reduce((a, b) =>
        typeCounts[a] > typeCounts[b] ? a : b, 'free'
      );

      setStats({
        totalDownloads,
        totalRevenue,
        activeUsers: uniqueUsers,
        averageDownloadsPerUser,
        popularResolution,
        popularType,
        recentDownloads: downloads.slice(0, 10)
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'free':
        return 'bg-green-accent/10 text-green-accent border-green-accent';
      case 'premium':
        return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'purchase':
        return 'bg-purple-500/10 text-purple-500 border-purple-500';
      default:
        return 'bg-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Download Analytics</h2>
          <p className="text-muted-foreground">Track download performance and user engagement</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range as "7d" | "30d" | "90d" | "1y")}
              className={selectedTimeRange === range ? 'bg-green-accent text-black hover:bg-green-accent/90' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-accent/20 rounded-lg">
              <Download className="h-5 w-5 text-green-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stats.totalDownloads.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-accent" />
                <span className="text-xs text-green-accent">+12.5%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-accent" />
                <span className="text-xs text-green-accent">+8.2%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-accent" />
                <span className="text-xs text-green-accent">+5.7%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stats.averageDownloadsPerUser.toFixed(1)}</h3>
              <p className="text-sm text-muted-foreground">Avg Downloads/User</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-accent" />
                <span className="text-xs text-green-accent">+3.1%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Popular Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Popular Download Types</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTypeColor(stats.popularType)}>
                  {stats.popularType}
                </Badge>
                <span className="text-sm text-muted-foreground">Most Popular</span>
              </div>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">
                  premium
                </Badge>
              </div>
              <span className="text-sm font-medium">24%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500">
                  purchase
                </Badge>
              </div>
              <span className="text-sm font-medium">8%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Popular Resolutions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{stats.popularResolution}</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Small</span>
              <span className="text-sm font-medium">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Large</span>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Original</span>
              <span className="text-sm font-medium">10%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Downloads */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Downloads</h3>
        {stats.recentDownloads.length > 0 ? (
          <div className="space-y-3">
            {stats.recentDownloads.map((download) => (
              <div key={download.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-accent/20 rounded-lg flex items-center justify-center">
                    <Download className="h-4 w-4 text-green-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{download.image_title}</h4>
                    <p className="text-xs text-muted-foreground">Download #{download.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getTypeColor(download.license_type)}>
                    {download.license_type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(download.download_date)}</span>
                  {download.price_paid > 0 && (
                    <span className="text-sm font-medium text-foreground">{formatCurrency(download.price_paid)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No downloads recorded yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
