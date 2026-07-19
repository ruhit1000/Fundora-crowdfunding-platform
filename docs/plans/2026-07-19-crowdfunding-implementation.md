# Crowdfunding Platform Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a full-stack Next.js crowdfunding platform with role-based dashboards, BetterAuth, and Stripe integrations.

**Architecture:** Next.js App Router for both frontend and backend API. MongoDB/Mongoose for data storage. Next.js Middleware with BetterAuth for secure, Edge-based RBAC. Zustand for global client state.

**Tech Stack:** Next.js, React, Tailwind CSS, Shadcn UI, BetterAuth, Mongoose, Zustand, Stripe SDK, Framer Motion.

---

### Task 1: Project Setup and Dependencies

**Files:**
- Create: `package.json`
- Create: `.env.local`

**Step 1: Scaffold Next.js App**
Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
Expected: Next.js project files created successfully.

**Step 2: Install core dependencies**
Run: `npm install mongoose better-auth zustand stripe lucide-react framer-motion swiper`
Expected: Packages installed in `package.json`.

**Step 3: Commit**
```bash
git add .
git commit -m "chore: initial next.js project setup and core dependencies"
```

### Task 2: Database Connection & Mongoose Models

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/models/User.ts`
- Create: `src/models/Campaign.ts`
- Create: `src/models/Contribution.ts`
- Create: `src/models/Withdrawal.ts`
- Create: `src/models/Notification.ts`

**Step 1: Write DB connection utility**
Implement `src/lib/db.ts` with mongoose connection caching to prevent multiple connections in dev mode.

**Step 2: Implement User & Campaign Models**
Write Mongoose schemas in `src/models/` for User and Campaign matching the design document. 

**Step 3: Implement Remaining Models**
Write Mongoose schemas for Contribution, Withdrawal, and Notification.

**Step 4: Commit**
```bash
git add src/lib/ src/models/
git commit -m "feat: database connection and mongoose schemas"
```

### Task 3: BetterAuth & Middleware Security Proxy

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...all]/route.ts`
- Create: `src/middleware.ts`

**Step 1: Configure BetterAuth**
Implement `src/lib/auth.ts` setting up Email/Password and Google OAuth plugins, connecting to MongoDB or using adapter if needed, and exporting `auth`.

**Step 2: Create Auth API Route**
Implement `src/app/api/auth/[...all]/route.ts` exporting GET and POST handlers from `auth.handler`.

**Step 3: Implement Middleware Security Proxy**
Write `src/middleware.ts` to intercept requests. Verify BetterAuth session. Add RBAC logic:
- `/dashboard/admin/*` requires Admin role.
- `/dashboard/creator/*` requires Creator role.
- `/dashboard/supporter/*` requires Supporter role.
Redirect unauthorized to `/login`.

**Step 4: Commit**
```bash
git add src/lib/auth.ts src/app/api/auth/ src/middleware.ts
git commit -m "feat: implement BetterAuth and role-based middleware"
```

### Task 4: Base Layouts & Shadcn UI Setup

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`
- Create: `components.json`

**Step 1: Initialize Shadcn UI**
Run: `npx shadcn@latest init -d`
Expected: `components.json` and base styling created.

**Step 2: Create Navbar and Footer**
Implement responsive `Navbar` (with generic links) and `Footer` (with social links).

**Step 3: Update Root Layout**
Update `src/app/layout.tsx` to include the Navbar and Footer, and set up metadata.

**Step 4: Commit**
```bash
git add .
git commit -m "feat: base layout and shadcn setup"
```

### Task 5: User Authentication Pages

**Files:**
- Create: `src/app/register/page.tsx`
- Create: `src/app/login/page.tsx`
- Create: `src/components/AuthForm.tsx`

**Step 1: Create reusable Auth Form**
Build `AuthForm` using Shadcn form components, supporting email/password and a "Sign in with Google" button.

**Step 2: Implement Registration Page**
Build `/register` page. On submit, call BetterAuth sign-up API. Add initial credit logic (Supporter gets 50, Creator gets 20).

**Step 3: Implement Login Page**
Build `/login` page. On submit, call BetterAuth sign-in API. Redirect to `/dashboard`.

**Step 4: Commit**
```bash
git add src/app/register src/app/login src/components/AuthForm.tsx
git commit -m "feat: login and registration pages"
```

### Task 6: Dashboards Layout

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Create: `src/components/Sidebar.tsx`

**Step 1: Create Sidebar Component**
Build a `Sidebar` that reads user role from global state/session and displays appropriate navigation links.

**Step 2: Implement Dashboard Layout**
Build `src/app/dashboard/layout.tsx` incorporating the `Sidebar` and main content area.

**Step 3: Commit**
```bash
git add src/app/dashboard/layout.tsx src/components/Sidebar.tsx
git commit -m "feat: dashboard layout and sidebar"
```

### Task 7: Admin Dashboard Features

**Files:**
- Create: `src/app/dashboard/admin/page.tsx` (Admin Home)
- Create: `src/app/api/campaigns/pending/route.ts`
- Create: `src/app/dashboard/admin/campaigns/page.tsx` (Campaign Approvals)

**Step 1: Implement Admin Home (Stats)**
Fetch and display totals (Supporters, Creators, Credits, Payments).

**Step 2: Implement Campaign Approvals**
Build table fetching pending campaigns with Approve/Reject buttons mutating status via API route.

**Step 3: Commit**
```bash
git add src/app/dashboard/admin src/app/api/campaigns/pending
git commit -m "feat: admin home and campaign approvals"
```

### Task 8: Creator Dashboard Features

**Files:**
- Create: `src/app/dashboard/creator/page.tsx`
- Create: `src/app/dashboard/creator/add-campaign/page.tsx`
- Create: `src/app/api/campaigns/route.ts`

**Step 1: Implement Add Campaign**
Build form for creating campaigns. Post to `/api/campaigns`. Upload images via imgBB API.

**Step 2: Implement My Campaigns**
List creator's campaigns with update/delete actions.

**Step 3: Commit**
```bash
git add src/app/dashboard/creator src/app/api/campaigns
git commit -m "feat: creator campaign management"
```

### Task 9: Supporter Dashboard Features

**Files:**
- Create: `src/app/dashboard/supporter/page.tsx`
- Create: `src/app/explore/page.tsx`
- Create: `src/app/explore/[id]/page.tsx`

**Step 1: Implement Explore Campaigns**
Build public `/explore` page showing approved campaigns as cards.

**Step 2: Implement Campaign Details & Contributions**
Build `/explore/[id]` with full details and a contribution form. Post to `/api/contributions`.

**Step 3: Commit**
```bash
git add src/app/dashboard/supporter src/app/explore
git commit -m "feat: explore campaigns and contribution flow"
```

### Task 10: Stripe Integration & Polish

**Files:**
- Create: `src/app/dashboard/supporter/purchase/page.tsx`
- Create: `src/app/api/payments/create-intent/route.ts`
- Create: `src/app/page.tsx` (Home Page)

**Step 1: Stripe Payment Setup**
Implement Stripe Elements on purchase page and backend intent creation for purchasing credits.

**Step 2: Home Page Polish**
Implement Hero slider (Swiper/Framer Motion), Top Funded campaigns, and Testimonials on the main page.

**Step 3: Commit**
```bash
git add src/app/dashboard/supporter/purchase src/app/api/payments src/app/page.tsx
git commit -m "feat: stripe integration and homepage styling"
```
