import { useLoaderData, useMatches } from "@remix-run/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useHydrated } from "remix-utils";
import type { LoaderData } from "~/routes/_index";
import { useFormValid } from "../hooks/useFormValid";
import { InfoIcon } from "lucide-react";
import { TelegramIcon } from "../icons/telegram";
import { useParentData } from "../hooks/useParenDate";

declare global {
  interface Window {
    onTelegramAuth: any;
  }
}

export function ConnectTelegram() {
  const hydrated = useHydrated();
  const { user } = useLoaderData() as LoaderData;

  const { ENV } = useParentData("/") as {
    ENV: { TELEGRAM_CALLBACK_URL: string };
  };

  const { isFormValid } = useFormValid();

  useEffect(() => {
    if (!hydrated || !isFormValid) return;

    // create script element
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.dataset.telegramLogin = "patunganbot";
    script.dataset.size = "large";
    script.dataset.userpic = "false";
    script.dataset.authUrl = ENV.TELEGRAM_CALLBACK_URL;
    script.dataset.requestAccess = "write";

    // append script to body
    document.getElementById("telegram-login")?.appendChild(script);

    // remove script on component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isFormValid]); // running once after initial component render

  function warnFillingForm() {
    toast.error("Form nya dilengkapi dulu ya!", {
      icon: <InfoIcon className="w-6 h-6 fill-yellow-500" />,
    });
  }

  return !user ? (
    <section className="px-6 mb-8 mx-auto max-w-2xl py-6" id="connect-telegram">
      <div className="p-5 rounded-md bg-cyan-50 border border-cyan-400">
        <div className="h-8 w-8 mb-2 -mt-9 -ml-8 rounded bg-white">
          <TelegramIcon />
        </div>
        <h2 className="text-xl font-semibold">Next, connect to Telegram</h2>
        <p className="mt-1 text-sm text-cyan-800">
          Biar bisa diingetin tiap bulan di telegram
        </p>

        {hydrated && isFormValid && (
          <div className="mt-3" id="telegram-login"></div>
        )}

        {!isFormValid && (
          <button
            onClick={warnFillingForm}
            className="inline-flex w-full justify-center items-center mt-4 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Simpan & sambungin ke Telegram
          </button>
        )}
      </div>
    </section>
  ) : (
    <></>
  );
}
