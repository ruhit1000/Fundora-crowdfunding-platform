# Crowdfunding Platform Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a decoupled crowdfunding platform with a Next.js frontend (client) and an Express.js backend (server), using BetterAuth for session management.

**Architecture:** 
- `client/`: Next.js App Router, Tailwind CSS, Shadcn UI, BetterAuth. Uses a `lib/core` folder with `server.ts` for fetch wrappers passing `Authorization` headers, and `session.ts` for frontend route protection (no middleware folder).
- `server/`: Express.js, MongoDB Native/Mongoose. Exposes REST API and secures endpoints using a `verifyToken` middleware that validates the BetterAuth token against the DB.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `client/package.json`
- Create: `server/package.json`

**Step 1: Scaffold Next.js Client**
Run: `npx create-next-app@latest client --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
Expected: Next.js project created in `client/`.

**Step 2: Scaffold Express Server**
Run: `mkdir server && cd server && npm init -y && npm install express mongoose cors dotenv && npm install -D typescript @types/express @types/node ts-node`
Run: `npx tsc --init` inside `server/`.
Expected: Express project setup in `server/`.

**Step 3: Commit**
```bash
git add .
git commit -m "chore: scaffold separate client and server projects"
```

### Task 2: Server Database & Authentication Middleware

**Files:**
- Create: `server/src/index.ts`
- Create: `server/src/models/...` (User, Campaign, etc.)

**Step 1: Setup Express and MongoDB Connection**
Create `server/src/index.ts` with basic Express setup, CORS, and mongoose/MongoDB connection.

**Step 2: Implement `verifyToken` Middleware**
Inside `server/src/index.ts` (or a middleware file), write the `verifyToken` function that extracts `Authorization: Bearer <token>`, queries the `session` collection, finds the user, and attaches it to `req.user`.

**Step 3: Setup Models**
Create basic Mongoose schemas for Campaign, Contribution, Withdrawal, and Notification.

**Step 4: Commit**
```bash
git add server/
git commit -m "feat: server db connection and verifyToken middleware"
```

### Task 3: Client Authentication & Core Lib

**Files:**
- Create: `client/src/lib/auth.ts`
- Create: `client/src/lib/core/server.ts`
- Create: `client/src/lib/core/session.ts`

**Step 1: Install & Configure BetterAuth**
Install better-auth in `client/`. Setup `client/src/lib/auth.ts` connected to the shared MongoDB URI. Setup the `client/src/app/api/auth/[...all]/route.ts`.

**Step 2: Implement `session.ts`**
Create `client/src/lib/core/session.ts` with `getUserSession`, `getUserToken`, and `requireRole` functions (using Next.js `redirect`).

**Step 3: Implement `server.ts`**
Create `client/src/lib/core/server.ts` with `authHeader`, `serverMutation`, `serverFetch`, and `protectedFetch` functions to attach the Bearer token to Express backend requests.

**Step 4: Commit**
```bash
git add client/src/lib/
git commit -m "feat: client auth config and core fetch wrappers"
```

### Task 4: Client Layouts & UI Components

**Files:**
- Modify: `client/src/app/layout.tsx`
- Create: `client/src/components/...` (Navbar, Footer, Sidebar)

**Step 1: Setup Shadcn UI**
Initialize shadcn in `client/`.

**Step 2: Build Layouts**
Create a Base Layout (Navbar/Footer) and a Dashboard Layout (Sidebar dependent on `requireRole` logic).

**Step 3: Build Auth Pages**
Implement `/login` and `/register` in Next.js using BetterAuth client APIs.

**Step 4: Commit**
```bash
git add client/
git commit -m "feat: client layouts, shadcn UI, and auth pages"
```

### Task 5: Server API Routes

**Files:**
- Create: `server/src/routes/...` (campaigns.ts, contributions.ts, etc.)

**Step 1: Implement Campaign Routes**
Write GET/POST routes for campaigns in Express, protected by `verifyToken` where necessary.

**Step 2: Implement Dashboards Logic**
Write endpoints for contributions, approvals, and withdrawals.

**Step 3: Commit**
```bash
git add server/src/routes/
git commit -m "feat: implement express api routes"
```

### Task 6: Client Dashboards Integration

**Files:**
- Create: `client/src/app/dashboard/...`

**Step 1: Creator Dashboard**
Build pages using `serverMutation` and `serverFetch` to interact with the Express API for managing campaigns and withdrawals. Use `requireRole("creator")`.

**Step 2: Supporter & Admin Dashboards**
Build pages for tracking contributions and admin approvals, protected by `requireRole`.

**Step 3: Commit**
```bash
git add client/src/app/dashboard/
git commit -m "feat: implement client dashboard pages"
```
