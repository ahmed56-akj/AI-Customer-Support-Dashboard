"use client";

import React, { useState, useRef, useEffect } from "react";
import { Conversation, Message } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AIReplyAssistant } from "./AIReplyAssistant";
import {
  Send,
  Paperclip,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  MoreVertical,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import { formatTimeAgo, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface ConversationChatProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, attachments?: { name: string; size: string; type: string }[]) => Promise<void>;
  onToggleProfileSidebar: () => void;
  onUpdateStatus: (status: Conversation["status"]) => void;
  isProfileSidebarOpen?: boolean;
}

export function ConversationChat({
  conversation,
  messages,
  onSendMessage,
  onToggleProfileSidebar,
  onUpdateStatus,
  isProfileSidebarOpen = true,
}: ConversationChatProps) {
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; size: string; type: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;

    const text = inputText;
    const currentAttachments = [...attachments];
    setInputText("");
    setAttachments([]);
    setIsSending(true);

    try {
      await onSendMessage(text, currentAttachments.length > 0 ? currentAttachments : undefined);
      // Simulate quick typing indicator from customer after a bit if wanted
    } catch {
      toast.error("Failed to deliver message.");
      setInputText(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleUseReplyFromAI = (replyText: string) => {
    setInputText(replyText);
  };

  const handleSimulateAttachment = () => {
    const mockFiles = [
      { name: "diagnostic_log_2026.json", size: "142 KB", type: "application/json" },
      { name: "screenshot_error_okta.png", size: "640 KB", type: "image/png" },
      { name: "sla_agreement_v2.pdf", size: "1.2 MB", type: "application/pdf" },
    ];
    const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachments((prev) => [...prev, picked]);
    toast.success(`Attached ${picked.name}`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40">
      {/* 1. Conversation Header */}
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            name={conversation.customerName}
            src={conversation.customerAvatar}
            size="md"
            status="online"
          />
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {conversation.customerName}
              </h2>
              <StatusBadge status={conversation.status} />
              <PriorityBadge priority={conversation.priority} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {conversation.customerCompany} &bull; {conversation.customerEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Status toggle */}
          {conversation.status === "open" ? (
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                onUpdateStatus("closed");
                toast.success("Conversation marked as closed.");
              }}
              className="hidden sm:inline-flex gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Close
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                onUpdateStatus("open");
                toast.success("Conversation reopened.");
              }}
              className="hidden sm:inline-flex gap-1"
            >
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              Reopen
            </Button>
          )}

          {/* Toggle AI Assistant View */}
          <Button
            size="xs"
            variant={showAIAssistant ? "subtle" : "ghost"}
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="gap-1.5"
            title="Toggle AI Reply Assistant"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Button>

          {/* Customer Profile Sidebar Toggle */}
          <button
            onClick={onToggleProfileSidebar}
            className={`p-2 rounded-lg border transition-colors ${
              isProfileSidebarOpen
                ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-slate-200 dark:border-slate-700"
                : "text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Customer Profile Details"
            aria-label="Customer profile details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAgent = msg.senderType === "agent";
          const isCustomer = msg.senderType === "customer";
          const isAI = msg.senderType === "ai";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                isAgent ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <Avatar
                name={msg.senderName}
                src={msg.senderAvatar}
                size="sm"
                className="mt-1"
              />

              <div className={`space-y-1 ${isAgent ? "items-end text-right" : "items-start text-left"}`}>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTimeAgo(msg.timestamp)}
                  </span>
                  {isAgent && (
                    <span className="text-[10px] px-1 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                      Agent
                    </span>
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                    isAgent
                      ? "bg-indigo-600 text-white rounded-tr-xs"
                      : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs"
                  }`}
                >
                  {msg.content}

                  {/* Message Attachments if present */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/20 dark:border-slate-800 space-y-1.5">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                            isAgent
                              ? "bg-indigo-700/60 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <FileText className="h-4 w-4 opacity-75" />
                          <span className="truncate font-medium">{att.name}</span>
                          <span className="text-[10px] opacity-75 ml-auto">{att.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator if active */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-2">
            <div className="flex space-x-1">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>{conversation.customerName} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Embedded AI Reply Assistant Container */}
      {showAIAssistant && (
        <div className="px-4 sm:px-6 pb-2">
          <AIReplyAssistant
            conversation={conversation}
            messages={messages}
            onUseReply={handleUseReplyFromAI}
          />
        </div>
      )}

      {/* 4. Message Composer */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        {/* Attachment chips preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="font-medium truncate max-w-[150px]">{att.name}</span>
                <span className="text-[10px] text-indigo-400">({att.size})</span>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                  className="hover:text-rose-500 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-2">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-xs">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder={`Reply to ${conversation.customerName}... (Press Enter to send, Shift+Enter for newline)`}
              className="w-full resize-none bg-transparent p-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Composer Toolbar Footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 rounded-b-2xl">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Attach file or screenshot"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowAIAssistant(true)}
                  className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors text-xs font-medium flex items-center gap-1"
                  title="Open AI reply assistant"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim() && attachments.length === 0}
                  isLoading={isSending}
                  className="gap-1.5 shadow-sm"
                >
                  <span>Send</span>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
