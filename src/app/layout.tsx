import type { ReactNode } from "react";
import "./globals.css";

type Props = {
  children: ReactNode;
};

// Root layout is required; locale-specific <html>/<body> live under `src/app/[locale]/layout.tsx`.
export default function RootLayout({ children }: Props) {
  return children;
}
