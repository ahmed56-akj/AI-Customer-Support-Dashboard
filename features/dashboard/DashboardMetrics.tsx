import React from "react";
import { Users, Ticket, CheckCircle2, Clock, ThumbsUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AnalyticsData } from "@/types";

interface DashboardMetricsProps {
  data: AnalyticsData;
}

export function DashboardMetrics({ data }: DashboardMetricsProps) {
  const metrics = [
    {
      title: "Total Customers",
      value: data.totalCustomers.toLocaleString(),
      change: "+8.4%",
      isPositive: true,
      timeframe: "vs last period",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
    },
    {
      title: "Open Tickets",
      value: data.openTickets.toString(),
      change: "-4.2%",
      isPositive: true,
      timeframe: "vs last period",
      icon: Ticket,
      color: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    },
    {
      title: "Resolved Tickets",
      value: data.resolvedTickets.toLocaleString(),
      change: "+14.8%",
      isPositive: true,
      timeframe: "vs last period",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    },
    {
      title: "Avg Response Time",
      value: `${data.avgResponseTimeMinutes} mins`,
      change: "-2.5 mins",
      isPositive: true,
      timeframe: "vs SLA goal",
      icon: Clock,
      color: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
    },
    {
      title: "Customer Satisfaction",
      value: `${data.csatScore}%`,
      change: "+1.2%",
      isPositive: true,
      timeframe: "from 412 reviews",
      icon: ThumbsUp,
      color: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-500/10 text-rose-500 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card
            key={m.title}
            className="p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {m.title}
              </span>
              <div className={`p-2 rounded-xl ${m.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {m.value}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span
                className={`inline-flex items-center font-semibold ${
                  m.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {m.isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {m.change}
              </span>
              <span className="text-slate-400 dark:text-slate-500">{m.timeframe}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
