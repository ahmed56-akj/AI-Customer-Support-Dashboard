"use client";

import React, { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createTicket } from "@/services/ticketService";
import { toast } from "sonner";
import { TicketPriority, TicketCategory } from "@/types";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ onOpenMobileMenu, title, subtitle }: HeaderProps) {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [category, setCategory] = useState<TicketCategory>("Technical");

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !customerName.trim() || !customerEmail.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmittingTicket(true);
    try {
      await createTicket({
        subject,
        description,
        customerId: "CUST-" + Math.floor(100 + Math.random() * 900),
        customerName,
        customerEmail,
        customerCompany: customerCompany || "Self",
        assignedAgentId: user?.id || "AGT-101",
        assignedAgentName: user?.name || "Alex Vance",
        priority,
        status: "Open",
        category,
        tags: ["Manual"],
      });
      toast.success("Ticket created successfully!");
      setShowNewTicketModal(false);
      // Reset form
      setSubject("");
      setDescription("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerCompany("");
    } catch {
      toast.error("Failed to create ticket.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const notifications = [
    {
      id: "1",
      title: "New ticket assigned",
      desc: "Ahmed Khan: SAML 2.0 provisioning fails",
      time: "5m ago",
      read: false,
    },
    {
      id: "2",
      title: "CSAT 5.0 Received ⭐",
      desc: "Dr. Priya Sharma rated conversation excellent",
      time: "25m ago",
      read: false,
    },
    {
      id: "3",
      title: "SLA Warning",
      desc: "Ticket TCK-1044 is approaching 1h response window",
      time: "1h ago",
      read: true,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6">
        {/* Left: Mobile trigger & Page Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            {title && (
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions, AI indicator, Theme, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Helper Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span className="font-semibold">AI Assistant:</span>
            <span className="text-slate-600 dark:text-slate-400">Ready</span>
          </div>

          {/* Quick Create Ticket Button */}
          <Button
            size="sm"
            onClick={() => setShowNewTicketModal(true)}
            className="hidden sm:inline-flex gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 px-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notifications
                  </span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="hidden sm:block pl-1">
            <Avatar
              name={user?.name || "Alex Vance"}
              src={user?.avatar}
              size="sm"
              status="online"
            />
          </div>
        </div>
      </header>

      {/* Quick New Ticket Modal */}
      <Modal
        isOpen={showNewTicketModal}
        onClose={() => setShowNewTicketModal(false)}
        title="Create New Support Ticket"
        description="Submit a new customer issue to track resolution and dispatch agent."
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Ticket Subject *"
            placeholder="e.g. SSO Login gateway error 502"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer Name *"
              placeholder="e.g. John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="Customer Email *"
              type="email"
              placeholder="john@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Company Name"
              placeholder="Acme Corp"
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

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Issue Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue reported by the customer..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewTicketModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingTicket}>
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
