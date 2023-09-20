import type { LoaderArgs } from "@remix-run/cloudflare";

export let loader = ({ request, params, context }: LoaderArgs) => {
  return context.auth?.authenticator.authenticate(
    params.provider as "google",
    request,
    {
      successRedirect: "/",
      failureRedirect: "/login",
    }
  );
};
