import type { AppContext } from "server";

export function sendMessage(
  context: AppContext,
  chat_id: number,
  text: string
) {
  return fetch(
    `https://api.telegram.org/bot${context.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: text,
      }),
    }
  );
}
