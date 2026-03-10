import { PrismaClient } from "@/generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Prisma resolves relative `file:` SQLite URLs from an internal location that
// varies between CLI and runtime (Turbopack). Convert to an absolute path so
// resolution is unambiguous regardless of how or where the engine runs.
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");

  if (url.startsWith("file:") && !url.startsWith("file:/")) {
    const relativePath = url.replace(/^file:/, "");
    // Prisma CLI resolves SQLite paths relative to schema.prisma (prisma/).
    // Replicate that here so the runtime connects to the same file.
    return `file:${path.resolve(process.cwd(), "prisma", relativePath)}`;
  }

  return url;
}

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ datasourceUrl: getDatabaseUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
