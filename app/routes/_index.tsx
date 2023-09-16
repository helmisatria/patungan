import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { CalendarIcon, DollarSign } from "lucide-react";
import { Suspense, useEffect, useState, useTransition } from "react";

import Creatable, { useCreatable } from "react-select/creatable";
import { useLocalStorage } from "react-use";
import { DatePicker } from "~/components/ui/date-picker";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Patungan" },
    { name: "description", content: "Welcome to Patungan App!" },
  ];
};

export default function Index() {
  const [date, setDate] = useState<Date>();

  const [formValues, setFormValues] = useLocalStorage("patungan", {
    appName: "",
    totalBiaya: "",
    participants: [],
    date: undefined,
  } as Record<string, any>);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setFormValues({
      ...formValues,
      date: date,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    setDate(new Date(formValues?.date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
          <Label className="pb-3" htmlFor="total-biaya">
            Aktif dari
          </Label>
          <DatePicker date={date} setDate={setDate} />
        </div>

        <div className="flex flex-col">
          <Label className="pb-3" htmlFor="participants">
            Participants
          </Label>
          <Suspense>
            <Creatable
              defaultValue={formValues?.participants}
              classNames={{
                control: () =>
                  `!border-input focus-visible:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
              }}
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  participants: e,
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
              options={options}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
