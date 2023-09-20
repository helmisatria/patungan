import { Form } from "@remix-run/react";

import { redirect, type LoaderArgs } from "@remix-run/cloudflare";
export async function loader({ context, request }: LoaderArgs) {
  const { auth } = context;
  const user = await auth.authenticator.isAuthenticated(request);

  if (user) {
    return redirect("/");
  }

  return {};
}

export default function Login() {
  return (
    <Form action="/auth/google" method="post">
      <button>Login with Google</button>
    </Form>
  );
}
