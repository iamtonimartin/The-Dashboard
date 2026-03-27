# Task List to Turn The Dashboard into a Fully Functioning App

This task breakdown addresses the transition from a UI shell (with mock data) to a production-ready Web Application. It integrates authentication, persistent data, artificial intelligence, and third-party APIs.

## 1. Architecture & Foundation
- [x] Initialize Supabase project and install `@supabase/supabase-js`.
- [x] Set up Express server (`server/index.ts`) as a secure proxy for the OpenAI API.
- [x] Configure environment variables (`.env`) for frontend and backend API endpoints.
- [x] Add `src/vite-env.d.ts` so `import.meta.env` is properly typed.
- [x] Add `/api` proxy in `vite.config.ts` for local development.

## 2. Authentication
- [x] Implement Supabase Auth (email + password).
- [x] Wire up the existing `Login` screen to Supabase (`signInWithPassword` with real error messages).
- [x] Replace `localStorage` mock with Supabase session listener (`onAuthStateChange`).

## 3. Database Schema & API Setup
- [x] Design and create database tables (`projects`, `tasks`, `habits`, `habit_completions`, `transactions`, `documents`) with Row Level Security.
- [x] Create OpenAI API routes on Express: `/api/ai/draft-post`, `/api/ai/generate-ideas`, `/api/ai/chat`, `/api/ai/parse-receipt`.

## 4. State Management & Data Fetching
- [x] Refactor `CommandCentre` — Projects (Pulse tab) and Tasks (Kanban + Ops backlog) wired to live Supabase data.
- [x] Refactor `Personal` screen — Habits wired to Supabase (fetch, toggle completion, add, delete).
- [x] Refactor `Finance` screen — Transactions wired to Supabase (fetch, add). Stats computed from live data.
- [ ] Refactor `Home` widgets (Daily Briefing, Pomodoro, Project Pulse, Cash Flow) to use live data.

## 5. File Uploads & Storage
- [ ] Set up Supabase Storage bucket.
- [ ] Implement secure file uploading in the `KnowledgeBase` Document Manager.
- [ ] Implement image uploading in the `Finance` Receipt Scanner (currently uses local FileReader → base64).

## 6. AI & GenAI Integration
- [x] Swap `@google/genai` for `openai` SDK.
- [x] Configure OpenAI securely on the Express backend (GPT-4o for all features).
- [x] **Content Studio**: "Refine with AI" and "Fresh Ideas" wired to real OpenAI API.
- [x] **Knowledge Base**: HQ Co-Pilot chat wired to real OpenAI API (GPT-4o).
- [x] **Finance**: AI receipt scanning wired to GPT-4o vision — extracts and pre-fills the add-transaction form.

## 7. Third-Party Integrations
- [ ] **Google Calendar**: Implement OAuth flow in `Settings` and fetch today's events for the `Home` Daily Briefing.
- [ ] **Airtable**: Store Airtable API keys securely and create integration to sync specific data.

## 8. Polish & Deployment
- [x] `package.json` — `start` script (`tsx server/index.ts`) and `dev:server` script for local backend.
- [ ] Push repo to GitHub.
- [ ] Deploy to Railway (set all env vars, connect GitHub repo, auto-deploy on push).
- [ ] Update Supabase Auth redirect URLs to production domain.
- [ ] Set up custom domain and SSL (handled by Railway).
