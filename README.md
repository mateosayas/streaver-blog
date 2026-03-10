# Streaver Blog

A small Next.js application that lists blog posts, allows filtering by author, and supports post deletion with optimistic UI updates.

The application is designed with users in mind who may experience unstable or slow internet connections, prioritizing responsive UI feedback and clear error handling.

---

# Challenge Requirements

The original challenge required implementing:

- Listing blog posts
- Filtering posts by author
- Deleting posts

---

# Additional Features Implemented

Beyond the required scope, several improvements were added:

- Authentication and authorization
- Optimistic UI updates for destructive actions
- Offline UX improvements
- HTTP security headers
- Structured API response format
- Database persistence using Prisma + SQLite

These additions aim to demonstrate architectural thinking and real-world production patterns.

---

# Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **URL State:** nuqs
- **Testing:** Vitest + React Testing Library
- **Authentication:** NextAuth (Credentials provider)

---

# Architecture Overview

The application follows a layered structure that separates UI, server logic, and database access.

### Data Access Layer

All database operations live in:

src/lib/data/

Server Components call DAL functions directly during server rendering, while API Route Handlers reuse the same functions for mutations.

This isolates Prisma from UI components and centralizes database logic.

---

### Mutations

Post deletion is implemented via a REST endpoint:

DELETE /api/v1/posts/:id

The UI performs an **optimistic update**:

1. The post is immediately removed from the UI
2. The DELETE request runs in the background
3. If the request fails, the previous state is restored
4. On success, `router.refresh()` synchronizes the UI with the server

---

### URL State

Filtering by `userId` is stored in the URL query string using **nuqs**.

This enables:

- shareable filtered URLs
- persistence across refreshes
- predictable browser navigation behavior

---

# API Overview

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| DELETE | /api/v1/posts/:id | Soft deletes a post |

All responses follow a consistent envelope format:

```
{ success: true, data }
{ success: false, error: { code, message } }
```

Input validation is performed using Zod before database operations occur.

---

# Project Structure

```
├── prisma/           Schema, migrations, and seed script
├── public/           Static assets
├── __tests__/        Unit and integration tests
└── src/
    ├── app/          Next.js routes and layouts
    ├── components/   Reusable UI components
    ├── hooks/        Custom React hooks
    ├── lib/
    │   ├── api/      API response helpers
    │   ├── auth/     Authentication utilities
    │   ├── data/     Data access layer (Prisma queries)
    │   └── validations/  Zod schemas
    ├── types/        Shared TypeScript types
    └── utils/        Utility helpers
```

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

The challenge requires that the repository include the environment variables needed to run locally.

For this reason, the `.env` file is committed intentionally to simplify setup.

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

# Test Credentials

| Role    | Username  | Password    |
| ------- | --------- | ----------- |
| Admin   | admin     | admin       |
| Regular | Bret      | password123 |
| Regular | Antonette | password123 |
| Regular | Samantha  | password123 |

Permissions:

- **Admin:** can delete any post
- **Regular users:** can delete their own posts
- **Unauthenticated users:** can browse posts but cannot delete

---

# Development

```bash
npm run dev
```

Open:

http://localhost:3000/posts

---

# Testing

Tests are implemented using **Vitest** and **React Testing Library**.

Run tests in watch mode:

```bash
npm test
```

Run once:

```bash
npx vitest run
```

### What is tested

The test suite focuses on core application behavior:

- UI components responsible for rendering posts
- Validation schemas used by API routes
- Utility helpers used across the application

Integration and end-to-end testing are outside the scope of the challenge but would typically be implemented using Playwright in a production environment.

---

# Production Build

```bash
npm run build
npm start
```

---

# How to Review This Project

Suggested review order:

1. Start the application and visit `/posts`
2. Test filtering by author
3. Log in using the test credentials
4. Delete a post and observe the optimistic UI update
5. Review the API route `/api/v1/posts/[id]`
6. Review the Data Access Layer in `src/lib/data`

---

# Additional Notes

See `assumptions.md` for detailed design decisions, tradeoffs, and implementation considerations.
