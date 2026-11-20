import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
}

export function SearchInput({
  className,
  value: controlledValue,
  onChange,
  onClear,
  debounceMs = 250,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || "");

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs, onChange]);

  const handleClear = () => {
    setInternalValue("");
    if (onChange) onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-8 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
        {...props}
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          type="button"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
