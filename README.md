# Streaver Blog

A Next.js blog application that lists posts, allows filtering by author, and supports post deletion with optimistic UI updates. Built for users with unstable internet connections.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Query Params:** nuqs
- **Testing:** Vitest + React Testing Library

## Architecture

- **Data Access Layer** (`src/lib/data/`) — shared Prisma queries used by both Server Components (direct calls) and API Route Handlers (behind HTTP)
- **Server Components** — server-side rendering for reads, for now only on /posts page.
- **Route Handlers** (`/api/v1/`) — RESTful endpoints for client-side mutations.
- **Client Components** — interactive UI with optimistic updates and `router.refresh()` to sync server state after mutations.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd streaver-blog
npm install
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma db seed
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Testing

```bash
npm test           # Watch mode
npx vitest run     # Single run
```

### Build

```bash
npm run build
npm start
```
