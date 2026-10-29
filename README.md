# VEXORIS Hackathon & Fest Platform

Official event management, scoring, and registration platform built with React, Vite, TailwindCSS, and Supabase.

---

## 🚀 Supabase Setup Guide

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Add your Supabase project credentials (from **Supabase Dashboard -> Project Settings -> API**):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 2. Run Database Schema & Policies
1. Open your Supabase Dashboard.
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run the entire content of [`supabase/schema.sql`](supabase/schema.sql).
   - This creates `events`, `registrations`, and `participants` tables.
   - Sets up initial events matching the official catalog (`IT MANAGER`, `QUIZ`, `FUNZOVA`, `VEXTALK`, `DEBATE`, `BGMI`, `NFS`, `FREE FIRE`, `E-FOOTBALL`).
   - Configures Row Level Security (RLS) policies allowing public registration and participant duplicate checks.

### 3. Run Locally
```bash
npm install
npm run dev
```
