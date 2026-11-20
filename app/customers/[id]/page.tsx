"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { CustomerDetailsView } from "@/features/customers/CustomerDetailsView";
import { getCustomerById } from "@/services/customerService";
import { getTickets } from "@/services/ticketService";
import { getConversations } from "@/services/conversationService";
import { Customer, Ticket, Conversation } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const c = await getCustomerById(id);
      if (c) {
        setCustomer(c);
        const [allTickets, allConvs] = await Promise.all([
          getTickets({ search: c.name }),
          getConversations({ search: c.name }),
        ]);
        setTickets(allTickets);
        setConversations(allConvs);
      }
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout title="Customer Profile">
        <div className="p-8 max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout title="Customer Not Found">
        <div className="p-12 max-w-md mx-auto text-center">
          <EmptyState
            icon={Users}
            title="Customer Not Found"
            description={`No customer account exists matching ID "${id}".`}
            actionLabel="Return to Customer Directory"
            onAction={() => router.push("/customers")}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={customer.name}
      subtitle={`Customer 360 profile for ${customer.company}`}
    >
      <CustomerDetailsView
        initialCustomer={customer}
        tickets={tickets}
        conversations={conversations}
      />
    </AppLayout>
  );
}
