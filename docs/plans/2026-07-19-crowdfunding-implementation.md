# Crowdfunding Platform Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a decoupled crowdfunding platform (Next.js client, Express server) that 100% fulfills all core and optional requirements (Stripe, imgBB, Pagination, Notifications, Search/Filter).

**Architecture:** 
- `client/`: Next.js App Router, Tailwind CSS, Shadcn UI, BetterAuth. Uses `lib/core/server.ts` for fetch wrappers.
- `server/`: Express.js, MongoDB/Mongoose. Exposes REST API secured by `verifyToken` middleware.

---

### Batch 1: Setup, Database & Core Auth

**Task 1-1 & 1-2: Scaffolding** *(Completed)*
- Next.js client and Express server created.

**Task 1-3: Setup Express and MongoDB Connection**
- Configure `dotenv`, `cors`, and connect mongoose to MongoDB Atlas.

**Task 1-4: Implement `verifyToken` Middleware**
- Read `Authorization: Bearer <token>`, query session/user from DB, attach `req.user`.

**Task 1-5: Setup Mongoose Models**
- **User**: name, email, image, role, credits.
- **Campaign**: title, story, category, funding_goal, min_contribution, deadline, reward_info, image_url, creator_email, creator_name, amount_raised, status.
- **Contribution**: campaign_id, campaign_title, amount, supporter_email, supporter_name, creator_name, creator_email, date, status.
- **Withdrawal**: creator_email, creator_name, withdrawal_credit, withdrawal_amount, payment_system, account_number, date, status.
- **Notification**: message, toEmail, actionRoute, time.
- **Report**: reporterName, campaignTitle, reason, date.

**Task 1-6 & 1-7 & 1-8: Client Auth Configuration**
- Configure BetterAuth. Implement `session.ts` (`requireRole`) and `server.ts` (fetch wrappers with auth header). Ensure no redirect loops on private route reload.

---

### Batch 2: Base UI & Authentication Pages

**Task 2-1: Setup Shadcn UI & Dependencies**
- Install Shadcn components, Framer Motion (for animations), and Swiper.

**Task 2-2: Build Base Layouts (Navbar, Footer, Sidebar)**
- **Navbar**: Not logged in (Explore, Login, Register, Join Dev). Logged in (Dashboard, Credits, Profile, Join Dev).
- **Footer**: Logo, Social links.
- **Sidebar**: Dashboard specific links based on role.

**Task 2-3: Build Auth Pages (/login, /register)**
- **Register**: Form (Name, Email, Password, Role). imgBB image upload. Give 50 credits to Supporter, 20 to Creator (ensure given only once).
- **Login**: Email/Pass and Google Sign-in. Redirect to dashboard.

---

### Batch 3: Campaign Logic & Public Exploration

**Task 3-1: Implement Campaign API Routes (Express)**
- GET/POST/PUT/DELETE `/api/campaigns`. Include logic for Advanced Search/Filter (category, deadline, funding goal).

**Task 3-2: Build Explore Campaigns Page (Client)**
- Display approved campaigns where deadline hasn't passed. Add Search/Filter UI.

**Task 3-3: Build Campaign Details & Contribution Flow (Client)**
- Campaign info + Contribution form. Submitting posts to `/api/contributions`.

---

### Batch 4: Role-Based Dashboards

**Task 4-1: Implement Dashboard API Routes (Express)**
- Endpoints for Contributions (approve/reject), Withdrawals, Users management, and Reporting. Add Pagination logic to `GET /api/contributions/supporter`.

**Task 4-2: Build Creator Dashboard Pages (Client)**
- **Home**: Count, active, raised.
- **Contributions to Review**: Approve (adds funds) / Reject (refunds).
- **Add Campaign**: Form with imgBB upload.
- **My Campaigns**: Edit/Delete (refunds supporters on delete).
- **Withdrawals**: 20 credits = $1. Form (Stripe/Bkash).

**Task 4-3: Build Supporter Dashboard Pages (Client)**
- **Home**: Total contributions, pending, approved.
- **My Contributions**: Tabular view with **Pagination**.
- **Report Campaign**: UI to report fraudulent campaigns.

**Task 4-4: Build Admin Dashboard Pages (Client)**
- **Home**: Global stats.
- **Campaign Approvals**: Approve/Reject.
- **Withdrawal Requests**: Payment Success (deducts credits).
- **Manage Users**: Update role, delete.
- **Reports**: Suspend/Delete campaigns.

---

### Batch 5: Payments, Notifications & Polish

**Task 5-1: Integrate Stripe Payment System**
- `/api/payments/create-intent`. Packages ($10/100c, $25/300c, $60/800c, $110/1500c). Update credits post-payment.

**Task 5-2: Implement Notification & Email System**
- Backend: Insert to Notification collection on approvals, rejections, new contributions. Optionally trigger email via SendGrid/SES.
- Frontend: Floating pop-up in Navbar reading notifications.

**Task 5-3: Build Home Page (Hero Slider, Top Funded, Testimonials)**
- Use Swiper and Framer Motion. Ensure no Lorem Ipsum. Minimum 3 extra sections.

**Task 5-4: Final Responsive Design Polish & README**
- Verify mobile/tablet responsiveness. Ensure 20 client / 12 server commits.
- Create README.md with required details.
