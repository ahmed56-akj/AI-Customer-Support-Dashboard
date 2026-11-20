"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardMetrics } from "@/features/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/features/dashboard/DashboardCharts";
import { RecentActivity } from "@/features/dashboard/RecentActivity";
import { getAnalytics } from "@/services/analyticsService";
import { getConversations } from "@/services/conversationService";
import { getTickets } from "@/services/ticketService";
import { AnalyticsData, Conversation, Ticket } from "@/types";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "90d">("7d");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async (range: "today" | "7d" | "30d" | "90d") => {
    try {
      setHasError(false);
      const [anData, convs, tcks] = await Promise.all([
        getAnalytics(range),
        getConversations(),
        getTickets(),
      ]);
      setAnalytics(anData);
      setConversations(convs);
      setTickets(tcks);
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange]);

  return (
    <AppLayout
      title="Support Command Center"
      subtitle="Executive customer operations, response velocity, and AI resolution metrics"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {hasError ? (
          <ErrorState
            title="Failed to load dashboard metrics"
            message="We were unable to load real-time analytics. Please click retry below."
            onRetry={() => loadData(timeRange)}
          />
        ) : isLoading || !analytics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <DashboardMetrics data={analytics} />

            {/* Visual Recharts with Date Filters */}
            <DashboardCharts
              data={analytics}
              timeRange={timeRange}
              onTimeRangeChange={(r) => setTimeRange(r)}
            />

            {/* Recent Feeds: Conversations, Tickets, Team Activity */}
            <RecentActivity conversations={conversations} tickets={tickets} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
