import type { Post } from "@/generated/prisma/client";
import { UserWithoutPassword } from "@/types/users";

export type UserPost = Post & {
  user: UserWithoutPassword;
};
