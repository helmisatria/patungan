import { createCookie, json, redirect } from "@remix-run/cloudflare";
import type {
  V2_MetaFunction,
  LoaderArgs,
  ActionArgs,
} from "@remix-run/cloudflare";
import { ConnectTelegram } from "~/components/app/ConnectTelegram";

import { MainForm } from "~/components/app/MainForm";

import { getDbFromContext } from "~/db/db";
import type { SubscriptionType, UserSchema } from "~/db/schema";
import { subscriptions } from "~/db/schema";

import type { ComparableFormStateType } from "~/store/store-form";
import { SchemaFormType } from "~/lib/types";
import { eq } from "drizzle-orm";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Patungan" },
    { name: "description", content: "Welcome to Patungan App!" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon.png",
    },
  ];
};

export type LoaderData = {
  user?: UserSchema;
  subscription?: typeof SubscriptionType;
};

export async function loader({ request, context }: LoaderArgs) {
  const cookie = createCookie("tg_user");
  const user = (await cookie.parse(
    request.headers.get("Cookie") || ""
  )) as UserSchema;

  if (user) {
    const db = getDbFromContext(context);
    const subscriptionData = await db
      .select()
      .from(subscriptions)
      .limit(1)
      .where(eq(subscriptions.ownedByTelegramUsername, user.username));

    if (subscriptionData.length) {
      return redirect("/subs/" + subscriptionData[0].id);
    } else {
      return json({});
    }
  }

  return json({
    user: (await cookie.parse(
      request.headers.get("Cookie") || ""
    )) as UserSchema,
  });
}

export async function action({ request, context }: ActionArgs) {
  const formData = await request.formData();
  const cookie = createCookie("tg_user");
  const user = (await cookie.parse(
    request.headers.get("Cookie") || ""
  )) as UserSchema;

  let { ...data } = Object.fromEntries(
    formData.entries()
  ) as unknown as ComparableFormStateType;

  const db = getDbFromContext(context);

  if (JSON.parse(data.participants as unknown as string).length === 0) {
    return json({
      error: "INVALID_FORM_DATA" as const,
      data,
    });
  }

  const parsedForm = SchemaFormType.safeParse(data);

  if (!parsedForm.success) {
    return json({
      error: "INVALID_FORM_DATA" as const,
      data,
    });
  }

  if (!user) {
    return json({
      error: null,
    });
  }

  const subscriptionData = await db
    .insert(subscriptions)
    .values({
      name: parsedForm.data.appName,
      monthlyPrice: parsedForm.data.totalMonthlyCost,
      participants: data.participants,
      ownedByEmail: "",
      ownedByTelegramUsername: user.username,
      activatedAt: parsedForm.data.startDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  return json({
    error: null,
    data: {
      subscription: subscriptionData[0],
    },
  });
}

export default function Index() {
  return (
    <>
      <MainForm />
      <ConnectTelegram />
    </>
  );
}
