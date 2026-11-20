"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { TicketDetailsView } from "@/features/tickets/TicketDetailsView";
import { getTicketById } from "@/services/ticketService";
import { Ticket } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Ticket as TicketIcon } from "lucide-react";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const res = await getTicketById(id);
      setTicket(res);
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout title="Ticket Details">
        <div className="p-8 max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </AppLayout>
    );
  }

  if (!ticket) {
    return (
      <AppLayout title="Ticket Not Found">
        <div className="p-12 max-w-md mx-auto text-center">
          <EmptyState
            icon={TicketIcon}
            title="Ticket Not Found"
            description={`No ticket exists matching ID "${id}". It may have been archived or removed.`}
            actionLabel="Return to Ticket Directory"
            onAction={() => router.push("/tickets")}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Ticket #${ticket.id}`}
      subtitle={`${ticket.category} inquiry submitted by ${ticket.customerName}`}
    >
      <TicketDetailsView initialTicket={ticket} />
    </AppLayout>
  );
}
