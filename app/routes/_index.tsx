import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { isEqual, pick } from "lodash-es";
import { DollarSign, RefreshCwIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Creatable from "react-select/creatable";
import { ClientOnly } from "remix-utils";
import ParticipantsCheckBoxes from "~/components/app/Participants";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { FormStateType } from "~/store/store-form";
import { useEditableForm, useSavedForm } from "~/store/store-form";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Patungan" },
    { name: "description", content: "Welcome to Patungan App!" },
  ];
};

export default function Index() {
  const [isChanged, setIsChanged] = useState(false);
  const { setForm, saveForm, ...formValues } = useEditableForm();
  const { ...savedForm } = useSavedForm();

  const onChangeDate = (date: Date) => {
    setForm({ startDate: date });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ [e.target.name]: e.target.value });
  };

  const updateIsChanged = useCallback(() => {
    const comparableFields = [
      "appName",
      "totalBiaya",
      "startDate",
      "participants",
    ];

    const convertDate = (date: Date) => {
      return new Date(date).toISOString();
    };

    const pickForm = (form: any) => {
      return pick(
        { ...form, startDate: convertDate(form.startDate) },
        comparableFields
      );
    };

    const saved = pickForm(savedForm);
    const edited = pickForm(formValues);

    const isEdited = !isEqual(saved, edited);
    if (useEditableForm.persist.hasHydrated()) setIsChanged(isEdited);
  }, [formValues, savedForm]);

  useEffect(() => {
    updateIsChanged();
  }, [formValues, updateIsChanged]);

  useEffect(() => {
    useEditableForm.persist.rehydrate();
    updateIsChanged();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main className="flex px-6 flex-col pt-8 max-w-2xl mx-auto space-y-4 mb-10">
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
          <span className="text-sm mt-1 text-muted-foreground">
            Nama aplikasi yang kamu gunakan untuk patungan. Contoh: Netflix,
            Spotify, dll.
          </span>
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
            Patungan aktif dari
          </Label>
          <DatePicker
            date={new Date(formValues.startDate)}
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
                  key={formValues?.participants?.length}
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
                  backspaceRemovesValue={false}
                  createOptionPosition="first"
                  noOptionsMessage={() => "Kamu bisa menambahkan orang baru"}
                  closeMenuOnSelect={false}
                  isMulti
                />
              </>
            )}
          </ClientOnly>
          <ParticipantsCheckBoxes />

          <div className="flex space-x-2 items-center mt-6">
            <Button
              onClick={() => {
                saveForm();
                updateIsChanged();
              }}
              variant={isChanged ? "default" : "outline"}
              className="w-full"
              size="xl"
            >
              Simpan
            </Button>
            <Button
              size="icon"
              className="h-14 w-14 px-4"
              variant={isChanged ? "save" : "ghost"}
              onClick={() => {
                useEditableForm.getState().resetForm();
              }}
            >
              <RefreshCwIcon />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
