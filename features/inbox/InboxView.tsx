"use client";

import React, { useState, useEffect } from "react";
import { Conversation, Message } from "@/types";
import {
  getConversations,
  getConversationById,
  getMessagesByConversationId,
  sendMessage,
  updateConversationStatus,
  markConversationAsRead,
} from "@/services/conversationService";
import { ConversationList } from "./ConversationList";
import { ConversationChat } from "./ConversationChat";
import { CustomerProfileSidebar } from "./CustomerProfileSidebar";
import { Drawer } from "@/components/ui/Drawer";
import { ArrowLeft, Inbox as InboxIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function InboxView() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>("CONV-501");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Profile sidebar toggle state
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(true);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const loadConversations = async () => {
    try {
      const data = await getConversations({
        search: searchQuery,
        status: filterStatus,
        priority: filterPriority,
        unreadOnly,
      });
      setConversations(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [searchQuery, filterStatus, filterPriority, unreadOnly]);

  // Load active conversation & messages
  useEffect(() => {
    if (!selectedId) {
      setSelectedConversation(null);
      setMessages([]);
      return;
    }

    async function loadActive() {
      const conv = await getConversationById(selectedId!);
      if (conv) {
        setSelectedConversation(conv);
        const msgs = await getMessagesByConversationId(selectedId!);
        setMessages(msgs);
        if (conv.unreadCount > 0) {
          await markConversationAsRead(conv.id);
        }
      }
    }
    loadActive();
  }, [selectedId]);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setIsMobileChatOpen(true);
  };

  const handleSendMessage = async (
    content: string,
    attachments?: { name: string; size: string; type: string }[]
  ) => {
    if (!selectedId) return;
    const newMsg = await sendMessage(
      selectedId,
      content,
      "agent",
      user?.name || "Alex Vance",
      user?.avatar,
      attachments
    );
    setMessages((prev) => [...prev, newMsg]);
    loadConversations();
  };

  const handleUpdateStatus = async (status: Conversation["status"]) => {
    if (!selectedId) return;
    const updated = await updateConversationStatus(selectedId, status);
    setSelectedConversation(updated);
    loadConversations();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-white dark:bg-slate-900">
      {/* COLUMN 1: Conversation List */}
      <div
        className={`w-full md:w-80 lg:w-96 flex-shrink-0 h-full ${
          isMobileChatOpen ? "hidden md:flex flex-col" : "flex flex-col"
        }`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPriority={filterPriority}
          onFilterPriorityChange={setFilterPriority}
          unreadOnly={unreadOnly}
          onToggleUnreadOnly={() => setUnreadOnly(!unreadOnly)}
        />
      </div>

      {/* COLUMN 2 & 3: Chat + Profile (Responsive) */}
      <div
        className={`flex-1 flex h-full min-w-0 ${
          isMobileChatOpen ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Middle: Chat */}
            <div className="flex-1 flex flex-col h-full min-w-0 relative">
              {/* Mobile Back Button */}
              <div className="md:hidden flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to conversations
                </button>
              </div>

              <ConversationChat
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onToggleProfileSidebar={() => setIsProfileSidebarOpen(!isProfileSidebarOpen)}
                onUpdateStatus={handleUpdateStatus}
                isProfileSidebarOpen={isProfileSidebarOpen}
              />
            </div>

            {/* Desktop Right Column: Customer Profile */}
            {isProfileSidebarOpen && (
              <div className="hidden xl:flex h-full flex-shrink-0">
                <CustomerProfileSidebar
                  customerId={selectedConversation.customerId}
                  onClose={() => setIsProfileSidebarOpen(false)}
                />
              </div>
            )}

            {/* Tablet/Mobile Drawer for Customer Profile */}
            <Drawer
              isOpen={isProfileSidebarOpen}
              onClose={() => setIsProfileSidebarOpen(false)}
              position="right"
              width="w-80"
              className="p-0 overflow-hidden xl:hidden"
            >
              <CustomerProfileSidebar
                customerId={selectedConversation.customerId}
                onClose={() => setIsProfileSidebarOpen(false)}
              />
            </Drawer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={InboxIcon}
              title="No Conversation Selected"
              description="Choose a customer message from the left to read messages and start composing AI-assisted replies."
            />
          </div>
        )}
      </div>
    </div>
  );
}
