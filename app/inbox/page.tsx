import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InboxView } from "@/features/inbox/InboxView";

export default function InboxPage() {
  return (
    <AppLayout
      title="Omnichannel Support Inbox"
      subtitle="AI-assisted conversation triage and instant response composer"
    >
      <InboxView />
    </AppLayout>
  );
}
