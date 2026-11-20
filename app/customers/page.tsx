"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CustomerListTable } from "@/features/customers/CustomerListTable";
import { getCustomers } from "@/services/customerService";
import { Customer } from "@/types";
import { TableRowSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setHasError(false);
      const data = await getCustomers(searchQuery, statusFilter);
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter]);

  return (
    <AppLayout
      title="Customer Directory"
      subtitle="View client accounts, SLA health status, tickets count, and contact records"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {hasError ? (
          <ErrorState
            title="Failed to load customer profiles"
            message="We encountered an issue fetching customer records. Please retry."
            onRetry={loadData}
          />
        ) : isLoading ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={7} />
            ))}
          </div>
        ) : (
          <CustomerListTable
            customers={customers}
            onRefresh={loadData}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </div>
    </AppLayout>
  );
}
