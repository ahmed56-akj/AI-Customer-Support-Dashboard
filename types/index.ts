export type UserRole = "admin" | "agent" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  company: string;
}

export type CustomerStatus = "active" | "inactive" | "vip" | "lead";

export interface CustomerNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CustomerActivity {
  id: string;
  type: "ticket_created" | "ticket_resolved" | "conversation_started" | "note_added" | "login";
  description: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  ticketsCount: number;
  lastActivity: string;
  createdAt: string;
  avatar: string;
  phone?: string;
  location?: string;
  tags: string[];
  notes: CustomerNote[];
  activities: CustomerActivity[];
}

export type AgentStatus = "online" | "busy" | "offline";

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: AgentStatus;
  department: string;
  ticketsResolved: number;
  avgRating: number;
}

export type TicketStatus = "Open" | "Pending" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
export type TicketCategory = "Billing" | "Technical" | "Account" | "Feature Request" | "General";

export interface TicketNote {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string; // e.g. TCK-1042
  subject: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: TicketNote[];
}

export type ConversationStatus = "open" | "closed" | "snoozed";

export interface MessageAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: "customer" | "agent" | "ai" | "system";
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: MessageAttachment[];
  isInternal?: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  customerAvatar: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  status: ConversationStatus;
  priority: TicketPriority;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  channel: "email" | "chat" | "widget" | "api";
  tags: string[];
}

export interface DateFilterRange {
  label: "Today" | "Last 7 Days" | "Last 30 Days" | "Last 90 Days";
  value: "today" | "7d" | "30d" | "90d";
}

export interface AnalyticsData {
  totalCustomers: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTimeMinutes: number;
  csatScore: number;
  totalConversations: number;
  resolutionRatePercent: number;
  ticketsOverTime: { date: string; open: number; resolved: number }[];
  customerGrowth: { month: string; customers: number }[];
  ticketResolutionRate: { period: string; rate: number }[];
  agentPerformance: { name: string; resolved: number; satisfaction: number; avgTimeMin: number }[];
  ticketsByCategory: { category: string; count: number }[];
  ticketsByPriority: { priority: string; count: number }[];
  conversationsPerDay: { day: string; count: number }[];
}

export interface AISettings {
  enabled: boolean;
  replyTone: "Professional" | "Friendly" | "Concise";
  defaultLanguage: "English" | "Urdu" | "Spanish" | "French" | "German";
  autoSuggest: boolean;
}

export interface WorkspaceSettings {
  companyName: string;
  companyLogo: string;
  timezone: string;
  supportEmail: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newTicketNotifications: boolean;
  newMessageNotifications: boolean;
  agentAssignmentNotifications: boolean;
}

export interface ProfileSettings {
  name: string;
  email: string;
  avatar: string;
  title: string;
}

export interface AppSettings {
  profile: ProfileSettings;
  workspace: WorkspaceSettings;
  notifications: NotificationSettings;
  ai: AISettings;
}
