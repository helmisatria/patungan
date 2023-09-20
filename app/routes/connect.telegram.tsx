import { SHA256, HmacSHA256, enc } from "crypto-js";
import { redirect, type LoaderArgs, createCookie } from "@remix-run/cloudflare";
import type { AppContext } from "server";
import { sendMessage } from "~/lib/telegram-helpers";

async function checkTelegramAuthorization(context: AppContext, data: any) {
  const hash = data.hash;
  delete data.hash;
  const dataCheckArr = Object.keys(data)
    .map((k) => `${k}=${data[k]}`)
    .sort();
  const dataCheckString = dataCheckArr.join("\n");
  const secretKey = SHA256(context.env.BOT_TOKEN);
  const hmac = HmacSHA256(dataCheckString, secretKey).toString(enc.Hex);

  if (hmac !== hash) {
    throw new Error("Data is NOT from Telegram");
  }

  if (Date.now() / 1000 - data.auth_date > 86400) {
    throw new Error("Data is outdated");
  }

  await sendMessage(context, data.id, "You are connected to Patungan!");

  return data;
}

export async function loader({ request, context }: LoaderArgs) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  try {
    const authData = await checkTelegramAuthorization(context, params);
    const cookie = createCookie("tg_user");

    return redirect("/?telegram-connected=1", {
      headers: {
        "Set-Cookie": await cookie.serialize(authData, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        }),
      },
    });
  } catch (e) {
    return redirect("/");
  }
}

export default function ConnectTelegram() {
  return <div></div>;
}
