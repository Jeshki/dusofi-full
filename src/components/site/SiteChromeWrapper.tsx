"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import AppChrome from "@/components/site/AppChrome.jsx";
import { PhilosopherUiProvider } from "@/context/PhilosopherUiContext";

function NextUrlSyncedProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  return (
    <PhilosopherUiProvider pathname={pathname} search={search}>
      <AppChrome>{children}</AppChrome>
    </PhilosopherUiProvider>
  );
}

export default function SiteChromeWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <NextUrlSyncedProvider>{children}</NextUrlSyncedProvider>
    </Suspense>
  );
}
