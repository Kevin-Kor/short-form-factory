# Short Form Factory - Project Handover Document

## 1. Project Overview
**Name**: Short Form Factory (숏폼팩토리)
**Description**: A web platform for ordering professional short-form video production services (Shooting, Editing, All-in-One). Users can browse services, place orders, track progress, and manage their content.
**Goal**: Transitioned from a landing page prototype to a functional MVP with real authentication and database integration.

## 2. Infrastructure & URLs
- **GitHub Repository**: [https://github.com/Kevin-Kor/short-form-factory](https://github.com/Kevin-Kor/short-form-factory)
- **Live Deployment (Vercel)**: [https://short-form-factory.vercel.app](https://short-form-factory.vercel.app)
- **Supabase Project**: (User's Private Project)

## 3. Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Design System, Dark Mode Theme)
- **Backend / Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email, Google, Kakao)
- **Deployment**: Vercel (Auto-deploy from `main` branch)
- **Icons**: Lucide React

## 4. Configuration & Environment Variables
To run this project, the following environment variables must be configured in `.env.local` (local) and Vercel Project Settings (production):

| Variable Name | Description | Where to Find |
|---------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Public Key | Supabase Dashboard > Settings > API |

> **Note**: For Social Login (Google/Kakao) to work, you must also configure the "Redirect URLs" in the Supabase Authentication settings to include:
> - `http://localhost:3000` (for local dev)
> - `https://short-form-factory.vercel.app` (for production)

## 5. Key Features & Implementation Status

### A. User Interface (UI/UX)
- **Design**: Premium dark-themed UI with glassmorphism effects and smooth gradients.
- **Responsive**: Fully responsive layout for Desktop and Mobile.
- **Components**: Reusable UI components (`Button`, `ServiceCard`, `Sidebar`, etc.) in `src/components`.

### B. Authentication (`src/context/AuthContext.tsx`)
- **Providers**: Email/Password, Google OAuth, Kakao OAuth.
- **State Management**: `AuthContext` handles `user`, `isLoggedIn`, and `isLoading` states.
- **Protection**: Protected routes (`/payment`, `/content`, `/admin`) redirect unauthenticated users.

### C. Service Ordering (`src/app/order`)
- **Flow**: Service Selection -> Option Configuration -> Order Submission.
- **Data**: Orders are saved to the Supabase `orders` table with the user's unique ID (`user_id`).

### D. User Dashboard
- **Payment History (`/payment`)**: Fetches and displays real order history for the logged-in user.
- **Credits (`/credits`)**: Users can view balance, request top-ups, and view request history.
- **Profile (`/profile`)**: Users can manage their Business Information (Company Name, Registration No, etc.).

### E. Admin Dashboard (`src/app/admin`)
- **Access Control**: Restricted to specific email (`manyd950222@gmail.com`).
- **Features**:
    - **Dashboard Stats**: Real-time counts for Orders, Users, and Pending Credit Requests.
    - **Order Management**: View all orders, update status (Pending <-> Completed).
    - **User Management**: View registered users and their credit balances.
    - **Credit Management**: Approve/Reject top-up requests with automatic balance updates.
    - **Business Info**: View submitted business details.

## 6. Database Schema (Supabase)

### Table: `orders`
| Column | Type | Description |
|--------|------|-------------|
| `id` | int8 | Primary Key |
| `created_at` | timestamptz | Creation timestamp |
| `user_id` | uuid | Foreign Key to `auth.users` |
| `service_type` | text | 'shooting', 'editing', 'all_in_one' |
| `status` | text | 'pending', 'completed', etc. |
| `amount` | int8 | Order total price |
| `details` | jsonb | JSON object containing order options |

### Table: `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary Key (references `auth.users`) |
| `email` | text | User email |
| `full_name` | text | User full name |
| `credit_balance` | int4 | Current credit balance (default 0) |

### Table: `credit_requests`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Foreign Key to `profiles.id` |
| `amount` | int4 | Requested amount |
| `depositor_name` | text | Name of depositor |
| `status` | text | 'pending', 'approved', 'rejected' |

### Table: `business_info`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary Key |
| `user_id` | uuid | Foreign Key to `profiles.id` |
| `company_name` | text | Company Name |
| `registration_number` | text | Business Registration Number |
| ... | ... | Other business details |

## 7. Project Structure
```
/src
  /app
    /admin       # Admin Dashboard (Protected)
    /api         # API Routes (Orders, Auth)
    /auth        # Auth Pages (Login, Register)
    /credits     # Credits Page (Protected)
    /dashboard   # Main User Dashboard
    /order       # Order Flow
    /payment     # Payment History (Protected)
    /profile     # Profile & Business Info (Protected)
  /components    # Reusable UI Components
  /context       # React Context (Auth)
  /lib           # Utilities (Supabase client, cn helper)
```

## 8. Known Issues & Next Steps
1.  **Payment Gateway**: Actual payment processing (PG) is not integrated. Currently, it simulates a "Deposit" flow via Credit Requests.
2.  **File Upload**: The "Editing" service requires file upload functionality (video files), which is currently mocked or skipped.
3.  **Admin Features**: Future updates could include detailed order views (modal/page) and file management.

## 9. How to Run Locally
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up `.env.local` with Supabase keys.
4.  Run development server: `npm run dev`
