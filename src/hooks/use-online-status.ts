"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnlineStatus(): { isOnline: boolean } {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // client snapshot
    () => true // server snapshot — avoids hydration mismatch
  );

  return { isOnline };
}
