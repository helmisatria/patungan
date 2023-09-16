import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { DollarSign } from "lucide-react";
import { useEffect } from "react";

import Creatable from "react-select/creatable";
import { ClientOnly } from "remix-utils";
import ParticipantsCheckBoxes from "~/components/app/Participants";
import { DatePicker } from "~/components/ui/date-picker";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { FormStateType } from "~/store/store";
import { useFormStore } from "~/store/store";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Patungan" },
    { name: "description", content: "Welcome to Patungan App!" },
  ];
};

export default function Index() {
  const { setForm, ...formValues } = useFormStore();

  const onChangeDate = (date: Date) => {
    setForm({ date: date });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ [e.target.name]: e.target.value });
  };

  useEffect(() => {
    useFormStore.persist.rehydrate();
  }, []);

  return (
    <>
      <main className="flex px-6 flex-col pt-8 max-w-2xl mx-auto space-y-4">
        <header className="pb-4">
          <h1 className="text-2xl font-bold">Patungan!</h1>
        </header>

        <div className="flex flex-col">
          <Label className="pb-3" htmlFor="app-name">
            Nama aplikasi
          </Label>
          <Input
            onChange={handleChange}
            type="text"
            name="appName"
            id="app-name"
            className="input"
            value={formValues?.appName}
          />
        </div>

        <div className="flex flex-col">
          <Label className="pb-3" htmlFor="total-biaya">
            Biaya per bulan
          </Label>
          <Input
            leftIcon={
              <DollarSign
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            }
            value={formValues?.totalBiaya}
            onChange={(e) => {
              e.target.value = e.target.value
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              handleChange(e);
            }}
            name="totalBiaya"
            type="text"
            id="total-biaya"
            className="input"
          />
        </div>

        <div className="flex flex-col">
          <Label className="pb-3" htmlFor="active-from-date">
            Aktif dari
          </Label>
          <DatePicker
            date={formValues.date ? new Date(formValues.date) : undefined}
            setDate={onChangeDate}
          />
        </div>

        <div className="flex flex-col">
          <Label className="pb-3" htmlFor="participants">
            Participants
          </Label>
          <ClientOnly
            fallback={
              <div className="block h-[38px] w-full border border-input rounded"></div>
            }
          >
            {() => (
              <>
                <Creatable
                  defaultValue={formValues?.participants}
                  placeholder="Isi nama yang ikut patungan disini"
                  classNames={{
                    control: () =>
                      `!border-input focus-visible:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
                  }}
                  onChange={(values) => {
                    setForm({
                      participants: values as FormStateType["participants"],
                    });
                  }}
                  name="participants"
                  styles={{
                    valueContainer: (provided) => ({
                      ...provided,
                      paddingLeft: "1rem",
                    }),
                  }}
                  closeMenuOnSelect={false}
                  isMulti
                />
              </>
            )}
          </ClientOnly>
          <ParticipantsCheckBoxes />
        </div>
      </main>
    </>
  );
}
