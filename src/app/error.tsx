"use client";

import { AlertCircle } from "lucide-react";
import { StatusMessage } from "@/components/ui/status-message";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: ErrorProps) {
  return (
    <StatusMessage
      icon={<AlertCircle className="text-destructive h-6 w-6" aria-hidden="true" />}
      iconWrapperClassName="bg-destructive/10 flex h-13 w-13 items-center justify-center rounded-[12px]"
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
      action={{ label: "Try again", onClick: reset }}
    />
  );
}
