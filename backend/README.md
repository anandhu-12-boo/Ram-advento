# Ram Tours & Safaris — Express API Backend

Standalone Node.js + Express + TypeScript backend service for **Ram Tours & Safaris**.

## Features

- **Tours API**: Public tour catalog, detail pages, admin CRUD management.
- **Availability API**: Real-time slot lookup by tour & date, admin availability configuration.
- **Bookings API**: Multi-step booking creation with validations & atomic slot reservation, user booking history, booking cancellation, admin booking status updates.
- **Account API**: User profiles, role verification.
- **Enquiries API**: Contact form handling & admin inbox.
- **Reviews API**: Customer review submission & admin moderation.
- **Admin Analytics API**: Revenue metrics, daily stats, popular tours breakdown.

## Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Variables
Ensure `.env` contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb+srv://sojan:oXT3qEx7HHmlUNsd@cluster0.vvjc2.mongodb.net/ramms?appName=Cluster0
AUTH_SECRET=ram-adventure-secret-token-key-2026
```

### 3. Running in Development
```bash
npm run dev
```

Server will start on `http://localhost:5000`.

### 4. Build for Production
```bash
npm run build
npm start
```

## API Endpoints Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | Public |
| `GET` | `/api/tours` | List all available tours | Public |
| `GET` | `/api/tours/:slug` | Tour detail by slug | Public |
| `POST` | `/api/tours` | Create tour package | Admin |
| `GET` | `/api/availability` | Slot availability for tour & date | Public |
| `POST` | `/api/bookings` | Book a tour | Authenticated |
| `GET` | `/api/bookings/my` | User's booking history | Authenticated |
| `POST` | `/api/bookings/:id/cancel` | Cancel a booking | Authenticated |
| `GET` | `/api/account/profile` | User profile & role info | Authenticated |
| `POST` | `/api/enquiries` | Submit contact enquiry | Public |
| `GET` | `/api/reviews` | List approved customer reviews | Public |
| `POST` | `/api/reviews` | Submit a review | Authenticated |
| `GET` | `/api/admin/overview` | Admin dashboard analytics | Admin |
