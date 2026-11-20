"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Inbox,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  Headphones,
  X,
  ChevronRight,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onCloseMobile, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      matchExact: true,
    },
    {
      label: "Support Inbox",
      href: "/inbox",
      icon: Inbox,
      badge: "3",
    },
    {
      label: "Tickets",
      href: "/tickets",
      icon: Ticket,
      badge: "6",
    },
    {
      label: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.matchExact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 select-none",
        isMobile ? "w-full" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Headphones className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">SupportAI</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400">AI Customer Support</span>
          </div>
        </Link>

        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* AI Copilot Status Banner */}
      <div className="px-4 pt-4 pb-1">
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="font-medium text-indigo-200">AI Copilot</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Online
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs font-bold rounded-full",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-300 border border-slate-700/60"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Agent Card Footer */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-800">
          <Link
            href="/settings"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity"
          >
            <Avatar
              name={user?.name || "Alex Vance"}
              src={user?.avatar}
              size="sm"
              status="online"
            />
            <div className="truncate text-left">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "Alex Vance"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.role === "admin" ? "Senior Support Lead" : "Support Agent"}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
