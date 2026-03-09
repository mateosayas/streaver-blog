import Link from "next/link";
import { UserMenu } from "@/components/auth/user-menu";

export function SiteHeader() {
  return (
    <header className="border-border bg-card flex h-16 w-full items-center justify-between border-b px-4 sm:px-8 lg:px-20">
      <Link
        href="/"
        className="text-foreground text-[20px] leading-6 font-extrabold tracking-[-0.03em]"
      >
        Streaver Blog
      </Link>
      <UserMenu />
    </header>
  );
}
