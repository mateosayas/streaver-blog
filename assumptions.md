# Assumptions

## Authentication
- No authentication is implemented. The challenge describes "users of the application" as readers/consumers who list, filter, and delete posts. There is no mention of login, registration, or user-specific permissions. Adding auth would exceed the scope of the challenge.

## Database
- Plain SQLite with Prisma ORM as suggested by the challenge.
- The `.env` file is committed to the repository intentionally per the challenge instructions to simplify local setup. In a production environment, this would be in `.gitignore` and managed via environment variables.
- For a production deployment, SQLite should be swapped for a hosted solution like Turso (SQLite-compatible) or PostgreSQL.

## Data
- Seed data comes from JSONPlaceholder API (10 users, 100 posts).
- The seed script is idempotent — safe to run multiple times.

## Data fetching strategy
- TanStack Query was considered but not included. The application's read path (/posts) is fully server-rendered via Server Components and the Data Access Layer, eliminating the need for client-side caching or background refetching. The single mutation (delete) is handled with optimistic local state and router.refresh() for server sync. For a more complex application with client-side reads, polling, or multiple interdependent mutations, TanStack Query would be the natural addition.

## Post Deletion
- Soft delete is implemented using a `deletedAt` timestamp. Posts are never permanently removed from the database. This is safer, supports potential undo/restore features, and is more production-realistic. Deleted posts are filtered out of all GET queries.

## Pagination
- Not implemented. The dataset is 100 posts, which is manageable without pagination. For a larger dataset, offset-based or cursor-based pagination would be added to the posts page.

## Offline UX
- The challenge mentions users with bad or unstable internet connections. This is addressed with:
  - Optimistic UI updates for deletion (instant visual feedback)
  - Error recovery with retry actions when requests fail
  - Offline detection banner to set user expectations
  - Disabled destructive actions when offline

## API Design
- API routes are versioned under `/api/v1/` for future extensibility.
- All responses follow a standardized envelope pattern for predictable client-side consumption.
- Input validation uses Zod at every API boundary.

## UI & Styling
- Tailwind CSS with shadcn/ui components for accessible, customizable primitives.
- Mobile-first responsive design.

## Testing
- Vitest with React Testing Library for unit testing of key components and utility functions.
- E2E testing is out of scope but would be the next step (Playwright recommended).
