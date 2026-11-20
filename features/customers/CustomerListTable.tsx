"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Customer, CustomerStatus } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { Plus, Users, ChevronLeft, ChevronRight, ExternalLink, Mail, Building, Phone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createCustomer } from "@/services/customerService";
import { toast } from "sonner";

interface CustomerListTableProps {
  customers: Customer[];
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
}

export function CustomerListTable({
  customers,
  onRefresh,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CustomerListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Customer state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<CustomerStatus>("active");
  const [tagsInput, setTagsInput] = useState("Enterprise, Cloud");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = Math.ceil(customers.length / pageSize) || 1;
  const paginated = customers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide at least a name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createCustomer({
        name,
        email,
        company: company || "Independent",
        phone,
        location,
        status,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        tags: parsedTags.length > 0 ? parsedTags : ["Customer"],
      });

      toast.success("Customer added successfully!");
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setLocation("");
      onRefresh();
    } catch {
      toast.error("Failed to add customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search by customer name, email, company, tag..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="all">All Customer Statuses</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="lead">Lead</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Tickets</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No customers match your criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} src={c.avatar} size="sm" />
                        <div>
                          <Link
                            href={`/customers/${c.id}`}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {c.name}
                          </Link>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {c.company}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">
                        {c.ticketsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {c.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatTimeAgo(c.lastActivity)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/customers/${c.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Profile
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, customers.length)} of {customers.length} customers
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

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer Profile"
        description="Register an account or client profile in SupportAI."
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name *"
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="maya@quantum.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Company"
              placeholder="Quantum Leap Inc"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="+1 555-0192"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as CustomerStatus)}
              options={[
                { label: "Active", value: "active" },
                { label: "VIP", value: "vip" },
                { label: "Lead", value: "lead" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>

          <Input
            label="Location / Office"
            placeholder="New York, NY, USA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Input
            label="Tags (comma-separated)"
            placeholder="Enterprise, Healthcare, Cloud"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Add Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
