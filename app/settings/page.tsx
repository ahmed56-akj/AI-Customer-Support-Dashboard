import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsView } from "@/features/settings/SettingsView";

export default function SettingsPage() {
  return (
    <AppLayout
      title="Settings & Preferences"
      subtitle="Configure workspace settings, notification rules, and AI reply assistant"
    >
      <SettingsView />
    </AppLayout>
  );
}
