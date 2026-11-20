"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import {
  Plus,
  Filter,
  ArrowUpDown,
  Ticket as TicketIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createTicket } from "@/services/ticketService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface TicketListTableProps {
  tickets: Ticket[];
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (p: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (c: string) => void;
  sortBy: "newest" | "oldest" | "priority";
  onSortByChange: (s: "newest" | "oldest" | "priority") => void;
}

export function TicketListTable({
  tickets,
  onRefresh,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
}: TicketListTableProps) {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Ticket Form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [status, setStatus] = useState<TicketStatus>("Open");
  const [category, setCategory] = useState<TicketCategory>("Technical");
  const [tagsInput, setTagsInput] = useState("Enterprise, Urgent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = Math.ceil(tickets.length / pageSize) || 1;
  const paginatedTickets = tickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !customerName.trim() || !customerEmail.trim()) {
      toast.error("Please fill in subject and customer information.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createTicket({
        subject,
        description,
        customerId: "CUST-" + Math.floor(100 + Math.random() * 900),
        customerName,
        customerEmail,
        customerCompany: customerCompany || "Client Org",
        assignedAgentId: user?.id || "AGT-101",
        assignedAgentName: user?.name || "Alex Vance",
        priority,
        status,
        category,
        tags: parsedTags.length > 0 ? parsedTags : ["New"],
      });

      toast.success("Ticket created successfully!");
      setIsCreateModalOpen(false);
      // Reset form
      setSubject("");
      setDescription("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerCompany("");
      onRefresh();
    } catch {
      toast.error("Failed to create ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter, Sort, and Create Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search tickets by ID, subject, customer, tag..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General">General</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="priority">Sort: Priority</option>
          </select>

          {/* Create Button */}
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </Button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4 min-w-[220px]">Subject</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <TicketIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No tickets found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      <Link href={`/tickets/${t.id}`} className="hover:underline">
                        {t.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                      <Link
                        href={`/tickets/${t.id}`}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                      >
                        {t.subject}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        {t.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {t.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">{t.customerCompany}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {t.assignedAgentName || (
                        <span className="italic text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatTimeAgo(t.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/tickets/${t.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, tickets.length)} of {tickets.length} tickets
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Support Ticket"
        description="Enter customer details and issue breakdown."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Subject *"
            placeholder="e.g. 504 Gateway Timeout during data export"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer Name *"
              placeholder="e.g. Elena Rostova"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="Customer Email *"
              type="email"
              placeholder="elena@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Company"
              placeholder="FinEdge Corp"
              value={customerCompany}
              onChange={(e) => setCustomerCompany(e.target.value)}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
                { label: "Urgent", value: "Urgent" },
              ]}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              options={[
                { label: "Technical", value: "Technical" },
                { label: "Billing", value: "Billing" },
                { label: "Account", value: "Account" },
                { label: "Feature Request", value: "Feature Request" },
                { label: "General", value: "General" },
              ]}
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="Security, API, Escalated"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full details, steps to reproduce, or notes..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
