import type { UserRole } from "@/types";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      role: UserRole;
    };
  }

  interface User {
    username?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number;
    username: string;
    role: UserRole;
  }
}
