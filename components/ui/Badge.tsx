import React from "react";
import { cn } from "@/lib/utils";
import { TicketPriority, TicketStatus, CustomerStatus } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-brand-500/10 text-brand-500 border-brand-500/20",
    secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    outline: "border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority | string }) {
  const p = priority.toLowerCase();
  if (p === "urgent") {
    return (
      <Badge variant="danger">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
        Urgent
      </Badge>
    );
  }
  if (p === "high") {
    return (
      <Badge variant="warning">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        High
      </Badge>
    );
  }
  if (p === "medium") {
    return (
      <Badge variant="info">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        Medium
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Low
    </Badge>
  );
}

export function StatusBadge({ status }: { status: TicketStatus | CustomerStatus | string }) {
  const s = status.toLowerCase();
  if (s === "open" || s === "active") {
    return (
      <Badge variant="success">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {status}
      </Badge>
    );
  }
  if (s === "pending") {
    return (
      <Badge variant="warning">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pending
      </Badge>
    );
  }
  if (s === "resolved") {
    return (
      <Badge variant="info">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        Resolved
      </Badge>
    );
  }
  if (s === "closed" || s === "inactive") {
    return (
      <Badge variant="secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {status}
      </Badge>
    );
  }
  if (s === "vip") {
    return (
      <Badge variant="purple">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
        VIP
      </Badge>
    );
  }
  if (s === "lead") {
    return (
      <Badge variant="info">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        Lead
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
}
