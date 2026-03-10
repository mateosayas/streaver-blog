import { useLoggedInUser } from "@/hooks/use-logged-in-user";
import type { UserPost } from "@/types/posts";

export function useCanDeletePost() {
  const { user } = useLoggedInUser();

  return (post: UserPost): boolean => {
    if (!user) return false;
    if (user.role === "admin") return true;

    return post.userId === user.id;
  };
}
