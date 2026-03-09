import { SiteHeader } from "@/components/layout/site-header";

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-20">{children}</main>
    </>
  );
}
