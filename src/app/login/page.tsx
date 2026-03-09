import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/posts");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-card border-border w-full max-w-md rounded-xl border p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-foreground text-[22px] font-extrabold tracking-[-0.04em]">Sign in</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter your credentials to access the blog.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
