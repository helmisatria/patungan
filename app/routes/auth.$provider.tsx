import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

export let loader = () => redirect("/login");

export let action = ({ request, params, context }: ActionArgs) => {
  return context.auth.authenticator.authenticate(
    params.provider as "google",
    request
  );
};
