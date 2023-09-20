import { redirect, type LoaderArgs } from "@remix-run/cloudflare";
export async function loader({ request, context }: LoaderArgs) {
  return redirect("/", {
    headers: {
      "Set-Cookie":
        "tg_user=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax",
    },
  });
}

export default function Logout() {
  return <div></div>;
}
