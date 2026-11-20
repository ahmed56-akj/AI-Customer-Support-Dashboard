import { Customer, CustomerNote } from "@/types";
import { initialCustomers } from "./mockData";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "supportai_customers";

function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") return initialCustomers;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCustomers));
      return initialCustomers;
    }
    return JSON.parse(data);
  } catch {
    return initialCustomers;
  }
}

function saveCustomers(customers: Customer[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error("Failed to save customers to localStorage", err);
  }
}

export async function getCustomers(search?: string, status?: string): Promise<Customer[]> {
  // Simulate network delay for realistic SaaS feel
  await new Promise((resolve) => setTimeout(resolve, 200));
  let customers = getStoredCustomers();

  if (search) {
    const q = search.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (status && status !== "all") {
    customers = customers.filter((c) => c.status.toLowerCase() === status.toLowerCase());
  }

  return customers;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const customers = getStoredCustomers();
  const found = customers.find((c) => c.id === id);
  return found || null;
}

export async function createCustomer(data: Omit<Customer, "id" | "createdAt" | "lastActivity" | "notes" | "activities" | "ticketsCount">): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const customers = getStoredCustomers();
  const newCustomer: Customer = {
    ...data,
    id: generateId("CUST"),
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    ticketsCount: 0,
    notes: [],
    activities: [
      {
        id: generateId("ACT"),
        type: "login",
        description: "Customer account created.",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const updated = [newCustomer, ...customers];
  saveCustomers(updated);
  return newCustomer;
}

export async function updateCustomer(id: string, patch: Partial<Customer>): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Customer not found");

  const updatedCustomer = {
    ...customers[index],
    ...patch,
    lastActivity: new Date().toISOString(),
  };

  customers[index] = updatedCustomer;
  saveCustomers(customers);
  return updatedCustomer;
}

export async function addCustomerNote(customerId: string, content: string, authorName: string): Promise<CustomerNote> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const customers = getStoredCustomers();
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) throw new Error("Customer not found");

  const note: CustomerNote = {
    id: generateId("NOTE"),
    authorName,
    content,
    createdAt: new Date().toISOString(),
  };

  customer.notes = [note, ...customer.notes];
  customer.activities = [
    {
      id: generateId("ACT"),
      type: "note_added",
      description: `${authorName} added an internal note: "${content.substring(0, 40)}..."`,
      timestamp: new Date().toISOString(),
    },
    ...customer.activities,
  ];
  customer.lastActivity = new Date().toISOString();

  saveCustomers(customers);
  return note;
}
