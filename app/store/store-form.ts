import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultStartDate = new Date(new Date().getFullYear(), 0, 1);

// Define your state type here
export type FormStateType = {
  appName: string;
  totalBiaya: string;
  participants: {
    value: string;
    label: string;
  }[]; // replace 'any' with the actual type of the participants
  startDate: Date | undefined;
  setForm: (state: Partial<FormStateType>) => void;
  saveForm: () => void;
  resetForm: () => void;
};

export type ComparableFormStateType = Pick<
  FormStateType,
  "appName" | "totalBiaya" | "participants" | "startDate"
>;

export const useEditableForm = create<FormStateType>()(
  persist(
    (set, get) => ({
      appName: "",
      totalBiaya: "",
      participants: [],
      startDate: undefined,
      setForm: (state: Partial<FormStateType>) => set(state),
      saveForm: () => {
        useSavedForm.setState({
          appName: get().appName,
          totalBiaya: get().totalBiaya,
          participants: get().participants,
          startDate: get().startDate,
        });
      },
      resetForm: () => {
        set({
          appName: useSavedForm.getState().appName,
          totalBiaya: useSavedForm.getState().totalBiaya,
          startDate: useSavedForm.getState().startDate,
          participants: useSavedForm.getState().participants,
        });
      },
    }),
    {
      name: "editable-form",
      skipHydration: true,
    }
  )
);

export const useSavedForm = create<
  Omit<FormStateType, "saveForm" | "isChanged" | "resetForm">
>()(
  persist(
    (set, get) => ({
      appName: "",
      totalBiaya: "",
      participants: [],
      startDate: undefined,
      setForm: (state: Partial<FormStateType>) => set(state),
    }),
    {
      name: "saved-form",
    }
  )
);
