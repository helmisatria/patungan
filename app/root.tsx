import type { LinksFunction, LoaderArgs } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import styles from "./tailwind.css";
import { Toaster } from "react-hot-toast";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];
export async function loader({ context }: LoaderArgs) {
  return {
    ENV: {
      TELEGRAM_CALLBACK_URL: context.env.TELEGRAM_CALLBACK_URL,
    },
  };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <Meta />
        <Links />
      </head>

      <body className="bg-neutral-50">
        <Toaster />
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
