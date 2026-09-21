# Digital Heroes Database Schema

This document outlines the entity relationships for the Supabase PostgreSQL database.

## Entity Relationship Diagram (Conceptual)

```text
profiles
 ├── subscriptions
 ├── scores
 ├── user_charities → charities
 ├── draw_entries → draws
 └── winners

subscriptions → charity_contributions
draws → prize_pools
draws → draw_results
winners → winner_proofs
```

## Tables & Descriptions

### `profiles`
Extends Supabase `auth.users`. Stores the user's role (`subscriber` or `admin`) and basic info.
- **RLS**: Users can read/update their own profile. Client-side role elevation is prohibited.

### `subscriptions`
Tracks Stripe subscription status (active, past_due, cancelled, expired, incomplete).
- **RLS**: Users can view their own subscription. Only server (webhook) updates this.

### `scores`
Stores user performance (1-45). 
- **Constraints**: `UNIQUE(user_id, played_at)`.
- **Triggers**: A PostgreSQL trigger automatically deletes the oldest score if a user submits a 6th score, enforcing the "Latest 5 retained" rule natively.

### `charities`
Directory of available charities with descriptions and images.

### `user_charities`
Stores the user's selected charity and their contribution percentage (Min 10%).

### `charity_contributions`
Calculated records of the actual financial amount allocated from the subscription fee for that period.

### `draws`, `draw_entries`, `prize_pools`, `draw_results`
Core tables for the monthly draw engine. `draw_entries` implicitly links the user's 5 retained scores to the draw event at the time of the draw.

### `winners` & `winner_proofs`
Tracks users who matched 3, 4, or 5 numbers. Allows secure uploading of verification documents via Supabase Storage.
