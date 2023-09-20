import { createCookie } from "@remix-run/cloudflare";

export const formCookie = createCookie("form");
export const tgCookie = createCookie("tg_user");
