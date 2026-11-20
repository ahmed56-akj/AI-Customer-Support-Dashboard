"use client";

import React, { useState } from "react";
import { Conversation, TicketPriority } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge } from "@/components/ui/Badge";
import { formatTimeAgo } from "@/lib/utils";
import { Filter, Inbox, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (p: string) => void;
  unreadOnly: boolean;
  onToggleUnreadOnly: () => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  unreadOnly,
  onToggleUnreadOnly,
}: ConversationListProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Conversations
            </h2>
            <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {conversations.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleUnreadOnly}
              className={cn(
                "px-2 py-1 text-xs rounded-md font-medium transition-colors",
                unreadOnly
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              Unread
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                (filterStatus !== "all" || filterPriority !== "all") && "text-indigo-600"
              )}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <SearchInput
          placeholder="Search by name, message, email..."
          value={searchQuery}
          onChange={onSearchChange}
        />

        {showFilters && (
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            <select
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className="h-7 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => onFilterPriorityChange(e.target.value)}
              className="h-7 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Conversation Item List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No conversations match your criteria
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full text-left p-3.5 transition-colors flex items-start gap-3 relative focus-visible:outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800",
                  isSelected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-l-4 border-l-indigo-600"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                {/* Customer Avatar & Unread indicator */}
                <div className="relative">
                  <Avatar name={conv.customerName} src={conv.customerAvatar} size="sm" />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={cn(
                        "text-xs truncate",
                        conv.unreadCount > 0 ? "font-bold text-slate-900 dark:text-slate-100" : "font-semibold text-slate-800 dark:text-slate-200"
                      )}
                    >
                      {conv.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {formatTimeAgo(conv.lastMessageAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mb-1">
                    {conv.customerCompany}
                  </p>

                  <p
                    className={cn(
                      "text-xs line-clamp-1 mb-2",
                      conv.unreadCount > 0
                        ? "font-medium text-slate-900 dark:text-slate-100"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={conv.priority} />
                    {conv.assignedAgentName && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                        {conv.assignedAgentName}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
