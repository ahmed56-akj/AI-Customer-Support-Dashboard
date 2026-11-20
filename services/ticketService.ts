import { Ticket, TicketNote, TicketStatus, TicketPriority, TicketCategory } from "@/types";
import { initialTickets } from "./mockData";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "supportai_tickets";

function getStoredTickets(): Ticket[] {
  if (typeof window === "undefined") return initialTickets;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTickets));
      return initialTickets;
    }
    return JSON.parse(data);
  } catch {
    return initialTickets;
  }
}

function saveTickets(tickets: Ticket[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error("Failed to save tickets to localStorage", err);
  }
}

export interface TicketFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  agentId?: string;
  sortBy?: "newest" | "oldest" | "priority";
}

export async function getTickets(filters?: TicketFilters): Promise<Ticket[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  let tickets = getStoredTickets();

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    tickets = tickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerCompany.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filters?.status && filters.status !== "all") {
    tickets = tickets.filter((t) => t.status.toLowerCase() === filters.status?.toLowerCase());
  }

  if (filters?.priority && filters.priority !== "all") {
    tickets = tickets.filter((t) => t.priority.toLowerCase() === filters.priority?.toLowerCase());
  }

  if (filters?.category && filters.category !== "all") {
    tickets = tickets.filter((t) => t.category.toLowerCase() === filters.category?.toLowerCase());
  }

  if (filters?.agentId && filters.agentId !== "all") {
    tickets = tickets.filter((t) => t.assignedAgentId === filters.agentId);
  }

  // Sort
  if (filters?.sortBy === "oldest") {
    tickets.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (filters?.sortBy === "priority") {
    const priorityWeight: Record<TicketPriority, number> = {
      Urgent: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };
    tickets.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  } else {
    // Default newest
    tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return tickets;
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const tickets = getStoredTickets();
  const ticket = tickets.find((t) => t.id.toLowerCase() === id.toLowerCase());
  return ticket || null;
}

export async function createTicket(data: {
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
  tags?: string[];
  initialNote?: string;
}): Promise<Ticket> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const tickets = getStoredTickets();
  const now = new Date().toISOString();

  const newTicket: Ticket = {
    id: generateId("TCK"),
    subject: data.subject,
    description: data.description,
    customerId: data.customerId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerCompany: data.customerCompany,
    assignedAgentId: data.assignedAgentId,
    assignedAgentName: data.assignedAgentName,
    priority: data.priority,
    status: data.status,
    category: data.category,
    createdAt: now,
    updatedAt: now,
    tags: data.tags || ["New"],
    notes: data.initialNote
      ? [
          {
            id: generateId("TN"),
            authorName: data.assignedAgentName || "System Agent",
            authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            content: data.initialNote,
            createdAt: now,
          },
        ]
      : [],
  };

  const updated = [newTicket, ...tickets];
  saveTickets(updated);
  return newTicket;
}

export async function updateTicket(id: string, patch: Partial<Ticket>): Promise<Ticket> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const tickets = getStoredTickets();
  const index = tickets.findIndex((t) => t.id.toLowerCase() === id.toLowerCase());
  if (index === -1) throw new Error("Ticket not found");

  const updated = {
    ...tickets[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  tickets[index] = updated;
  saveTickets(tickets);
  return updated;
}

export async function addTicketNote(
  ticketId: string,
  content: string,
  authorName: string,
  authorAvatar?: string
): Promise<TicketNote> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const tickets = getStoredTickets();
  const ticket = tickets.find((t) => t.id.toLowerCase() === ticketId.toLowerCase());
  if (!ticket) throw new Error("Ticket not found");

  const note: TicketNote = {
    id: generateId("TN"),
    authorName,
    authorAvatar:
      authorAvatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content,
    createdAt: new Date().toISOString(),
  };

  ticket.notes = [note, ...ticket.notes];
  ticket.updatedAt = new Date().toISOString();

  saveTickets(tickets);
  return note;
}
