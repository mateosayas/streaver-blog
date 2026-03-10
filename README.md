# Streaver Blog

A small Next.js application that lists blog posts, allows filtering by author, and supports post deletion with optimistic UI updates.

The core challenge scope covers: listing posts fetched from JSONPlaceholder, filtering by author, and deleting posts with optimistic UI updates. Additional features (authentication, offline UX, security headers) were added beyond that scope.

The application is designed with users in mind who may experience unstable or slow internet connections, prioritizing responsive UI feedback and clear error handling.

---

# Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **URL State:** nuqs
- **Testing:** Vitest + React Testing Library

---

# Architecture Overview

The application follows a simple layered structure that separates UI, server logic, and database access.

## Data Access Layer

All database operations live in `src/lib/data/`.

This layer encapsulates Prisma queries so that:

- Server Components can call database reads directly during SSR
- API Route Handlers reuse the same logic for mutations
- Prisma does not leak into UI components or route handlers

Centralizing database logic in this layer keeps the architecture easier to maintain and evolve.

---

## Mutations

Post deletion is implemented through a REST endpoint:

```
DELETE /api/v1/posts/:id
```

The UI performs an **optimistic update**:

1. The post is immediately removed from the UI
2. The API request runs in the background
3. If the request fails, the post is restored and an error toast appears
4. On success, `router.refresh()` re-renders the Server Component tree to ensure the UI reflects the latest server state

---

## URL State

Filtering by `userId` is implemented using query parameters.

The `nuqs` library provides a type-safe abstraction for managing URL state that works both:

- on the **server during SSR**
- on the **client without full page reloads**

This allows filtered views to persist across refreshes and be shareable via URL.

---

## Error Handling

Server rendering errors are handled using the Next.js `error.tsx` route convention, which automatically wraps the route in a React Error Boundary.

API responses follow a standardized envelope:

```
{ success: true, data }
{ success: false, error: { code, message } }
```

This ensures predictable client-side handling.

---

# Getting Started

## Prerequisites

- Node.js 18+
- npm

---

## Installation

```bash
git clone <repo-url>
cd streaver-blog
npm install
```

---

## Environment Variables

The challenge requires the repository to include the environment variables needed to run the project locally.

The `.env` file is therefore committed intentionally to simplify local setup.

---

## Database Setup

```bash
npx prisma migrate dev
npx prisma db seed
```

This will:

- create the SQLite database
- apply database migrations
- populate the database with seeded users and posts

---

## Test Credentials

| Role    | Username  | Password    |
| ------- | --------- | ----------- |
| Admin   | admin     | admin       |
| Regular | Bret      | password123 |
| Regular | Antonette | password123 |
| Regular | Samantha  | password123 |

- **Admin** can delete any post.
- **Regular users** can only delete their own posts.
- **Unauthenticated users** can browse posts but cannot delete.

---

## Development

```bash
npm run dev
```

Then open:

```
http://localhost:3000/posts
```

---

## Testing

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npx vitest run
```

---

## Production Build

```bash
npm run build
npm start
```

---

# Additional Notes

See `assumptions.md` for additional design decisions and implementation considerations.
