import React from "react";
import Link from "next/link";
import { Conversation, Ticket } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { formatTimeAgo } from "@/lib/utils";
import { MessageSquare, Ticket as TicketIcon, Clock, ArrowRight, Sparkles } from "lucide-react";

interface RecentActivityProps {
  conversations: Conversation[];
  tickets: Ticket[];
}

export function RecentActivity({ conversations, tickets }: RecentActivityProps) {
  const recentConvs = conversations.slice(0, 4);
  const recentTickets = tickets.slice(0, 4);

  const activities = [
    {
      id: "a1",
      user: "Alex Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      action: "used AI Reply Assistant for",
      target: "Ahmed Khan (Password Reset)",
      time: "10 mins ago",
      icon: Sparkles,
      iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60",
    },
    {
      id: "a2",
      user: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      action: "marked ticket resolved",
      target: "TCK-1038 (Billing Refund)",
      time: "35 mins ago",
      icon: TicketIcon,
      iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      id: "a3",
      user: "Marcus Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      action: "assigned urgent priority to",
      target: "TCK-1044 (HIPAA Audit Export)",
      time: "1 hour ago",
      icon: Clock,
      iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Recent Conversations */}
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              Recent Conversations
            </CardTitle>
            <CardDescription>Live messages from customers</CardDescription>
          </div>
          <Link
            href="/inbox"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 pt-0">
          {recentConvs.map((conv) => (
            <Link
              key={conv.id}
              href="/inbox"
              className="group block p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/70 hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={conv.customerName} src={conv.customerAvatar} size="xs" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {conv.customerName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">
                  {formatTimeAgo(conv.lastMessageAt)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                {conv.lastMessage}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {conv.customerCompany}
                </span>
                <PriorityBadge priority={conv.priority} />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* 2. Recent Tickets */}
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-emerald-500" />
              Recent Tickets
            </CardTitle>
            <CardDescription>Latest customer issues logged</CardDescription>
          </div>
          <Link
            href="/tickets"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 pt-0">
          {recentTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group block p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/70 hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {ticket.id}
                </span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
                {ticket.subject}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{ticket.customerName}</span>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* 3. Recent Activity Stream */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Team Activity Feed
          </CardTitle>
          <CardDescription>Real-time team audit log</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 pt-0">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <Avatar name={act.user} src={act.avatar} size="xs" />
                <div className="flex-1 space-y-0.5">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {act.user}
                    </span>{" "}
                    {act.action}{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {act.target}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400">{act.time}</p>
                </div>
                <div className={`p-1.5 rounded-lg ${act.iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
