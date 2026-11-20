# SupportAI — AI Customer Support Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat)](https://github.com/pmndrs/zustand)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-teal?style=flat)](https://recharts.org/)

**SupportAI** is a commercial-grade, multi-channel customer support management SaaS web platform designed for modern product and operations teams. It equips support agents and engineering managers with real-time analytics, unified omnichannel conversations, deep SLA ticketing, customer 360° intelligence, and a context-aware **AI Reply Assistant** (with Human-in-the-Loop review).

---

## 🌟 Key Features

### 1. Support Command Center (Dashboard)
- **Live Performance KPI Cards**: Total Customers, Open Tickets, Resolved Tickets, Average Response Time, and Customer Satisfaction (CSAT).
- **Interactive Visual Recharts**:
  - *Tickets Over Time*: Area chart displaying resolution volume vs open influx.
  - *Customer Growth*: Historical progression of active client seats.
  - *Ticket Resolution Rate*: SLA closure speed across tiers.
  - *Agent Performance Leaderboard*: Ranked resolved ticket throughput & CSAT scores.
- **Dynamic Time Filters**: Switch metrics on the fly between **Today**, **Last 7 Days**, **Last 30 Days**, and **Last 90 Days**.
- **Real-Time Activity Audit Feed**: Up-to-the-minute team actions, tickets created, and AI drafting events.

### 2. Omnichannel Support Inbox (3-Column Layout)
- **Column 1 — Conversation List**:
  - Live search across message contents, customer names, and emails.
  - Filter by priority (*Urgent*, *High*, *Medium*, *Low*), status (*Open*, *Closed*), or unread state.
  - Real-time unread badges, timestamp formatting, and agent assignments.
- **Column 2 — Live Conversation & Composer**:
  - Real-time message thread with timestamps, delivery status, and file attachments.
  - Interactive typing indicators.
  - Multi-line message composer supporting keyboard shortcuts (`Enter` to send, `Shift+Enter` for newline).
  - Simulated file attachment ingestion (diagnostic logs, bug screenshots, PDFs).
- **Column 3 — Customer 360° Profile**:
  - Detailed contact metadata, company, and VIP/Active/Lead status.
  - Historical tickets list submitted by the customer with direct links.
  - Chronological account activity stream.
  - Internal agent-only collaborative notes.

### 3. Contextual AI Reply Assistant (Human-in-the-Loop)
- **Zero-Risk Agent Review**: AI suggestions are drafted into an editable workspace and are **never** dispatched automatically without explicit agent confirmation.
- **Context Recognition**:
  - Automatically recognizes issues such as password resets (e.g. *"I forgot my password and cannot access my account"*), billing inquiries, API webhook errors, and SOC2 compliance requests.
- **Tone Adjusters**:
  - **Make Professional**: Polished, corporate, solution-oriented.
  - **Make Friendly**: Warm, empathetic, customer-centric.
  - **Make Shorter**: Concise, step-by-step summary.
- **Conversation Summarizer**: Generates instant sentiment analysis, bulleted key takeaways, and recommended next steps.
- **Multi-Language Translation**: Seamlessly translates or generates responses in **English**, **Urdu (اردو)**, **Spanish**, **French**, and **German**.
- **Modular AI Service**: Abstracted in `services/aiService.ts` for clean plug-and-play migration between Mock provider, Google Gemini API, OpenAI, or custom LLMs.

### 4. Advanced Ticket Management
- Complete ticket lifecycle: **Open**, **Pending**, **Resolved**, and **Closed**.
- Priority scoring: **Low**, **Medium**, **High**, and **Urgent**.
- Categories: **Technical**, **Billing**, **Account**, **Feature Request**, and **General**.
- Features:
  - Create ticket modal with auto-generated unique ID (`TCK-xxxx`).
  - Search tickets by subject, customer, tags, or description.
  - Sort by *Newest*, *Oldest*, and *Priority*.
  - Client-side pagination with custom page sizes.
  - Agent assignment dropdowns.
  - Collaborative internal notes thread with agent avatars and timestamps.
  - Tag management.

### 5. Customer Directory & 360° Detail View
- Searchable and filterable customer index with VIP tags, active ticket counts, and last activity time-ago.
- Customer detail page (`/customers/[id]`):
  - Profile and contact details.
  - Associated conversation threads with direct link to inbox.
  - Active and resolved ticket history.
  - Audit trail of account activity.
  - Edit customer profile modal.

### 6. Dedicated Analytics & SLA Intelligence
- Dedicated `/analytics` dashboard with 6 high-level KPI cards.
- Recharts visualizations: Inbound Conversations Per Day, Tickets by Category, Tickets by Priority, and SLA Resolution Rate.
- Support agent performance leaderboard with CSAT ratings and average handle times.

### 7. Settings & Governance
- **Profile**: Name, email, title, and profile picture avatar.
- **Workspace**: Company branding, support inbound address, and timezone configuration.
- **Notifications**: Email notifications, new ticket alerts, and message dispatch toggles.
- **AI Settings**: Enable/disable assistant, set default reply tone, and configure primary language.

### 8. Authentication & Security
- Complete `/login`, `/register`, and `/forgot-password` workflows.
- Form validation implemented using **React Hook Form** and **Zod** schema.
- Password match validation, email validation, loading states, error states, and remember-me persistence.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14 (App Router)** | Full-stack React framework with SSR and streaming |
| **React 18** | UI rendering & component model |
| **TypeScript** | Strict end-to-end type safety |
| **Tailwind CSS** | Modern responsive design system with dark/light mode |
| **Zustand** | Predictable reactive client state and settings storage |
| **Recharts** | Declarative charting library for SLA, tickets, and growth |
| **React Hook Form + Zod** | Form management and schema validation |
| **Lucide React** | Cohesive SaaS icon suite |
| **Sonner** | Modern toast notifications |

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css              # Global Tailwind base & CSS theme variables
│   ├── layout.tsx               # Root layout, theme script & Toaster
│   ├── page.tsx                 # Dashboard (/ command center)
│   ├── inbox/                   # Omnichannel Support Inbox (/inbox)
│   ├── tickets/                 # Ticket list & detail (/tickets, /tickets/[id])
│   ├── customers/               # Customer index & 360° (/customers, /customers/[id])
│   ├── analytics/               # Analytics page (/analytics)
│   ├── settings/                # Settings page (/settings)
│   ├── login/                   # Login page (/login)
│   ├── register/                # Register page (/register)
│   └── forgot-password/         # Forgot password page (/forgot-password)
├── components/
│   ├── layout/                  # Sidebar, Header, AppLayout, ThemeToggle
│   └── ui/                      # Button, Input, Select, Badge, Card, Modal, Drawer, Skeleton, EmptyState, ErrorState, SearchInput
├── features/
│   ├── auth/                    # LoginForm, RegisterForm, ForgotPasswordForm
│   ├── dashboard/               # DashboardMetrics, DashboardCharts, RecentActivity
│   ├── inbox/                   # InboxView, ConversationList, ConversationChat, CustomerProfileSidebar, AIReplyAssistant
│   ├── tickets/                 # TicketListTable, TicketDetailsView
│   ├── customers/               # CustomerListTable, CustomerDetailsView
│   ├── analytics/               # AnalyticsView
│   └── settings/                # SettingsView
├── lib/
│   └── utils.ts                 # Class merging (cn), formatters, ID generators
├── services/
│   ├── mockData.ts              # High-fidelity realistic customer support datasets
│   ├── customerService.ts       # Customer CRUD and persistence
│   ├── ticketService.ts         # Ticket CRUD, notes, agent assignments
│   ├── conversationService.ts   # Chat messages, read receipts, channels
│   ├── analyticsService.ts      # Aggregated metrics for 1d, 7d, 30d, 90d
│   └── aiService.ts             # Modular AI reply engine, tones, translation, summarizer
├── store/
│   ├── useAuthStore.ts          # Authenticated user session
│   └── useSettingsStore.ts      # Dark/light theme, workspace & AI configuration
└── types/
    └── index.ts                 # TypeScript interfaces for all domain entities
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.17.0 (Node.js 20 or 24 recommended)
- npm >= 9.0.0

### Installation

1. **Clone or navigate to the repository directory**:
   ```bash
   cd "C:\Users\Ahmad\OneDrive\Desktop\AI Customer Support Dashboard"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional):
   ```bash
   cp .env.example .env.local
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔑 Demo Agent Credentials

You can test authentication or sign in immediately with pre-configured demo credentials:

- **Email**: `alex.vance@supportai.io`
- **Password**: `password123`
- *(Or register any new account on `/register` to create a dedicated profile!)*

---

## 🌐 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Display name of the application | `SupportAI` |
| `NEXT_PUBLIC_APP_URL` | Base canonical application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_AI_PROVIDER` | AI backend engine (`mock`, `gemini`, `openai`) | `mock` |
| `NEXT_PUBLIC_AI_API_KEY` | Optional API key when connecting live LLM provider | `""` |

---

## 💻 Available Commands

- `npm run dev`: Starts the Next.js development server with hot reloading.
- `npm run build`: Compiles production build and performs strict TypeScript validation.
- `npm run start`: Starts the optimized production server.
- `npm run lint`: Runs ESLint analysis across the codebase.

---

## 🚢 Deployment to Vercel

The application is pre-configured for zero-configuration deployment to [Vercel](https://vercel.com/):

1. Push your repository to GitHub or GitLab.
2. Import the project into your Vercel Dashboard.
3. Keep default settings (`Framework: Next.js`, `Root Directory: ./`).
4. Click **Deploy**. Vercel will automatically build the static and SSR bundles.

---

## 🔮 Future Enhancements
- WebRTC voice and screen-share integration for live troubleshooting.
- Real-time WebSocket synchronization across multiple concurrent agent seats.
- Native mobile client using React Native / Expo sharing the same `services/` layer.
- Direct OAuth 2.0 integrations with Jira, GitHub Issues, and Slack.

---

## 📄 License
MIT License. Built with precision for production customer support teams.
