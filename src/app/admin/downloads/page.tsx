"use client";

export const dynamic = 'force-dynamic';

import DownloadAnalytics from "@/components/DownloadAnalytics";

export default function AdminDownloadsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Download Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into download patterns, user behavior, and revenue metrics
        </p>
      </div>

      {/* Analytics Component */}
      <DownloadAnalytics />
    </div>
  );
}
