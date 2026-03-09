import { useSession } from "next-auth/react";
import type { UserPost } from "@/types/posts";

export function useCanDeletePost() {
  const { data: session } = useSession();

  return (post: UserPost): boolean => {
    if (!session?.user) return false;
    if (session.user.role === "admin") return true;

    return post.userId === Number(session.user.id);
  };
}
