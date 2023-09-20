import { produce } from "immer";
import Creatable from "react-select/creatable";

export type SelectParticipantsProps = {
  editableSubscription: {
    appName: string;
    totalMonthlyPrice: string;
    startDate: Date;
    participants: any;
  };
  setEditableSubscription: (draft: any) => void;
};

export function SelectParticipants({
  editableSubscription,
  setEditableSubscription,
}: SelectParticipantsProps) {
  return (
    <Creatable
      placeholder="Isi nama yang ikut patungan disini"
      value={editableSubscription.participants}
      classNames={{
        control: () =>
          `!border-input focus-visible:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
      }}
      onChange={(values) => {
        setEditableSubscription(
          produce((draft) => {
            // @ts-ignore
            draft.participants = values;
          })
        );
      }}
      styles={{
        valueContainer: (provided) => ({
          ...provided,
          paddingLeft: "1rem",
        }),
      }}
      noOptionsMessage={() => "Kamu bisa menambahkan orang baru"}
      closeMenuOnSelect={false}
      isMulti
    />
  );
}
