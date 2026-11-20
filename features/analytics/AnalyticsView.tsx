"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { getAnalytics } from "@/services/analyticsService";
import { AnalyticsData } from "@/types";
import {
  BarChart3,
  TrendingUp,
  Clock,
  ThumbsUp,
  MessageSquare,
  Ticket,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function load() {
      const res = await getAnalytics(timeRange);
      setData(res);
    }
    load();
  }, [timeRange]);

  if (!isMounted || !data) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Conversations",
      value: data.totalConversations.toLocaleString(),
      change: "+18%",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      title: "Total Tickets",
      value: (data.openTickets + data.resolvedTickets).toLocaleString(),
      change: "+12%",
      icon: Ticket,
      color: "text-indigo-500",
    },
    {
      title: "Resolved Tickets",
      value: data.resolvedTickets.toLocaleString(),
      change: "+16%",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      title: "Avg Response Time",
      value: `${data.avgResponseTimeMinutes} mins`,
      change: "-3.2m",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: "Resolution Rate",
      value: `${data.resolutionRatePercent}%`,
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Customer Satisfaction",
      value: `${data.csatScore}%`,
      change: "+0.8%",
      icon: ThumbsUp,
      color: "text-rose-500",
    },
  ];

  const categoryColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"];
  const priorityColors = ["#f43f5e", "#f59e0b", "#0ea5e9", "#94a3b8"];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Filter and Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
            Support & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time customer satisfaction metrics, SLA tracking, and ticket volumes.
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {(["today", "7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                timeRange === r
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {r === "today" ? "Today" : r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.title} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  {c.title}
                </span>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {c.value}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {c.change} vs prior
              </div>
            </Card>
          );
        })}
      </div>

      {/* Primary Chart Row: Conversations per day & Customer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations Per Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              Conversations Per Day
            </CardTitle>
            <CardDescription>Inbound chat & email volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.conversationsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "#334155",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Conversations" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              Customer Base Growth
            </CardTitle>
            <CardDescription>Accounts actively serviced</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.customerGrowth}>
                  <defs>
                    <linearGradient id="anGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={["dataMin - 40", "dataMax + 40"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "#334155",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    name="Total Customers"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#anGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Chart Row: Category Breakdown & Priority Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tickets By Category */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" />
              Tickets by Category
            </CardTitle>
            <CardDescription>Technical, billing, account, features</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ticketsByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.15} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "#334155",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Tickets" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tickets By Priority */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Ticket className="h-4 w-4 text-rose-500" />
              Tickets by Priority
            </CardTitle>
            <CardDescription>Urgent, High, Medium, Low breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ticketsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="priority" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "#334155",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Tickets" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Rate */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Resolution Rate (%)
            </CardTitle>
            <CardDescription>Historical SLA performance</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.ticketResolutionRate}>
                  <defs>
                    <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "#334155",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    name="Resolution %"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#rateGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-emerald-500" />
            Support Agent Performance Leaderboard
          </CardTitle>
          <CardDescription>
            Individual resolution counts, customer satisfaction score, and average handle time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Tickets Resolved</th>
                  <th className="py-3 px-4">CSAT Rating</th>
                  <th className="py-3 px-4">Avg Handle Time</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.agentPerformance.map((agent) => (
                  <tr key={agent.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {agent.name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {agent.resolved} tickets
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        ⭐ {agent.satisfaction}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {agent.avgTimeMin} mins
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                        Top Tier
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
