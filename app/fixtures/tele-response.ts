export type WidenLiteral<T> = T extends string | number | boolean
  ? ReturnType<T["valueOf"]>
  : T;

export const teleObjectResponse = {
  update_id: 400319324,
  message: {
    message_id: 10,
    from: {
      id: 999,
      is_bot: false,
      first_name: "Helmi Satria",
      username: "helmisatria",
      language_code: "en",
    },
    chat: {
      id: 999,
      first_name: "Helmi Satria",
      username: "helmisatria",
      type: "private",
    },
    date: 1695221890,
    text: "haloooo",
  },
};

export type TeleResponse = WidenLiteral<typeof teleObjectResponse>;
