# Build Instructions: The Dashboard (Founder Co-Pilot)

This document provides all the necessary context, design standards, and technical specifications to recreate or extend "The Dashboard" (formerly Toni's HQ).

## 1. Project Overview
**The Dashboard** is a premium, AI-powered personal command centre designed for founders. It acts as a "Founder Co-Pilot," integrating project tracking, content creation, finance management, personal wellness, and a knowledge base into a single, high-end interface.

## 2. Visual Identity & Design Standards
Consistency is key to the "premium" feel of this application.

### Color Palette
- **Forest**: `#1A3A2A` (Primary background, text, and dark accents)
- **Terracotta**: `#C0583A` (Primary action color, highlights, and progress)
- **Cream**: `#F5F0E8` (App background and soft surfaces)
- **White**: `#FFFFFF` (Card backgrounds)

### Typography
- **Sans-serif (UI)**: `Inter` (Clean, modern, highly legible)
- **Monospace (Data/Time)**: `JetBrains Mono` (Used for clocks, stats, and technical labels)

### Component Standards
- **Cards**: Use the `.card` class: `bg-white`, `rounded-3xl` (1.5rem), `p-6` to `p-8`, `border border-forest/5`, `shadow-sm`.
- **Buttons**:
  - `.btn-primary`: Terracotta background, white text, `rounded-2xl`.
  - `.btn-secondary`: Forest background, white text, `rounded-2xl`.
- **Inputs**: `.input-field`: Cream background, subtle forest border, `rounded-2xl`.

## 3. Technical Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4.0
- **Animations**: `framer-motion` (for screen transitions and interactive states)
- **Icons**: `lucide-react`
- **Charts**: `recharts`
- **Drag & Drop**: `@dnd-kit`
- **Date Handling**: `date-fns`
- **Utilities**: `clsx`, `tailwind-merge`

## 4. Core Architecture
### Authentication
- A full-screen login component with "VIBECODING LAB" branding.
- Mock authentication that persists state in `localStorage` under the key `toni_hq_auth`.

### Layout
- **Persistent Sidebar**: Left-hand navigation rail with active states highlighted by a Terracotta left border and Cream background.
- **Header**: Displays user profile and a real-time clock (JetBrains Mono).
- **Main Content Area**: Uses `AnimatePresence` for smooth fade/slide transitions between screens.

## 5. Screen Specifications
### 1. Home (Dashboard)
- **Focus Mode**: A toggle that filters the dashboard to show only high-priority widgets (Briefing, Pomodoro, Next Up, Daily Path).
- **Widgets**:
  - **Daily Briefing**: Date and top 3 priorities.
  - **Pomodoro**: Circular SVG progress timer with work/break modes.
  - **Project Pulse**: List of active projects with status badges.
  - **Cash Flow**: Progress bars for monthly burn and runway.

### 2. Command Centre
- **Pulse Tab**: Executive summary with stat cards and a detailed project health table.
- **Tasks Tab**: Kanban-style board (To Do, In Progress, Done).
- **Home Ops Tab**: Personal backlog manager with task input.

### 3. Content Studio
- **Post Drafter**: Split-screen layout. Left: Textarea for rough ideas. Right: "Drafted Output" preview card in Forest green.
- **Idea Generator**: Grid of content idea cards with "Draft" buttons.

### 4. Personal (Life OS)
- **Wellness**: 4 grid cards (Sleep, Steps, Deep Work, Heart Rate).
- **Habit Tracker**: "Daily Non-Negotiables" with custom checkbox styling.
- **Daily Reflection**: Journaling area with a "View History" toggle.
- **Learning**: Reading list manager with status toggles.

### 5. Knowledge Base
- **Document Manager**: Upload zone and list of recent uploads with file-type icons.
- **Knowledge Chat**: AI co-pilot chat interface referencing "uploaded" documents.

### 6. Finance (The Vault)
- **Cash Flow**: Large cards for Net Cash Flow, Revenue, and Expenses.
- **Receipt Scanner**: AI-powered upload zone with a scanning animation (simulated).
- **Ledger**: Detailed, filterable list of transactions with category icons.

### 7. Settings
- Tabbed interface for Integrations (Airtable, Google Calendar), System Preferences (Timezone, AI Tone), and Account Management.

## 6. Implementation Notes
- **Mock Data**: The application uses robust mock data to ensure every screen is fully populated and interactive.
- **State Management**: React `useState` and `useEffect` are used for all local interactions.
- **Responsiveness**: Mobile-first approach using Tailwind's responsive prefixes (`md:`, `lg:`).
- **No Placeholders**: All buttons, toggles, and inputs are wired to local state or console logs to simulate a production environment.
