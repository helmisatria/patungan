import { json, redirect } from "@remix-run/cloudflare";
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
import { formCookie, tgCookie } from "~/services/cookies.server";
import { pickBy } from "lodash-es";

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
  form?: {
    appName: string;
    totalMonthlyPrice: number;
    participants: string;
    startDate: string;
  };
};

export async function loader({ request, context }: LoaderArgs) {
  const requestCookie = request.headers.get("Cookie") || "";
  const user = (await tgCookie.parse(requestCookie)) as UserSchema;
  const form = await formCookie.parse(requestCookie);

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
    user,
    form,
  });
}

export async function action({ request, context }: ActionArgs) {
  const formData = await request.formData();
  const user = (await tgCookie.parse(
    request.headers.get("Cookie") || ""
  )) as UserSchema;

  let { ...data } = Object.fromEntries(
    formData.entries()
  ) as unknown as ComparableFormStateType;

  const db = getDbFromContext(context);

  const serializedFormCookie = await formCookie.serialize(pickBy(data));
  const headers = {
    "Set-Cookie": serializedFormCookie,
  };

  if (JSON.parse(data.participants as unknown as string).length === 0) {
    return json(
      {
        error: "INVALID_FORM_DATA" as const,
        data,
      },
      { headers }
    );
  }

  const parsedForm = SchemaFormType.safeParse(data);

  if (!parsedForm.success) {
    return json(
      {
        error: "INVALID_FORM_DATA" as const,
        data,
      },
      { headers }
    );
  }

  if (!user) {
    return json({ error: null }, { headers });
  }

  const createdSubscription = await db
    .select()
    .from(subscriptions)
    .limit(1)
    .where(eq(subscriptions.ownedByTelegramUsername, user.username));

  if (createdSubscription.length) {
    const updatedSubscription = await db
      .update(subscriptions)
      .set({
        name: parsedForm.data.appName,
        monthlyPrice: parsedForm.data.totalMonthlyPrice,
        participants: data.participants,
        activatedAt: parsedForm.data.startDate,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(subscriptions.id, createdSubscription[0].id))
      .returning();

    return json(
      {
        error: null,
        data: { subscription: updatedSubscription[0] },
      },
      { headers }
    );
  }

  const subscriptionData = await db
    .insert(subscriptions)
    .values({
      name: parsedForm.data.appName,
      monthlyPrice: parsedForm.data.totalMonthlyPrice,
      participants: data.participants,
      ownedByEmail: "",
      ownedByTelegramUsername: user.username,
      activatedAt: parsedForm.data.startDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  return json(
    {
      error: null,
      data: { subscription: subscriptionData[0] },
    },
    { headers }
  );
}

export default function Index() {
  return (
    <>
      <MainForm />
      <ConnectTelegram />
    </>
  );
}
