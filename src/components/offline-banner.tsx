"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 text-[13px] text-amber-800 shadow-sm transition-transform duration-300 ${
        isOnline ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      You appear to be offline. Some features may be unavailable.
    </div>
  );
}
