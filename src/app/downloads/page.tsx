"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";

interface DownloadHistoryItem {
  id: string;
  user_id: string;
  image_id: string;
  download_type: "free" | "premium" | "purchase";
  resolution: string;
  price_paid: number;
  downloaded_at: string;
  image_title: string;
  image_photographer: string;
}

interface DownloadHistoryItem {
  id: string;
  user_id: string;
  image_id: string;
  download_type: "free" | "premium" | "purchase";
  resolution: string;
  price_paid: number;
  downloaded_at: string;
  image_title: string;
  image_photographer: string;
}
import DownloadHistory from "@/components/DownloadHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DownloadsPage() {
  const [user] = useState({
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com'
  });

  const handleRedownload = (download: DownloadHistoryItem) => {
    // In a real app, this would trigger the download modal
    console.log('Re-downloading:', download);
    alert(`Re-downloading "${download.image_title}" in ${download.resolution} resolution`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <DownloadHistory
        userId={user.id}
        onRedownload={handleRedownload}
      />
    </div>
  );
}
