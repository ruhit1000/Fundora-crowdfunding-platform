# Crowdfunding Platform Design Document

## 1. Architecture & Database Schema

### Architecture (Decoupled Client-Server)
- **Frontend (`client/`)**: Next.js App Router. Handles UI, routing, and frontend state.
- **Backend (`server/`)**: Express.js (Node.js). Handles API logic, business rules, and database transactions.
- **Database**: MongoDB hosted on MongoDB Atlas, shared between both client (for Auth) and server (for Data). Mongoose used in Express for schemas.
- **State Management**: Zustand for managing global UI state.
- **Payment Integration**: Stripe SDK (Test Mode).

### Database Models (Managed by Express Backend)

1. **User** (Extended by BetterAuth)
   - `name`, `email`, `image`, `role` (Admin | Creator | Supporter), `credits`
2. **Campaign**
   - `title`, `story`, `category`, `funding_goal`, `min_contribution`, `deadline`, `reward_info`, `image_url`
   - `creator_email`, `creator_name`, `amount_raised`, `status`
3. **Contribution**
   - `campaign_id`, `campaign_title`, `amount`
   - `supporter_email`, `supporter_name`, `creator_name`, `creator_email`, `date`, `status`
4. **Withdrawal**
   - `creator_email`, `creator_name`, `withdrawal_credit`, `withdrawal_amount`
   - `payment_system`, `account_number`, `date`, `status`
5. **Notification**
   - `message`, `toEmail`, `actionRoute`, `time`

## 2. UI/UX & Components

### Tech Stack
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Animations**: Framer Motion, Swiper Slider

### Layouts & Key Components
- **Client Root**: `client/src/app`
- **Dashboard Layout**: Navbar + Sidebar (role-specific navigation) + Main Content Area + Footer.
- **Lib Core**: `client/src/lib/core/` containing `server.ts` (API fetch wrappers) and `session.ts` (session & role guards).

## 3. API Routes & Authentication Flow

### Authentication Flow (BetterAuth + Express)
- **Strategy**: **BetterAuth** runs on the Next.js frontend to handle login, sessions, and OAuth natively. Sessions are stored in the shared MongoDB.
- **Frontend Protection**: No Next.js Middleware. Instead, `lib/core/session.ts` provides `requireRole` which redirects users if they lack permissions at the page level.
- **Backend Verification**: Next.js sends the BetterAuth token via the `Authorization: Bearer <token>` header on every request via wrappers in `lib/core/server.ts`. 
- **Express Security**: The Express backend uses a custom `verifyToken` middleware that parses the header, queries the `sessions` collection in MongoDB to validate the token, and attaches the user object to the request.

### API Routes (Express Server)
- **`/api/campaigns`**: CRUD for campaigns. Admin approval (`/api/campaigns/:id/approve`).
- **`/api/contributions`**: Creating contributions and approving/rejecting.
- **`/api/withdrawals`**: Submitting requests and approving them.
- **`/api/payments/create-intent`**: Stripe integration.
