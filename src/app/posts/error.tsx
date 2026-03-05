"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  reset: () => void;
};

export default function PostsError({ reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <div className="flex h-13 w-13 items-center justify-center rounded-[12px] bg-[#FEF2F2]">
        <AlertCircle className="text-destructive h-6 w-6" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-foreground text-[17px] font-bold tracking-[-0.02em]">
          Something went wrong
        </p>
        <p className="text-muted-foreground max-w-65 text-[14px] leading-5.25">
          We couldn&apos;t load the posts. Check your connection and try again.
        </p>
      </div>
      <Button variant="outline" className="h-9 rounded-lg border-[#E5E3DC] px-4.5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
