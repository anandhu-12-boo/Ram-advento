#  Ram Tours & Safaris

A modern full-stack web application for booking off-road Jeep safaris and adventure tours in Munnar, Kerala.

---

## 📁 Project Structure

The project is cleanly separated into two main directories:

```text
Ram-Tours/
├── 📁 frontend/     # React + Vite client UI
└── 📁 backend/      # Express + Node.js + MongoDB API server
```

---

## 💻 1. Frontend (`/frontend`)

The frontend is built with **React (TypeScript)**, **Vite**, and **Tailwind CSS**.

* **Path:** `./frontend`
* **Port:** `http://localhost:3000`

### Quick Start (Frontend)
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ 2. Backend (`/backend`)

The backend is built with **Express (Node.js)** and **MongoDB (Mongoose)**.

* **Path:** `./backend`
* **Port:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/api/health`

### Environment Setup (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.vvjc2.mongodb.net/?appName=Cluster0
```

### Quick Start (Backend)
```bash
cd backend
npm install
npm run dev
```

### Seed Admin & Initial Data
```bash
cd backend
npm run seed:all
```

---

## 🔑 Admin Login Credentials

* **Email:** `********`
* **Password:** `*******`

---

## 🚀 Running Both (From Root)

You can also run commands from the project root folder:

```bash
# Install dependencies for both frontend and backend
npm run install:all

# Run Frontend
npm run dev:frontend

# Run Backend
npm run dev:backend
```
# Ram-advento
