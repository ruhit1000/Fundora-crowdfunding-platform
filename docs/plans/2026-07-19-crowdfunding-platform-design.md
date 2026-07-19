# Crowdfunding Platform Design Document

## 1. Architecture & Database Schema

### Architecture
- **Framework**: Next.js App Router (unified full-stack application)
- **Database**: MongoDB hosted on MongoDB Atlas, using Mongoose for schema validation.
- **State Management**: Zustand for managing global user state (role, available credits).
- **Payment Integration**: Stripe SDK (Test Mode) for purchasing credits.

### Database Models

1. **User**
   - `name`, `email`, `password`, `photo_url`
   - `role`: (Admin | Creator | Supporter)
   - `credits`: Number
   - `auth_provider`: (Local | Google)

2. **Campaign**
   - `title`, `story`, `category`, `funding_goal`, `min_contribution`, `deadline`, `reward_info`, `image_url`
   - `creator_email`, `creator_name`
   - `amount_raised`: Number
   - `status`: (pending | approved | rejected)

3. **Contribution**
   - `campaign_id`, `campaign_title`, `amount`
   - `supporter_email`, `supporter_name`
   - `creator_name`, `creator_email`
   - `date`: Date
   - `status`: (pending | approved | rejected)

4. **Withdrawal**
   - `creator_email`, `creator_name`
   - `withdrawal_credit`, `withdrawal_amount` (20 credits = $1)
   - `payment_system`, `account_number`
   - `date`: Date
   - `status`: (pending | approved)

5. **Notification**
   - `message`, `toEmail`, `actionRoute`, `time`

## 2. UI/UX & Components

### Tech Stack
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (for accessible UI primitives like modals, dropdowns, and tables)
- **Animations**: Framer Motion (for page transitions and homepage flair), Swiper Slider (for Hero carousel)

### Layouts
- **Basic Layout**: For public pages (Home, Login, Register, Explore). Includes Navbar and Footer.
- **Dashboard Layout**: For logged-in users. Includes Navbar, Sidebar (role-specific navigation), Main Content Area, and Footer.

### Key Components
- **Hero Slider**: Animated carousel displaying featured/top campaigns.
- **Campaign Cards**: Reusable components displaying campaign summary (image, title, creator, deadline, amount raised).
- **Notifications Dropdown**: Navbar component that fetches and displays user-specific notifications.
- **Data Tables**: Used in Creator and Admin dashboards (Manage Campaigns, Withdrawals, Contributions).
- **Payment Modal**: Stripe Elements form for purchasing credit packages securely.

## 3. API Routes & Authentication Flow

### Authentication Flow & Security Proxy
- **Strategy**: **BetterAuth** for robust, modern authentication in Next.js. It natively supports type-safe sessions, credential/OAuth login, and extensible plugins.
- **Providers**: Email/Password and Google OAuth integrations.
- **Security Proxy**: Next.js **Middleware** will act as a security proxy. It will intercept all incoming requests at the Edge, verify the BetterAuth session, and enforce role-based access control (RBAC). Unauthenticated or unauthorized requests are blocked/redirected before hitting the frontend rendering layer.
- **Storage**: BetterAuth automatically manages secure HTTP-only cookies for sessions and tokens.

### API Routes
- **`/api/auth/[...all]`**: BetterAuth dynamic API route handling all login, logout, and session validation automatically.
- **`/api/campaigns`**: CRUD for campaigns. Additional routes for Admin approval (`/api/campaigns/[id]/approve`).
- **`/api/contributions`**: Creating contributions (Supporter) and approving/rejecting (Creator).
- **`/api/withdrawals`**: Submitting requests (Creator) and approving them (Admin).
- **`/api/payments/create-intent`**: Stripe integration to facilitate credit purchases.
