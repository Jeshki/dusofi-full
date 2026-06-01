import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "lt", "fr", "de", "es", "it"],
  defaultLocale: "en",
  localePrefix: "always",
});
