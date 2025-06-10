"use client";

import { useState, useEffect } from "react";
import { Download, Calendar, FileImage, Repeat, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface DownloadHistoryItem {
  id: string;
  user_id: string;
  image_id: string;
  download_type: 'free' | 'premium' | 'purchase';
  resolution: string;
  price_paid: number;
  downloaded_at: string;
  image_title: string;
  image_photographer: string;
}

interface DownloadHistoryProps {
  userId?: string;
  onRedownload?: (item: DownloadHistoryItem) => void;
}

export default function DownloadHistory({ userId, onRedownload }: DownloadHistoryProps) {
  const [downloads, setDownloads] = useState<DownloadHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'premium' | 'purchase'>('all');

  useEffect(() => {
    loadDownloadHistory();
  }, [userId]);

  const loadDownloadHistory = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your database
      // For demo, we're using localStorage
      const storedDownloads = localStorage.getItem('user_downloads');
      if (storedDownloads) {
        const parsedDownloads = JSON.parse(storedDownloads);
        setDownloads(parsedDownloads);
      }
    } catch (error) {
      console.error('Failed to load download history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDownloadTypeColor = (type: string) => {
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

  const filteredDownloads = downloads.filter(download =>
    filter === 'all' || download.download_type === filter
  );

  const totalDownloads = downloads.length;
  const totalSpent = downloads.reduce((sum, download) => sum + download.price_paid, 0);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Download History</h1>
        <p className="text-muted-foreground">
          View and manage your downloaded images
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-accent/20 rounded-lg">
              <Download className="h-5 w-5 text-green-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{totalDownloads}</h3>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileImage className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">${totalSpent.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {downloads.length > 0 ? 'Active' : 'None'}
              </h3>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-green-accent text-black hover:bg-green-accent/90' : ''}
        >
          All ({downloads.length})
        </Button>
        <Button
          variant={filter === 'free' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('free')}
          className={filter === 'free' ? 'bg-green-accent text-black hover:bg-green-accent/90' : ''}
        >
          Free ({downloads.filter(d => d.download_type === 'free').length})
        </Button>
        <Button
          variant={filter === 'premium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('premium')}
          className={filter === 'premium' ? 'bg-green-accent text-black hover:bg-green-accent/90' : ''}
        >
          Premium ({downloads.filter(d => d.download_type === 'premium').length})
        </Button>
        <Button
          variant={filter === 'purchase' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('purchase')}
          className={filter === 'purchase' ? 'bg-green-accent text-black hover:bg-green-accent/90' : ''}
        >
          Purchased ({downloads.filter(d => d.download_type === 'purchase').length})
        </Button>
      </div>

      {/* Download List */}
      {filteredDownloads.length > 0 ? (
        <div className="space-y-4">
          {filteredDownloads.map((download) => (
            <Card key={download.id} className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Image placeholder - in real app would show actual thumbnail */}
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{download.image_title}</h3>
                    <p className="text-sm text-muted-foreground">by {download.image_photographer}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getDownloadTypeColor(download.download_type)}
                      >
                        {download.download_type} • {download.resolution}
                      </Badge>
                      {download.price_paid > 0 && (
                        <span className="text-sm text-muted-foreground">
                          ${download.price_paid}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(download.downloaded_at)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRedownload?.(download)}
                      className="hover:bg-green-accent/10 hover:text-green-accent hover:border-green-accent"
                    >
                      <Repeat className="h-4 w-4 mr-1" />
                      Re-download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-6xl mb-4">📁</div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            {filter === 'all' ? 'No downloads yet' : `No ${filter} downloads`}
          </h3>
          <p className="text-muted-foreground mb-4">
            Start exploring our image gallery to download your first image.
          </p>
          <Button
            className="bg-green-accent hover:bg-green-accent/90 text-black"
            onClick={() => window.location.href = '/'}
          >
            Browse Images
          </Button>
        </div>
      )}

      {/* Clear History Option */}
      {downloads.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to clear your download history? This action cannot be undone.')) {
                localStorage.removeItem('user_downloads');
                setDownloads([]);
              }
            }}
            className="text-red-500 hover:text-red-600 hover:border-red-500"
          >
            Clear Download History
          </Button>
        </div>
      )}
    </div>
  );
}
