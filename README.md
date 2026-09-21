# DIGITAL HEROES

Play for more than the game. A premium digital platform combining sports analytics, monthly prize draws, and charity impact.

## Overview
Digital Heroes is a subscription-driven web application designed to act as a 3D command center for users to track their rolling performance, automatically enter into a monthly rewards engine, and contribute to charities of their choice.

## Features
- **Cinematic 3D Interface**: Powered by React Three Fiber for a premium spatial experience.
- **Rolling Performance Core**: Database-level constraints automatically manage the user's latest 5 scores.
- **Draw Engine**: Server-side logic for generating winning numbers, calculating matches, and handling jackpot rollovers.
- **Automated Impact**: Seamless Stripe subscription flow that enforces a minimum 10% charity contribution.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui, Framer Motion
- **3D**: Three.js, React Three Fiber, @react-three/drei
- **Backend**: Next.js Server Actions, Supabase (Auth, PostgreSQL, Storage), Stripe
- **Testing**: Jest

## Architecture
A hybrid architecture utilizing standard React/Next.js for accessible forms and tables, overlaid on a continuous `GlobalCanvas` rendering complex WebGL visualizations without blocking the main application thread.

## Database Schema
Refer to `docs/database.md` for a complete breakdown of the Entity Relationship mapping.

## Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
```

## Local Setup
1. `npm install`
2. Populate `.env.local`
3. `npm run dev`

## Supabase Setup
Run the migrations in `supabase/migrations/` in your Supabase SQL Editor to provision the tables, RLS policies, and triggers.

## Stripe Setup
Create Monthly and Yearly products in Stripe. Copy their Price IDs into the environment variables.

## Webhook Setup
Configure a Stripe Webhook pointing to `YOUR_DOMAIN/api/stripe/webhook` listening for `checkout.session.completed` and `customer.subscription.*` events.

## Seed Data
Run `supabase/seed.sql` to populate the charities table.

## Demo Accounts
- **User Demo**: demo.user@example.com (Password: Password123!)
- **Admin Demo**: demo.admin@example.com (Password: Password123!)
*To set these up, sign up normally through the UI, then manually elevate the admin account's role in the Supabase database.*

## Draw Algorithm
The draw engine generates 5 unique random numbers (1-45). It compares these against the user's entry, calculating 3, 4, or 5 matches, and distributes the prize pool 40/35/25 respectively.

## Product Decisions & Assumptions
1. **Draw Entry Mechanism**: The PRD does not explicitly define how a user's draw numbers are generated. For this MVP, **the user's latest 5 retained Stableford scores become their 5 draw numbers**.
2. **Prize Pool Sizing**: The PRD specifies a 40/35/25 internal tier distribution, but does not specify what percentage of total subscription revenue becomes the initial prize pool. Therefore, this is treated as an admin-configurable `prize_pool_percentage`.

## Testing
Run `npm test` to execute the Jest suite against the Node.js draw engine to verify mathematical accuracy of splits, rollovers, and matching.

## Deployment
Deployed on Vercel. Ensure all environment variables are securely added to the Vercel project settings prior to build.

## Known Limitations
- The 3D Performance Core degrades gracefully on mobile by reducing node complexity, but relies on WebGL support.
