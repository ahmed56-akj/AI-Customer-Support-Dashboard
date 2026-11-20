"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Customer, Ticket, Conversation, CustomerStatus } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { updateCustomer, addCustomerNote } from "@/services/customerService";
import {
  ArrowLeft,
  Mail,
  Building,
  Phone,
  MapPin,
  Calendar,
  Ticket as TicketIcon,
  MessageSquare,
  Activity,
  Edit,
  Plus,
  Send,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface CustomerDetailsViewProps {
  initialCustomer: Customer;
  tickets: Ticket[];
  conversations: Conversation[];
}

export function CustomerDetailsView({
  initialCustomer,
  tickets,
  conversations,
}: CustomerDetailsViewProps) {
  const { user } = useAuthStore();
  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [company, setCompany] = useState(customer.company);
  const [phone, setPhone] = useState(customer.phone || "");
  const [location, setLocation] = useState(customer.location || "");
  const [status, setStatus] = useState<CustomerStatus>(customer.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const note = await addCustomerNote(customer.id, newNote, user?.name || "Alex Vance");
      setCustomer((prev) => ({
        ...prev,
        notes: [note, ...prev.notes],
        lastActivity: new Date().toISOString(),
      }));
      setNewNote("");
      toast.success("Internal note added.");
    } catch {
      toast.error("Failed to add note.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await updateCustomer(customer.id, {
        name,
        email,
        company,
        phone,
        location,
        status,
      });
      setCustomer(updated);
      setIsEditModalOpen(false);
      toast.success("Customer details updated successfully!");
    } catch {
      toast.error("Failed to update customer.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/customers"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {customer.id}
          </span>
          <StatusBadge status={customer.status} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit Profile
          </Button>

          <Link href="/inbox">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <MessageSquare className="h-3.5 w-3.5" />
              Open Conversation
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Profile Card, Right Tabs/Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile & Contact Information */}
        <div className="space-y-6">
          <Card className="p-6 text-center space-y-4">
            <Avatar
              name={customer.name}
              src={customer.avatar}
              size="xl"
              className="mx-auto"
              status="online"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {customer.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{customer.company}</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <StatusBadge status={customer.status} />
            </div>

            {/* Contact Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Contact Details
              </span>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building className="h-4 w-4 text-slate-400" />
                <span>{customer.company}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{customer.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Joined {formatDate(customer.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Active {formatTimeAgo(customer.lastActivity)}</span>
              </div>
            </div>

            {/* Segments & Tags */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Segments & Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Internal Team Notes */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Internal Team Notes ({customer.notes.length})
            </h3>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal note about this account..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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

            <div className="space-y-2.5 pt-1">
              {customer.notes.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span>{n.authorName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Conversations, Tickets, & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Support Tickets submitted by this customer */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TicketIcon className="h-4 w-4 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Customer Tickets ({tickets.length})
                </h2>
              </div>
              <Link
                href="/tickets"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all tickets
              </Link>
            </div>

            {tickets.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs">
                No tickets associated with this customer.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {t.id}
                        </span>
                        <StatusBadge status={t.status} />
                        <PriorityBadge priority={t.priority} />
                      </div>
                      <Link
                        href={`/tickets/${t.id}`}
                        className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                      >
                        {t.subject}
                      </Link>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        {formatTimeAgo(t.createdAt)}
                      </span>
                      <Link
                        href={`/tickets/${t.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Details
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Conversations with this customer */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Conversation Threads ({conversations.length})
                </h2>
              </div>
              <Link
                href="/inbox"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Go to Inbox
              </Link>
            </div>

            {conversations.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-xs">
                No active conversations with this customer.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          Channel: {c.channel.toUpperCase()}
                        </span>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-1">
                        {c.lastMessage}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        {formatTimeAgo(c.lastMessageAt)}
                      </span>
                      <Link
                        href="/inbox"
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Open Chat
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Account Activity Timeline
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              {customer.activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {act.description}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatTimeAgo(act.timestamp)} &bull; {formatDate(act.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
        description="Update account contact details and status."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
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
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
