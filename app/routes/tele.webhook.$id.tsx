import type { ActionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";
import type { ParticipantsProps } from "~/components/app/Participants";
import { getDbFromContext } from "~/db/db";
import { subscriptions } from "~/db/schema";
import type { TeleResponse } from "~/fixtures/tele-response";
import { isValidUrl } from "~/lib/helpers";
import { sendMessage } from "~/lib/telegram-helpers";

export async function action({ request, context, params }: ActionArgs) {
  if (params["id"] !== context.env.TELEGRAM_WEBHOOK_ID) {
    return json({});
  }

  const teleResponse = (await request.json()) as TeleResponse;
  const db = getDbFromContext(context);

  const messageText = teleResponse.message.text.trim().split(" ");
  if (messageText[0] === "/reminder") {
    const url = isValidUrl(messageText[1]);

    if (!url) {
      return await sendMessage(
        context,
        teleResponse.message.chat.id,
        "Jangan lupa URL nya. Contoh: /reminder https://patungan.helmisatria.com/subs/j55iv6a9ddivlljrnuy92xou"
      );
    }

    // get the last params from url
    const subscriptionId = url.href.split("/").pop() as string;

    const foundSubscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(
            subscriptions.ownedByTelegramUsername,
            teleResponse.message.from.username
          ),
          eq(subscriptions.id, subscriptionId)
        )
      );

    if (!foundSubscription.length) {
      await sendMessage(context, teleResponse.message.chat.id, "Not found!");
      return {};
    }

    await db.update(subscriptions).set({
      telegramChatId: teleResponse.message.chat.id,
    });

    const participants = JSON.parse(
      foundSubscription[0].participants as string
    ) as ParticipantsProps["participants"];
    const participantNames = participants
      .map((participant) => participant.label)
      .join(", ");

    await sendMessage(
      context,
      teleResponse.message.chat.id,
      `Reminder set! Participants: ${participantNames}`
    );
    return {};
  }

  return json({});
}

export async function loader() {
  return {};
}
