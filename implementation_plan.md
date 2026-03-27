# Project Implementation Plan: fully Functioning Dashboard

This plan outlines how we will transition "The Dashboard" from its current UI-only, mock-data state into a fully functional, production-ready application.

## 1. Goal Description
The objective is to connect the existing Vite/React frontend to a robust backend, implement real user authentication, persist data to a database, integrate third-party services (Google Calendar, Airtable), and activate AI-driven features using `@google/genai`.

## 2. User Review Required (Important Decisions)
> [!IMPORTANT]
> **Database & Backend Stack Choice: Option A (Supabase)** has been confirmed by the user.
> - We will use **Supabase** for Authentication, PostgreSQL Database, and Cloud Storage.
> - We will use the existing `express` server strictly as a secure middle-layer to call `@google/genai` (so your AI keys don't leak on the frontend).

## 3. Proposed Changes

### Foundation & Backend
- Set up the chosen backend (Supabase/Firebase or Custom Express).
- Move `@google/genai` logic into a secure backend route.
- Configure `.env` variables for the frontend to communicate with the backend.

### Authentication Layer
#### [MODIFY] `src/App.tsx`
- Remove the `localStorage` mock auth.
- Integrate the real authentication provider provider wrapper (e.g., Supabase Auth Provider).

#### [MODIFY] `src/screens/Login.tsx`
- Connect email/password or OAuth login forms to the real backend.

### Data Fetching & State
#### [MODIFY] `package.json`
- Add `@tanstack/react-query` or similar for robust data fetching and caching.

#### [MODIFY] All Screen Components (`src/screens/*` & `src/components/*`)
- Replace hardcoded static arrays with API hooks (e.g., `useQuery`, `useMutation`).
- Ensure optimistic UI updates so the app remains feeling instantaneous like a local app.

### AI & Integrations
#### [NEW] `server/` (or Supabase Edge Functions)
- Create secure endpoints for:
  - Idea Generation (`/api/ai/generate-ideas`)
  - Post Drafting (`/api/ai/draft-post`)
  - Knowledge Chat (`/api/ai/chat`)
  - Receipt Parsing (`/api/ai/parse-receipt`)

#### [MODIFY] `src/screens/Settings.tsx`
- Build UI flows to authorize Google Calendar and Airtable.
- Securely store these third-party integration tokens in the database, encrypted.

## 4. Verification Plan

### Automated Tests
Currently, the repo focuses on UI and has no testing framework installed.
- We will install `vitest` and `@testing-library/react` to write unit tests for critical components.
- We will write integration tests for the new API endpoints using `supertest`.

### Manual Verification
- **Auth Flow**: The user can register a new account, log in, log out, and persist sessions across page reloads.
- **Data Persistence**: Creating a new task in the Command Centre and refreshing the page correctly reloads the task from the database.
- **AI Features**: Running the "Content Studio" generator yields variable, context-aware responses from Google Gemini.
- **File Upload**: Uploading a dummy receipt displays the file in the UI and pushes the file byte stream to the cloud bucket successfully.
