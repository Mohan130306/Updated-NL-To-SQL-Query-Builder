# Updated NL To SQL Query Builder

![Aurora UI](https://img.shields.io/badge/UI-Aurora%20Glass-cyan) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688) ![React](https://img.shields.io/badge/Frontend-React-61DAFB) ![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)

This project upgrades an existing Natural Language to SQL generation app into a full-fledged, highly secure RBAC (Role-Based Access Control) application using FastAPI and React, featuring a stunning "Aurora Glass" UI.

## 🌟 Key Features

- **Natural Language to SQL**: Instantly generate and execute SQL queries using AI.
- **OTP-Based Authentication**: Secure, passwordless entry using 6-digit email OTPs, plus standard password support and account recovery.
- **Granular RBAC System**: 5-tier hierarchical permission system ranging from Viewers to Admins.
- **Aurora Glass UI**: A beautiful, modern interface with dark mode, frosted glass panels, neon accents, and smooth micro-animations.
- **100% Free Cloud Deployment Ready**: Pre-configured to deploy on Vercel, Render, and Supabase without spending a dime.

---

## 🛡️ Five-Tier Role Hierarchy

The system operates strictly under five defined roles to ensure data security and compliance.

```text
┌─────────────────────────────────────────────────────────────┐
│                    FIVE ROLES SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣ ADMIN (Owner)                                          │
│     ├─ Permissions: CREATE, ALTER, INSERT, UPDATE, DROP     │
│     └─ Can: Manage users, assign roles, full DB access      │
│                                                             │
│  2️⃣ DATA ENGINEER                                          │
│     ├─ Permissions: INSERT, UPDATE, DELETE, SELECT          │
│     └─ Can: Generate queries, write & read, no drops        │
│                                                             │
│  3️⃣ POWER USER                                             │
│     ├─ Permissions: SELECT (Cross-table), complex JOINS     │
│     └─ Can: Advanced analytics, no writes                   │
│                                                             │
│  4️⃣ AUDITOR                                                │
│     ├─ Permissions: SELECT (Limited), View Logs             │
│     └─ Can: Read query history, security checks             │
│                                                             │
│  5️⃣ VIEWER (Default)                                       │
│     ├─ Permissions: SELECT (Basic only)                     │
│     └─ Can: View pre-generated reports, simple reads        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Guide (100% Free Stack)

This repository is optimized for deployment on the best modern free-tier services.

### 1. Database (Supabase - Free Postgres)
1. Create a free project on [Supabase](https://supabase.com/).
2. Go to **Settings > Database** and copy your **Connection URI**.

### 2. Backend (Render - Free Web Service)
1. Go to [Render](https://render.com/) and create a **New Web Service**.
2. Connect this GitHub repository.
3. Settings:
   - Language: `Python 3`
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
4. Add Environment Variables:
   - `DATABASE_URL`: *Your Supabase URI*
   - `PYTHON_VERSION`: `3.10.0`
5. Deploy and copy your backend URL.

### 3. Frontend (Vercel - Free React Hosting)
1. Go to [Vercel](https://vercel.com/) and import this repository.
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: *Your Render backend URL + `/api`* (e.g. `https://your-backend.onrender.com/api`)
4. Deploy!

### 4. Final Connection
Go back to Render, add a new Environment Variable `FRONTEND_URL` with your Vercel URL, and save. Your app is now live!

---

## 💻 Local Development

### 1. Clone & Setup
```bash
git clone https://github.com/Mohan130306/Updated-NL-To-SQL-Query-Builder.git
cd Updated-NL-To-SQL-Query-Builder
```

### 2. Run the App
To run both the frontend and backend locally with one command (requires PowerShell):
```powershell
.\run_local.ps1
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

### 3. Database Seeding (Optional)
If you want to reset the database and spawn 5 test users (one for each role):
```bash
cd backend
python -m app.db.init_db
```
