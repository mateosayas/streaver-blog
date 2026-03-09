"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid username or password");
      return;
    }

    router.push("/posts");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label
          htmlFor="username"
          className="text-[12px] font-medium tracking-[0.02em] text-[#4A4A5A]"
        >
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="Enter your username"
          className="h-11 rounded-lg border-transparent bg-[#ECEAE3] focus-visible:border-[#1A1A2E] focus-visible:ring-[#1A1A2E]/10"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="password"
          className="text-[12px] font-medium tracking-[0.02em] text-[#4A4A5A]"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          className="h-11 rounded-lg border-transparent bg-[#ECEAE3] focus-visible:border-[#1A1A2E] focus-visible:ring-[#1A1A2E]/10"
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-1 h-11.5 w-full rounded-lg bg-[#1A1A2E] text-[14px] font-semibold tracking-[-0.01em] text-[#F2F1EC] hover:bg-[#1A1A2E]/90"
      >
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
