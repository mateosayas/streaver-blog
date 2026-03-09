"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="h-8 w-24 rounded" />;
  }

  if (!session) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm">
        {session.user.name}
        {session.user.role === "admin" && (
          <span className="bg-primary/10 text-primary ml-1.5 rounded px-1.5 py-0.5 text-xs font-medium">
            Admin
          </span>
        )}
      </span>
      <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/posts" })}>
        Sign out
      </Button>
    </div>
  );
}
