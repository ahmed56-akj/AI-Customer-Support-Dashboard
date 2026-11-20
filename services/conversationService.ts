import { Conversation, Message, TicketPriority } from "@/types";
import { initialConversations, initialMessages } from "./mockData";
import { generateId } from "@/lib/utils";

const CONV_STORAGE_KEY = "supportai_conversations";
const MSG_STORAGE_KEY = "supportai_messages";

function getStoredConversations(): Conversation[] {
  if (typeof window === "undefined") return initialConversations;
  try {
    const data = localStorage.getItem(CONV_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(initialConversations));
      return initialConversations;
    }
    return JSON.parse(data);
  } catch {
    return initialConversations;
  }
}

function saveConversations(convs: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(convs));
  } catch (err) {
    console.error("Failed to save conversations", err);
  }
}

function getStoredMessages(): Record<string, Message[]> {
  if (typeof window === "undefined") return initialMessages;
  try {
    const data = localStorage.getItem(MSG_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(initialMessages));
      return initialMessages;
    }
    return JSON.parse(data);
  } catch {
    return initialMessages;
  }
}

function saveMessages(messages: Record<string, Message[]>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MSG_STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error("Failed to save messages", err);
  }
}

export interface ConversationFilters {
  search?: string;
  status?: string;
  priority?: string;
  unreadOnly?: boolean;
  assignedAgentId?: string;
}

export async function getConversations(filters?: ConversationFilters): Promise<Conversation[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  let convs = getStoredConversations();

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    convs = convs.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.customerEmail.toLowerCase().includes(q) ||
        c.customerCompany.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters?.status && filters.status !== "all") {
    convs = convs.filter((c) => c.status.toLowerCase() === filters.status?.toLowerCase());
  }

  if (filters?.priority && filters.priority !== "all") {
    convs = convs.filter((c) => c.priority.toLowerCase() === filters.priority?.toLowerCase());
  }

  if (filters?.unreadOnly) {
    convs = convs.filter((c) => c.unreadCount > 0);
  }

  if (filters?.assignedAgentId && filters.assignedAgentId !== "all") {
    convs = convs.filter((c) => c.assignedAgentId === filters.assignedAgentId);
  }

  // Sort by most recent message
  convs.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return convs;
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const convs = getStoredConversations();
  return convs.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null;
}

export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const allMessages = getStoredMessages();
  return allMessages[conversationId] || [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  senderType: "agent" | "customer" | "ai" = "agent",
  senderName: string = "Alex Vance",
  senderAvatar?: string,
  attachments?: { name: string; size: string; type: string }[]
): Promise<Message> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const allMessages = getStoredMessages();
  const currentMessages = allMessages[conversationId] || [];
  const now = new Date().toISOString();

  const newMessage: Message = {
    id: generateId("MSG"),
    conversationId,
    senderType,
    senderName,
    senderAvatar:
      senderAvatar ||
      (senderType === "agent"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        : undefined),
    content,
    timestamp: now,
    attachments: attachments?.map((att) => ({ ...att, id: generateId("ATT") })),
  };

  allMessages[conversationId] = [...currentMessages, newMessage];
  saveMessages(allMessages);

  // Update conversation last message
  const convs = getStoredConversations();
  const convIndex = convs.findIndex((c) => c.id.toLowerCase() === conversationId.toLowerCase());
  if (convIndex !== -1) {
    convs[convIndex].lastMessage = content;
    convs[convIndex].lastMessageAt = now;
    if (senderType === "agent") {
      convs[convIndex].unreadCount = 0;
    }
    saveConversations(convs);
  }

  return newMessage;
}

export async function updateConversationStatus(
  id: string,
  status: Conversation["status"]
): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const convs = getStoredConversations();
  const conv = convs.find((c) => c.id.toLowerCase() === id.toLowerCase());
  if (!conv) throw new Error("Conversation not found");

  conv.status = status;
  saveConversations(convs);
  return conv;
}

export async function updateConversationPriority(
  id: string,
  priority: TicketPriority
): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const convs = getStoredConversations();
  const conv = convs.find((c) => c.id.toLowerCase() === id.toLowerCase());
  if (!conv) throw new Error("Conversation not found");

  conv.priority = priority;
  saveConversations(convs);
  return conv;
}

export async function assignConversationAgent(
  id: string,
  agentId: string,
  agentName: string
): Promise<Conversation> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const convs = getStoredConversations();
  const conv = convs.find((c) => c.id.toLowerCase() === id.toLowerCase());
  if (!conv) throw new Error("Conversation not found");

  conv.assignedAgentId = agentId;
  conv.assignedAgentName = agentName;
  saveConversations(convs);
  return conv;
}

export async function markConversationAsRead(id: string): Promise<void> {
  const convs = getStoredConversations();
  const conv = convs.find((c) => c.id.toLowerCase() === id.toLowerCase());
  if (conv && conv.unreadCount > 0) {
    conv.unreadCount = 0;
    saveConversations(convs);
  }
}
