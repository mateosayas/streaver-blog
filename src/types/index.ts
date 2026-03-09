import type { Post, User } from "@/generated/prisma/client";

export type UserRole = "user" | "admin";

export type SafeUser = Omit<User, "password">;

export type PostWithUser = Post & {
  user: SafeUser;
};

// Re-export API response types for client-side use
export type { ApiSuccessResponse, ApiErrorResponse, ApiResponse } from "@/lib/api/types";
