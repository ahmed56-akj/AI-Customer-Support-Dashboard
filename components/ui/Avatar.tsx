import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  status?: "online" | "busy" | "offline";
}

export function Avatar({ src, name, size = "md", className, status }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizeStyles = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const statusSize = {
    xs: "h-1.5 w-1.5 right-0 bottom-0 ring-1",
    sm: "h-2 w-2 right-0 bottom-0 ring-1",
    md: "h-2.5 w-2.5 right-0.5 bottom-0.5 ring-2",
    lg: "h-3 w-3 right-0.5 bottom-0.5 ring-2",
    xl: "h-3.5 w-3.5 right-1 bottom-1 ring-2",
  };

  const statusColors = {
    online: "bg-emerald-500",
    busy: "bg-amber-500",
    offline: "bg-slate-400",
  };

  return (
    <div className={cn("relative inline-block select-none flex-shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm",
          sizeStyles[size]
        )}
      >
        {src && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute rounded-full ring-white dark:ring-slate-900",
            statusColors[status],
            statusSize[size]
          )}
        />
      )}
    </div>
  );
}
