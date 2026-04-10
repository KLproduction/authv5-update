# Auth V5

Next.js 16 + NextAuth v5 + Prisma auth starter kit.

## What you get

- Credentials, Google, and GitHub sign-in
- Email verification
- Password reset
- 2FA
- Guest login
- Role-based access control
- Server-owned auth boundaries
- Unit tests + Playwright smoke tests
- Seed data for local development

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma + PostgreSQL
- NextAuth (Auth.js)
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- Playwright

## Quick Start

```bash
npm install
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment

Required:

- `DATABASE_URL`
- `AUTH_SECRET` or `NEXTAUTH_SECRET`

Optional:

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_PRODUCTION_URL`

See [docs/provider-config.md](docs/provider-config.md) for behavior details.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:e2e
npm run test:e2e:update
npm run db:seed
```

## Local Demo Accounts

- `admin@authkit.local` / `Admin123!`
- `user@authkit.local` / `User123!`
- `guest@authkit.local` / `Guest123!`

## Architecture

- Server Components by default
- Server Actions for mutations
- Auth and permission checks run on the server
- Prisma is the source of truth for roles and ownership

## Docs

- [Auth diagrams](docs/auth-diagrams.md)
- [Provider config](docs/provider-config.md)

## Tests

- Unit/domain tests: `npm run test`
- Browser smoke tests: `npm run test:e2e`

## Notes

- `founder-report/` contains internal review notes and is ignored by git.
- `nextjs-authentication/` is also ignored by git.
