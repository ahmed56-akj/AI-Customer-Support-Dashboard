"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TicketListTable } from "@/features/tickets/TicketListTable";
import { getTickets } from "@/services/ticketService";
import { Ticket } from "@/types";
import { TableRowSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");

  const loadData = async () => {
    try {
      setHasError(false);
      const data = await getTickets({
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy,
      });
      setTickets(data);
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  return (
    <AppLayout
      title="Ticket Management"
      subtitle="Track customer technical issues, prioritize SLA resolution, and assign agents"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {hasError ? (
          <ErrorState
            title="Failed to load support tickets"
            message="There was an issue fetching ticket records. Please try again."
            onRetry={loadData}
          />
        ) : isLoading ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={6} />
            ))}
          </div>
        ) : (
          <TicketListTable
            tickets={tickets}
            onRefresh={loadData}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        )}
      </div>
    </AppLayout>
  );
}
