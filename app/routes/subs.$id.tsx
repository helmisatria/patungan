import { MainForm } from "~/components/app/MainForm";
import ConnectTelegram from "./connect.telegram";
import type { LoaderArgs } from "@remix-run/cloudflare";
import { createCookie, redirect } from "@remix-run/cloudflare";
import { getDbFromContext } from "~/db/db";
import type { UserSchema } from "~/db/schema";
import { subscriptions } from "~/db/schema";
import { and, eq } from "drizzle-orm";

export async function loader({ request, context, params }: LoaderArgs) {
  const cookie = createCookie("tg_user");
  const user = (await cookie.parse(
    request.headers.get("Cookie") || ""
  )) as UserSchema;

  if (!user) {
    return redirect("/");
  }

  const db = getDbFromContext(context);
  const subscriptionData = await db
    .select()
    .from(subscriptions)
    .limit(1)
    .where(
      and(
        eq(subscriptions.id, String(params.id)),
        eq(subscriptions.ownedByTelegramUsername, user.username)
      )
    );

  if (!subscriptionData.length) {
    return redirect("/");
  }

  return {
    user,
    subscription: subscriptionData[0],
  };
}

export default function SubscriptionDetail() {
  return (
    <>
      <MainForm />
      <ConnectTelegram />
    </>
  );
}
