# INFINITY CINEMA 🎬🌌
### Premium Limitless Anime-Fantasy Theatrical Ticket Booking Platform

Inspired by the limitless domain expansion aesthetic of Satoru Gojo, **Infinity Cinema** delivers a cutting-edge theatrical booking experience featuring multi-layer GSAP parallax, real-time 5-minute atomic seat locks, interactive multi-screen layout selection, simulated payment gateway checkout, encrypted QR tickets, and downloadable high-res vector PDF theatrical passes.

---

## 🚀 Key Features

1. **Limitless Cosmic Visual Aesthetic**: Deep midnight navy/black (`#05030f`, `#0a0820`), electric blue (`#4f6bff`), violet (`#8b5cf6`), and neon pink (`#c084fc`) glows, floating cosmic particles, animated lightning infinity motif, flying crows, and bare winter branch silhouettes.
2. **Multi-Layer Parallax Hero**: 5-layer scroll parallax powered by GSAP ScrollTrigger (slow background, rising particles, rotating infinity ring, crossing crows, and foreground branches).
3. **Theatrical Screen Selection**: Choose between **Screen 1 — IMAX Laser** (Dual 4K Laser, 12-channel audio), **Screen 2 — Dolby Atmos** (64-speaker sound sphere), and **Screen 3 — Prestige Standard**.
4. **Interactive Cinema Seat Grid**: Curved glowing auditorium screen graphic, realistic aisle spacing, row hierarchy (Recliner, Premium, Standard), live seats-left indicators, and max 8 seats per booking.
5. **Real-Time 5-Minute Seat Locking**: Prevents concurrent double-booking with atomic checking and an animated countdown timer.
6. **Multi-Payment Gateway**: Card, UPI Instant, and Net Banking checkout with 2-second authorization simulation, double-submission protection, and Razorpay test mode hook.
7. **Instant Digital & Vector PDF Theatrical Pass**: Real-time QR code generation via `qrcode` and pocket-ticket vector PDF export via `jspdf`.
8. **My Bookings Vault**: Complete historical pass repository with QR scanner modal and express entry passes.
9. **Help & Support Desk**: FAQ accordion and direct support ticket submission saved to database.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Axios, Context API (`AuthContext`, `BookingContext`).
- **Backend**: Node.js, Express, MongoDB/Mongoose (with built-in resilient in-memory fallback), JWT Authentication, bcryptjs, Helmet, CORS, Dotenv.
- **Extras**: `qrcode` (instant QR generation), `jspdf` (client and server PDF tickets), `canvas-confetti` (celebration).

---

## 📦 Environment Variables (`.env.example`)

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/infinity_cinema
JWT_SECRET=infinity_secret_limitless_void_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
```

### Frontend (`frontend/.env.example`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ⚡ Setup & Run Commands

### Option A: Standard Separated Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd infinity-cinema

# 2. Setup Backend
cd backend
npm install
npm run seed     # Seeds 12 movies, 3 screens, 7 days of shows, demo user
npm run dev      # Runs Express backend on http://localhost:5000

# 3. Setup Frontend (in separate terminal)
cd ../frontend
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```

### Option B: Integrated Full-Stack Runner (AI Studio & Docker)

```bash
npm install
npm run seed     # Seed catalog data
npm run dev      # Runs fullstack server (Express + Vite) on http://localhost:3000
```

---

## 🔑 Demo Account Credentials

- **Email**: `demo@cinema.com`
- **Password**: `Demo@123`
*(Or click the "1-Click Demo" button on the Login page for instant login)*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Sign in with email & password |
| `POST` | `/api/auth/logout` | Terminate session |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/movies` | Fetch movies (filters: `category`, `search`, `status`, `available`) |
| `GET` | `/api/movies/categories` | List all movie genre categories |
| `GET` | `/api/movies/:id` | Fetch movie details by ID |
| `GET` | `/api/movies/:id/shows?date=` | Get available screens & showtimes for movie |
| `GET` | `/api/shows/:id/seats` | Get seat layout, booked seats, and active locks |
| `POST` | `/api/shows/:id/lock` | Temporarily lock seats for 5 minutes |
| `POST` | `/api/shows/:id/unlock` | Release seat locks |
| `POST` | `/api/bookings` | Create confirmed booking |
| `GET` | `/api/bookings/my` | Retrieve authenticated user's tickets |
| `GET` | `/api/bookings/:id` | Retrieve single booking |
| `GET` | `/api/bookings/:id/pdf` | Download official PDF theatrical pass |
| `POST` | `/api/payments/process` | Simulated payment gateway (2s delay) |
| `POST` | `/api/support` | Submit a customer support ticket |
