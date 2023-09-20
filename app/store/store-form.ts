import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const defaultStartDate = new Date(new Date().getFullYear(), 0, 1);

// Define your state type here
export type FormStateType = {
  appName: string;
  totalMonthlyPrice: string;
  participants: {
    value: string;
    label: string;
    logs?: (1 | 0)[];
  }[]; // replace 'any' with the actual type of the participants
  startDate: Date | undefined;
  setForm: (state: Partial<FormStateType>) => void;
};

export type SubmitFormType = {
  appName: string;
  totalMonthlyPrice?: string;
  participants: {
    value: string;
    label: string;
    logs?: (1 | 0)[];
  }[]; // replace 'any' with the actual type of the participants
  startDate: Date | string | undefined;
};

export type ComparableFormStateType = Pick<
  FormStateType,
  "appName" | "totalMonthlyPrice" | "participants" | "startDate"
>;

export const isAllValid = (form: FormStateType | ComparableFormStateType) => {
  return !!(
    form.appName &&
    form.totalMonthlyPrice &&
    form.participants.length > 0 &&
    form.participants.every((p) => p.value && p.label) &&
    form.startDate
  );
};

export const useEditableForm = create<FormStateType>()(
  devtools(
    immer((set, get) => ({
      appName: "",
      totalMonthlyPrice: "",
      participants: [],
      startDate: undefined,
      setForm: (state: Partial<FormStateType>) => set(state),
    }))
  )
);
