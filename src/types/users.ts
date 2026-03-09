import type { User } from "@/generated/prisma/client";

export type UserRole = "user" | "admin";

export type UserWithoutPassword = Omit<User, "password">;
