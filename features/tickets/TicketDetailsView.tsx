"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDate, formatTimeAgo } from "@/lib/utils";
import { initialAgents } from "@/services/mockData";
import { updateTicket, addTicketNote } from "@/services/ticketService";
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  Calendar,
  Clock,
  Tag,
  Plus,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface TicketDetailsViewProps {
  initialTicket: Ticket;
}

export function TicketDetailsView({ initialTicket }: TicketDetailsViewProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState<Ticket>(initialTicket);
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    try {
      const updated = await updateTicket(ticket.id, { status: newStatus });
      setTicket(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handlePriorityChange = async (newPriority: TicketPriority) => {
    try {
      const updated = await updateTicket(ticket.id, { priority: newPriority });
      setTicket(updated);
      toast.success(`Priority updated to ${newPriority}`);
    } catch {
      toast.error("Failed to update priority.");
    }
  };

  const handleAgentChange = async (agentId: string) => {
    const agent = initialAgents.find((a) => a.id === agentId);
    try {
      const updated = await updateTicket(ticket.id, {
        assignedAgentId: agent?.id,
        assignedAgentName: agent?.name,
      });
      setTicket(updated);
      toast.success(`Assigned to ${agent?.name || "Unassigned"}`);
    } catch {
      toast.error("Failed to assign agent.");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const note = await addTicketNote(
        ticket.id,
        newNote,
        user?.name || "Alex Vance",
        user?.avatar
      );
      setTicket((prev) => ({
        ...prev,
        notes: [note, ...prev.notes],
        updatedAt: new Date().toISOString(),
      }));
      setNewNote("");
      toast.success("Internal note added to ticket history.");
    } catch {
      toast.error("Failed to add note.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (ticket.tags.includes(tag)) {
      setNewTagInput("");
      setShowAddTag(false);
      return;
    }
    const updatedTags = [...ticket.tags, tag];
    const updated = await updateTicket(ticket.id, { tags: updatedTags });
    setTicket(updated);
    setNewTagInput("");
    setShowAddTag(false);
    toast.success(`Added tag: ${tag}`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {ticket.id}
          </span>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link href="/inbox">
            <Button size="sm" variant="subtle" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>Open in Inbox</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Details & Notes, Right Meta Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Subject, Description & Internal Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header & Content Card */}
          <Card className="p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {ticket.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                {ticket.subject}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Reported {formatDate(ticket.createdAt)} by{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {ticket.customerName}
                </span>{" "}
                ({ticket.customerCompany})
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Problem Description
              </h3>
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {ticket.description}
              </p>
            </div>

            {/* Tags section */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Tags:
              </span>
              {ticket.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}

              {showAddTag ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="tag..."
                    className="h-6 w-20 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-1 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag();
                    }}
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[11px]"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTag(true)}
                  className="px-2 py-0.5 rounded border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add tag
                </button>
              )}
            </div>
          </Card>

          {/* Internal Notes & Audit Trail Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                Internal Agent Notes ({ticket.notes.length})
              </h2>
              <span className="text-xs text-slate-400">Visible only to team members</span>
            </div>

            {/* Note composer */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal diagnostics, engineering updates, or reproduction steps..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newNote.trim()}
                  isLoading={isSubmittingNote}
                  className="gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Add Note
                </Button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {ticket.notes.length === 0 ? (
                <p className="text-center text-slate-400 py-6 text-xs">
                  No internal notes recorded yet.
                </p>
              ) : (
                ticket.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={note.authorName} src={note.authorAvatar} size="xs" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {note.authorName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Ticket Controls & Metadata */}
        <div className="space-y-6">
          {/* Controls Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ticket Settings
            </h3>

            {/* Change Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ticket Status
              </label>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Change Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority Level
              </label>
              <select
                value={ticket.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Assigned Agent */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Assigned Agent
              </label>
              <select
                value={ticket.assignedAgentId || ""}
                onChange={(e) => handleAgentChange(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="">Unassigned</option>
                {initialAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.department})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Customer Card */}
          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Details
            </h3>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Avatar name={ticket.customerName} size="md" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {ticket.customerName}
                </p>
                <p className="text-xs text-slate-500">{ticket.customerCompany}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{ticket.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                <span>{ticket.customerCompany}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Created {formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Last updated {formatTimeAgo(ticket.updatedAt)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/customers/${ticket.customerId}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                View Customer 360° Profile
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
