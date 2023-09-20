// app/services/session.server.ts
import type { AppLoadContext } from "@remix-run/cloudflare";
import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import type { GoogleProfile } from "remix-auth-socials";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";

export const createAuthenticator = (context: AppLoadContext) => {
  const env = context.env as Record<string, string>;

  // export the whole sessionStorage object
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session", // use any name you want here
      sameSite: "lax", // this helps with CSRF
      path: "/", // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: [env.SESSION_SECRET], // replace this with an actual secret
      secure: env.NODE_ENV === "production", // enable this in prod only
    },
  });

  const { getSession, commitSession, destroySession } = sessionStorage;

  const authenticator = new Authenticator<GoogleProfile>(sessionStorage);

  const getCallback = (provider: SocialsProvider) => {
    return `http://localhost:8788/auth/${provider}/callback`;
  };

  authenticator.use(
    new GoogleStrategy(
      {
        clientID:
          "800855370024-36srf4ad1njds68maj627dpjdd1btloj.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: getCallback(SocialsProvider.GOOGLE),
      },
      async ({ profile }) => {
        // here you would find or create a user in your database
        console.log("profile -->", profile);
        return profile;
      }
    )
  );

  return {
    authenticator,
    getSession,
    commitSession,
    destroySession,
  };
};

// you can also export the methods individually for your own usage
