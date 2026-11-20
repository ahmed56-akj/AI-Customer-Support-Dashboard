import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <AppLayout
      title="Analytics & Intelligence"
      subtitle="Comprehensive metrics on response time, resolution volume, and agent performance"
    >
      <AnalyticsView />
    </AppLayout>
  );
}
