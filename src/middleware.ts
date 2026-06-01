import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/** Exclude extensionless metadata routes (`/icon`); `.*\\..*` only skips paths with a dot. */
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*|icon$).*)"],
};
