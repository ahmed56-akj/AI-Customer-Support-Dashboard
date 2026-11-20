"use client";

import React, { useState, useEffect } from "react";
import { Customer, Ticket } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { getCustomerById, addCustomerNote } from "@/services/customerService";
import { getTickets } from "@/services/ticketService";
import { formatTimeAgo, formatDate } from "@/lib/utils";
import {
  Mail,
  Building,
  Phone,
  MapPin,
  Calendar,
  Ticket as TicketIcon,
  Activity,
  Plus,
  Send,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface CustomerProfileSidebarProps {
  customerId: string;
  onClose?: () => void;
}

export function CustomerProfileSidebar({
  customerId,
  onClose,
}: CustomerProfileSidebarProps) {
  const { user } = useAuthStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "tickets" | "activity">("info");

  useEffect(() => {
    async function loadData() {
      const c = await getCustomerById(customerId);
      setCustomer(c);
      const t = await getTickets({ search: c?.name });
      setTickets(t);
    }
    loadData();
  }, [customerId]);

  if (!customer) {
    return (
      <div className="w-80 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center text-slate-400 text-xs">
        Loading customer profile...
      </div>
    );
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      await addCustomerNote(customer.id, newNote, user?.name || "Alex Vance");
      const updated = await getCustomerById(customer.id);
      setCustomer(updated);
      setNewNote("");
      toast.success("Internal note added to customer profile.");
    } catch {
      toast.error("Failed to add note.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="w-80 h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Customer Profile
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Profile Overview Card */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-center">
        <Avatar
          name={customer.name}
          src={customer.avatar}
          size="lg"
          className="mx-auto mb-2.5"
          status={customer.status === "active" || customer.status === "vip" ? "online" : "offline"}
        />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {customer.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {customer.company}
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <StatusBadge status={customer.status} />
          <Link
            href={`/customers/${customer.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pl-2"
          >
            Full Profile
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
            activeTab === "info"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
            activeTab === "tickets"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
            activeTab === "activity"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeTab === "info" && (
          <div className="space-y-4">
            {/* Contact details */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Contact Information
              </span>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{customer.company}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{customer.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Customer since {formatDate(customer.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tags & Segments
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Internal Notes ({customer.notes.length})
              </span>

              <form onSubmit={handleAddNote} className="space-y-1.5">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add note for the team..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 text-xs text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                />
                <Button
                  type="submit"
                  size="xs"
                  disabled={!newNote.trim()}
                  isLoading={isSubmittingNote}
                  className="w-full gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Save Note
                </Button>
              </form>

              <div className="space-y-2 pt-2">
                {customer.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]"
                  >
                    <div className="flex items-center justify-between mb-1 font-semibold text-slate-800 dark:text-slate-200">
                      <span>{n.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-2.5">
            {tickets.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs">No tickets logged.</p>
            ) : (
              tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/tickets/${t.id}`}
                  className="block p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                      {t.id}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                    {t.subject}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{formatDate(t.createdAt)}</span>
                    <PriorityBadge priority={t.priority} />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-3">
            {customer.activities.map((act) => (
              <div key={act.id} className="flex items-start gap-2 text-[11px]">
                <div className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Activity className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {formatTimeAgo(act.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
