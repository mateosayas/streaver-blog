# Assumptions & Design Decisions

This document outlines design decisions and scope boundaries made while implementing the challenge.

---

# Seed Data Availability

The seed script fetches data from:

https://jsonplaceholder.typicode.com

If the external API is unavailable when running:

npx prisma db seed

the seed process will fail.

---

# Database

SQLite with Prisma ORM was used as suggested in the challenge instructions.

The `.env` file is committed intentionally to simplify local setup as required by the challenge.

### SQLite Path Resolution

DATABASE_URL="file:./dev.db"

Prisma resolves this path relative to `schema.prisma`, placing the database at:

prisma/dev.db

At runtime Prisma converts this to an absolute path to ensure consistent resolution regardless of the working directory.

---

# Data Access Layer

All database interactions are implemented in:

src/lib/data/

Server Components call these functions during server rendering, while API route handlers reuse the same functions for mutations.

This approach:

- isolates Prisma from route handlers
- centralizes database access
- avoids duplication across server entry points

---

# Data Fetching Strategy

The `/posts` page fetches data during server rendering using **Next.js Server Components**.

The page reads `searchParams` to filter posts by `userId`. Because of this, Next.js treats the route as **dynamic**, meaning it renders on each request rather than being statically generated.

Client-side libraries such as **TanStack Query** were considered but not introduced because:

- reads occur during server rendering
- there is only a single mutation
- optimistic UI updates are handled locally

For larger applications with multiple client-side queries or background refetching, TanStack Query would likely be introduced.

---

# Post Deletion

Post deletion is implemented via:

DELETE /api/v1/posts/:id

Deletion uses a **soft delete** mechanism (`deletedAt` timestamp) rather than permanent removal.

Benefits:

- prevents accidental data loss
- allows future restoration
- supports audit history

All read queries exclude records where `deletedAt` is not `null`.

---

# Authentication

Authentication was implemented as an extension beyond the original challenge scope.

Rules enforced:

- Unauthenticated users can browse and filter posts but cannot delete
- Regular authenticated users can delete only their own posts
- The `admin` user can delete any post

Authorization is enforced **server-side** within the API route.

### Implementation details

- Authentication uses **NextAuth Credentials provider**
- Passwords are hashed using **bcryptjs**
- Users are seeded rather than registered

Default credentials exist only to simplify evaluation.

---

# Security Limitations

Rate limiting is not implemented.

The authentication endpoint:

/api/auth/callback/credentials

is therefore vulnerable to brute-force attempts.

In a production environment rate limiting would typically be implemented using:

- Next.js middleware
- an edge provider
- infrastructure-level protections

---

# Pagination

Pagination was intentionally omitted.

The seeded dataset contains only 100 posts, which can be rendered without performance issues.

For larger datasets either **offset pagination** or **cursor pagination** would be introduced.

---

# Offline UX

The challenge mentions that users frequently experience unreliable network connections.

To improve usability under poor network conditions the following patterns were implemented:

- optimistic UI updates
- retry actions for failed requests
- offline detection banner
- destructive actions disabled while offline

These patterns help keep the interface responsive even when the network is unstable.

---

# Error Handling

Next.js's `error.tsx` convention is used to handle server rendering failures.

This wraps the route in a React Error Boundary and renders fallback UI if a Server Component throws.

---

# API Design

API routes are versioned under:

/api/v1/

Responses follow a consistent envelope format:

```
{ success: true, data }
{ success: false, error: { code, message } }
```

Benefits of this pattern include:

- predictable client error handling
- consistent response structure across endpoints
- easier future API expansion

Input validation is performed using **Zod** before database operations occur.

---

# URL State Management

The `userId` filter is stored in the URL query string.

The **nuqs** library provides a type-safe abstraction for managing query parameters across both Server and Client Components.

This enables:

- shareable filtered URLs
- persistence across refreshes
- predictable browser navigation behavior

---

# Forms

The login form uses native browser form handling (`FormData`) instead of a form library.

The application contains only a single form with two required fields. Introducing a library such as **react-hook-form** would add unnecessary complexity.

If the application later introduced features such as:

- registration
- profile editing
- complex validations

a form library would likely become beneficial.

---

# UI & Styling

The interface uses:

- Tailwind CSS
- shadcn/ui components

These tools provide accessible and composable UI primitives while keeping styling predictable and maintainable.

---

# Testing

Unit tests are implemented using:

- Vitest
- React Testing Library

Tests focus on:

- UI components responsible for rendering posts
- validation schemas used by API routes
- utility helpers

This approach prioritizes testing **core application logic** while avoiding excessive test complexity for a small project.

End-to-end testing is outside the scope of the challenge but would typically be implemented using **Playwright** in a production environment.

---

# Code Quality

ESLint, Prettier, and Husky are configured to enforce consistent code style.

A pre-commit hook runs `lint-staged`, which automatically lints and formats only the staged files before each commit:

- `.ts/.tsx/.js/.jsx` — ESLint fix + Prettier
- `.json/.md/.css` — Prettier only

`prettier-plugin-tailwindcss` is included to enforce consistent Tailwind class ordering.

---

# Tradeoffs

Some decisions were intentionally simplified due to the scope of the challenge:

- SQLite instead of a production database such as PostgreSQL
- Pagination omitted due to the small dataset
- Credentials-based authentication instead of OAuth providers
- No rate limiting or advanced security protections

These areas would likely evolve in a production environment.
