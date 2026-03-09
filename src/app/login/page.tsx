import { Playfair_Display } from "next/font/google";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-playfair",
});

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/posts");
  }

  return (
    <main className={`${playfair.variable} flex min-h-screen flex-col lg:flex-row`}>
      {/* Left panel — dark editorial */}
      <div className="relative flex h-70 shrink-0 flex-col overflow-hidden bg-[#1A1A2E] p-7 lg:h-screen lg:w-170 lg:p-16">
        {/* Ghost letter */}
        <span className="pointer-events-none absolute -right-4 -bottom-10 [font-family:var(--font-playfair)] text-[200px] leading-none font-black text-white/3 select-none lg:text-[360px]">
          S
        </span>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/secondary_logo.webp"
            alt="Streaver Blog"
            width={28}
            height={28}
            className="shrink-0"
          />
          <span className="text-[14px] font-extrabold tracking-[-0.02em] text-[#F2F1EC] lg:text-[16px]">
            Streaver Blog
          </span>
        </div>

        {/* Hero copy */}
        <div className="mt-auto flex flex-col">
          <span className="mb-3 text-[10px] font-semibold tracking-[0.14em] text-[#C8954A] uppercase lg:mb-6 lg:text-[11px]">
            Members only
          </span>
          <h2 className="[font-family:var(--font-playfair)] text-[38px] leading-[1.02] font-black tracking-[-0.03em] text-[#F2F1EC] lg:text-[72px]">
            Ideas worth
            <br />
            reading.
          </h2>
          <div className="mt-5 h-0.75 w-8 bg-[#C8954A] lg:mt-8 lg:w-12" />
          <p className="mt-6 hidden max-w-xs text-[15px] leading-relaxed text-[#F2F1EC]/55 lg:block">
            Sign in to manage and curate posts from the community of writers.
          </p>
        </div>

        {/* Pull quote — desktop only */}
        <div className="mt-auto hidden flex-col pt-10 lg:flex">
          <p className="[font-family:var(--font-playfair)] text-[22px] leading-[1.55] text-[#F2F1EC]/38 italic">
            &ldquo;Writing is the painting of the voice.&rdquo;
          </p>
          <span className="mt-3.5 text-[11px] font-semibold tracking-[0.08em] text-[#C8954A]/65 uppercase">
            Voltaire
          </span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-7 py-14 lg:px-20">
        <div className="w-full max-w-90">
          <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#1A1A2E] lg:text-[26px]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#8A8880]">Enter your credentials to continue.</p>
          <div className="mt-9">
            <LoginForm />
          </div>
        </div>
        <p className="absolute bottom-8 text-[12px] text-[#B8B5AE]">© 2026 Streaver Blog</p>
      </div>
    </main>
  );
}
