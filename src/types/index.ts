import type { Post, User } from "@/generated/prisma/client";

export type PostWithUser = Post & {
  user: User;
};

// Re-export API response types for client-side use
export type { ApiSuccessResponse, ApiErrorResponse, ApiResponse } from "@/lib/api/types";
