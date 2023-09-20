import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { createAuthenticator } from "~/services/session.server";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export type AppContext = {
  env: Record<string, string>;
  auth: ReturnType<typeof createAuthenticator>;
};

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    return {
      env: context.env,
      auth: createAuthenticator(context),
    };
  },
  mode: process.env.NODE_ENV,
});
