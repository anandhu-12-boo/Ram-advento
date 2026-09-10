# Ram Adventure — Real Bookings, Customer Accounts & Admin Dashboard

## Current state (checked)

The site runs without errors: home page, navbar, hero video, jeep logo, animations, tours, safari, gallery, about, contact, booking and confirmation pages all load and build cleanly. There is nothing broken to repair, so all existing design and animation work stays exactly as it is.

Today the booking form only shows a confirmation on screen — nothing is saved anywhere.

## About the technology request

This project is built on Lovable's own framework, not Next.js, and MongoDB cannot run here. Lovable Cloud provides the same capabilities with no external accounts: a real database, secure logins with hashed passwords, roles, server-side rules, and secure secret storage. Everything in your requirements list is achievable — same behaviour, same security guarantees, different underlying database.

## What gets built

### 1. Accounts
- Sign up page (name, email, phone, password, confirm password) with validation and duplicate-email protection.
- Login page with sign in, register link and forgot password (email reset link).
- Session survives page refresh; passwords never reach the browser.
- Navbar becomes session-aware: logged out shows Login + Book Now; customers see their name, My Bookings, Logout; admins additionally see Admin Dashboard.
- First admin: ramadventure143@gmail.com (you sign up with it, and it is granted the admin role).

### 2. Customer area
- `/my-account` — welcome, upcoming / completed / cancelled adventures, and counts.
- `/my-account/bookings` — cards with booking ID, tour image and name, date, time, guests, vehicle, pickup, amount, payment and booking status badges; view details, download, cancel.
- `/my-account/bookings/<id>` — full premium-styled booking detail.
- Customers can only ever see their own bookings, enforced on the server.

### 3. Booking flow (existing UI preserved)
- Book Now on a tour sends signed-out visitors to login and returns them to the same booking afterwards.
- Same six-step flow, plus a live availability check on date/time.
- On confirm, the server validates the tour, date, slot, guest capacity, recalculates the price itself, reserves the slot, and saves the booking with a readable ID like RAM-2026-00025.
- Fully booked slots show "Fully booked" and cannot be booked. Payment is recorded as pending (pay on pickup); the admin marks it paid.

### 4. Admin dashboard (`/admin`)
Separate clean dashboard look using the Ram Adventure colours — cards, tables, charts, badges, collapsible sidebar, works on mobile.
- Overview: total / today / pending / confirmed / completed / cancelled bookings, customers, tours, revenue from paid bookings; today's and upcoming bookings; pending actions; quick buttons.
- Bookings table with search (ID, name, phone, email), filters (status, payment, tour, date), sorting, and status change. Changing status saves immediately and the customer sees the new status on their side.
- Booking detail page with confirm / complete / cancel / reschedule and confirmation dialogs before destructive actions.
- Tours: add, edit, delete, activate, feature — changes appear on the public tour pages.
- Availability: pick tour, date, time, total slots; see booked and available; enable/disable.
- Customers: list with bookings, trips, total spent, joined date, status; activate/deactivate; no passwords shown.
- Reviews: approve / reject / delete; only approved reviews appear publicly.
- Enquiries: contact form submissions with New / Contacted / Resolved status.
- Revenue & analytics: today, week, month, total, revenue and bookings over time, most-booked tours — all from real data.
- Customers cannot reach any admin page or admin data.

### 5. Notifications
In-dashboard "New booking received" alerts, and email notifications (booking received, confirmed, cancelled) once you give me an email sender — I will build the email step so it is ready to switch on.

### 6. Polish
Skeleton and button loading states, clear friendly messages for wrong password, duplicate email, tour not found, slot full, unauthorised and failures. No raw technical errors shown.

## Technical notes

- Lovable Cloud (Postgres + Auth) replaces MongoDB/Mongoose; row-level security plus server-side role checks replace hand-rolled middleware.
- Tables: profiles, user_roles (separate table, never on profiles), tours, bookings, availability, reviews, contact_enquiries. Existing tour content is seeded so public pages keep working.
- All reads/writes go through server functions with Zod validation; server-side price calculation and slot reservation via an atomic database function to prevent overbooking and duplicate submissions.
- Admin routes and data guarded by a `has_role` security-definer check, not by hiding buttons.
- TanStack Query with cache invalidation so admin and customer views reflect status changes.
- Payment provider (Razorpay-style checkout) and image uploads can be switched on later without reworking the booking model.
- Secrets stay server-side only.

## Order of work

1. Turn on Lovable Cloud and create the database tables, roles and security rules; seed tours.
2. Accounts, login/register pages, session-aware navbar, admin role for your email.
3. Customer dashboard and my-bookings.
4. Connect the existing booking flow to the database, with availability and server-side pricing.
5. Admin login gate, dashboard, bookings management and status updates.
6. Tours, availability, customers, reviews, enquiries admin pages.
7. Revenue and analytics.
8. Notifications and email hooks.
9. End-to-end testing of every flow in your test list, including cross-customer access and admin access blocks.

## What I need from you

Real phone number, email and prices to replace the placeholders I invented, and an email sender account when you want live emails.
