import { useSession } from "next-auth/react";

export function useLoggedInUser() {
  const { data: session, status } = useSession();

  const user = session?.user ? { ...session.user, id: Number(session.user.id) } : null;

  return { user, status };
}
