import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define your state type here
export type FormStateType = {
  appName: string;
  totalBiaya: string;
  participants: {
    value: string;
    label: string;
  }[]; // replace 'any' with the actual type of the participants
  date: Date | undefined;
  setForm: (state: Partial<FormStateType>) => void;
};

export const useFormStore = create<FormStateType>()(
  persist(
    (set, get) => ({
      appName: "",
      totalBiaya: "",
      participants: [],
      date: undefined,
      setForm: (state: Partial<FormStateType>) => set(state),
    }),
    {
      name: "form",
      skipHydration: true,
    }
  )
);
