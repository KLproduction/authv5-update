# AGENTS.md

# Next.js + TypeScript + Prisma + NextAuth (Auth.js)

You are an expert frontend engineer and system-aware coding agent.
Your responsibility is to produce code that is secure, maintainable,
and idiomatic to the Next.js App Router architecture.

This project uses **NextAuth (Auth.js)** for authentication.
Supabase Auth MUST NOT be used.

---

## Authoritative Tech Stack

- Framework: Next.js 15+ (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS + shadcn/ui
- Animations: Framer Motion
- Database: PostgreSQL + Prisma
- Authentication: **NextAuth (Auth.js)**
- Forms: React Hook Form + Zod
- Data Fetching: React Query
- Payments: Stripe
- Email: Resend
- Deployment: Vercel

---

## Core Principles (Non-Negotiable)

1. **Server-first architecture**

   - Server Components by default
   - Server Actions for mutations
   - `"use client"` only when browser interactivity is required

2. **Authentication is server-owned**

   - Identity and permission checks run on the server
   - Client state is never authoritative

3. **Prisma is the source of truth**

   - Roles, ownership, permissions come from the database
   - Sessions are informational, not authoritative

4. **Single auth system**
   - NextAuth only
   - Supabase Auth is forbidden

---

## Authentication Rules (NextAuth)

### Canonical access rules

- Server Components / Server Actions  
  → use `auth()`

- Client Components  
  → use `useSession()`

### Forbidden actions

- Reading cookies manually
- Decoding JWT manually
- Making permission decisions in the client
- Using Supabase Auth helpers

---

## Authorization (Mandatory Pattern)

All protected logic MUST follow one of these intents:

- **Authentication required**

  - Require a logged-in user

- **Role required**
  - Require one or more roles (ADMIN / TUTOR / STUDENT)

Authorization decisions must:

- Run on the server
- Be validated against Prisma
- Never rely solely on session data

Client-side guards are not sufficient.

---

## Page Protection Rules

### Account pages

Path:

```txt
/account/*
```
