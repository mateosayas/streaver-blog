# Assumptions

This document outlines design decisions and scope boundaries made while implementing the challenge.

---

# Authentication

Authentication was added as an extension beyond the original challenge scope.

The following rules are enforced:

- Unauthenticated users can browse and filter posts but cannot delete.
- Authenticated regular users can only delete their own posts (`post.userId === session.userId`).
- The `admin` user can delete any post regardless of ownership.
- Authorization is enforced server-side in the API route — the client is never trusted.

**Implementation decisions:**

- Passwords are hashed with **bcryptjs** (pure JavaScript — no native binaries or no C++ compiler required, so reviewers can `npm install` without platform issues).
- No registration flow — users are seeded. In production, a registration flow would be added.
- Admin credentials are intentionally simple (`admin` / `admin`) for evaluation purposes.
- Default password for all seeded JSONPlaceholder users is `password123`.

---

# Database

- SQLite with Prisma ORM was used as suggested in the challenge.
- The `.env` file is committed to the repository intentionally, as required by the challenge instructions, to simplify local setup.

**SQLite path resolution quirk:** Prisma CLI resolves SQLite file paths relative to the `schema.prisma` file location (`prisma/`), while the Prisma Client (runtime) resolves them relative to the process working directory (project root). With the schema at `prisma/schema.prisma` and `DATABASE_URL="file:./prisma/dev.db"`:

- The app correctly finds `prisma/dev.db` (resolved from project root).
- `prisma migrate dev` targets `prisma/prisma/dev.db` (resolved from `prisma/`), creating a second file.

After running `prisma migrate dev`, copy the result back to the correct location:

```bash
cp prisma/prisma/dev.db prisma/dev.db && rm -rf prisma/prisma
```

---

# Seed Data

Initial data is sourced from:

- https://jsonplaceholder.typicode.com/users
- https://jsonplaceholder.typicode.com/posts

The seed script imports this data into the database and is **idempotent**, meaning it can be run multiple times safely.

---

# Data Access Layer

All database interactions are implemented inside `src/lib/data/`.

Server Components call DAL functions directly during server rendering for reads, while API route handlers reuse the same functions for mutations.

This keeps Prisma isolated from route handlers and UI components and centralizes database logic in one location.

---

# Data Fetching Strategy

The `/posts` page fetches data directly during server rendering using Server Components.

The page reads `searchParams` to filter posts by `userId`. Because of this, Next.js treats the route as **dynamic**, meaning it is rendered on each request rather than statically generated.

Since the data layer uses Prisma instead of `fetch`, Next.js's Data Cache does not apply. Each request therefore performs a fresh database query.

Client-side data fetching libraries such as TanStack Query were considered but are unnecessary for this application because:

- reads occur during server rendering
- there is only a single mutation
- optimistic UI updates are handled locally

For a larger application with multiple client-side queries or background refetching, TanStack Query would likely be introduced.

---

# Post Deletion

Posts use a **soft delete** mechanism implemented through a `deletedAt` timestamp rather than being permanently removed.

This mirrors common production patterns where records are rarely hard-deleted and allows potential future features such as restoring posts or maintaining audit history.

All read queries exclude records where `deletedAt` is not `null`.

---

# Pagination

Pagination was intentionally not implemented.

The seeded dataset contains only 100 posts, which is manageable to render without pagination.

For larger datasets, either offset-based or cursor-based pagination would be introduced.

---

# Offline UX

The challenge mentions that users frequently experience poor or unstable network connections. To improve the user experience in these situations, the following patterns were implemented:

- optimistic UI updates when deleting posts
- retry actions for failed requests
- an offline detection banner
- destructive actions disabled while offline

These patterns ensure the interface remains responsive even when network conditions are unreliable.

---

# Error Handling

Next.js's `error.tsx` route convention is used to handle server-side rendering failures.

This automatically wraps the route in a React Error Boundary and renders fallback UI if a Server Component throws.

In this application, server rendering and database access represent the primary failure surfaces.

---

# API Design

API routes are versioned under `/api/v1/`.

All responses follow a consistent envelope format:

```
{ success: true, data }
{ success: false, error: { code, message } }
```

Input validation is performed using **Zod** before any database operations occur.

---

# URL State Management

The `userId` filter is stored in the URL query string.

The `nuqs` library provides a type-safe abstraction for managing query parameters that works consistently in both Server and Client Components.

This allows:

- server-rendered filtered results
- shareable URLs
- persistence across refreshes
- predictable browser navigation behavior

---

# Forms

The login form uses native browser form handling (`FormData`) rather than a form library like **react-hook-form**.

The application has a single form with two fields and no complex validation requirements — the only constraint is that both fields are required, which is enforced natively via the `required` attribute. Introducing a form library for this use case would add dependency overhead and boilerplate without meaningful benefit.

If the application grows to include registration, profile editing, or other forms with conditional fields, cross-field validation, or async validation logic, adopting react-hook-form would be a natural next step.

---

# UI & Styling

The UI uses **Tailwind CSS** and **shadcn/ui** components to provide accessible and composable primitives.

---

# Testing

Unit tests are implemented using **Vitest** and **React Testing Library**.

Tests focus on:

- Important UI components
- validation schemas
- helper utilities

End-to-end testing is outside the scope of this challenge but would likely be implemented using **Playwright** in a production environment.
