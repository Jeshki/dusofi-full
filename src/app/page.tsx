import { redirect } from "next/navigation";

import { routing } from "@/i18n/routing";

/** Root `/` redirects to the default locale (middleware also negotiates; this keeps the route explicit). */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
