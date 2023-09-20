import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const defaultStartDate = new Date(new Date().getFullYear(), 0, 1);

// Define your state type here
export type FormStateType = {
  appName: string;
  totalMonthlyCost: string;
  participants: {
    value: string;
    label: string;
    logs?: (1 | 0)[];
  }[]; // replace 'any' with the actual type of the participants
  startDate: Date | undefined;
  setForm: (state: Partial<FormStateType>) => void;
  saveForm: () => void;
  resetForm: () => void;
  updateLogParticipant: (
    participantName: string,
    monthIndex: number,
    value: 1 | 0
  ) => void;
};

export type ComparableFormStateType = Pick<
  FormStateType,
  "appName" | "totalMonthlyCost" | "participants" | "startDate"
>;

export const isAllValid = (form: FormStateType | ComparableFormStateType) => {
  return !!(
    form.appName &&
    form.totalMonthlyCost &&
    form.participants.length > 0 &&
    form.participants.every((p) => p.value && p.label) &&
    form.startDate
  );
};

export const useEditableForm = create<FormStateType>()(
  devtools(
    immer(
      persist(
        (set, get) => ({
          appName: "",
          totalMonthlyCost: "",
          participants: [],
          startDate: undefined,
          setForm: (state: Partial<FormStateType>) => set(state),
          saveForm: () => {
            useSavedForm.setState({
              appName: get().appName,
              totalMonthlyCost: get().totalMonthlyCost,
              participants: get().participants,
              startDate: get().startDate,
            });
          },
          resetForm: () => {
            set({
              appName: useSavedForm.getState().appName,
              totalMonthlyCost: useSavedForm.getState().totalMonthlyCost,
              startDate: useSavedForm.getState().startDate,
              participants: useSavedForm.getState().participants,
            });
          },
          updateLogParticipant: (
            participantName: string,
            monthIndex: number,
            value: 1 | 0
          ) =>
            set((state) => {
              const participantIndex = state.participants.findIndex(
                (p: FormStateType["participants"][0]) =>
                  p.value === participantName
              );

              if (!state.participants[participantIndex].logs) {
                state.participants[participantIndex].logs = new Array(12).fill(
                  0
                );
              }

              state.participants[participantIndex].logs![monthIndex] = value;
            }),
        }),
        {
          name: "editable-form",
          skipHydration: true,
        }
      )
    )
  )
);

export const useSavedForm = create<
  Omit<
    FormStateType,
    "saveForm" | "isChanged" | "resetForm" | "updateLogParticipant"
  >
>()(
  persist(
    (set, get) => ({
      appName: "",
      totalMonthlyCost: "",
      participants: [],
      startDate: undefined,
      setForm: (state: Partial<FormStateType>) => set(state),
      isAllValid: () => {
        const form = get();
        return (
          form.appName &&
          form.totalMonthlyCost &&
          form.participants.length > 0 &&
          form.participants.every((p) => p.value && p.label) &&
          form.startDate
        );
      },
    }),
    { name: "saved-form" }
  )
);
