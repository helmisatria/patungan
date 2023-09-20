import { Label } from "@radix-ui/react-label";
import {
  useSubmit,
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  useSearchParams,
  useNavigate,
} from "@remix-run/react";
import { pick, isEqual } from "lodash-es";
import { BanknoteIcon, InfoIcon, Loader2, UndoIcon } from "lucide-react";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import Creatable from "react-select/creatable";
import { ClientOnly, useHydrated } from "remix-utils";
import { cleanNumber } from "~/lib/helpers";
import type {
  ComparableFormStateType,
  FormStateType,
} from "~/store/store-form";
import {
  useEditableForm,
  useSavedForm,
  defaultStartDate,
} from "~/store/store-form";
import { DatePicker } from "../ui/date-picker";
import { Input } from "../ui/input";
import ParticipantsCheckBoxes from "./Participants";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useFormValid } from "../hooks/use-form-valid";
import type { LoaderData } from "~/routes/_index";
import { TelegramIcon } from "../icons/telegram";

const comparableFields = [
  "appName",
  "totalMonthlyCost",
  "startDate",
  "participants",
];

export function MainForm() {
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { subscription } = useLoaderData() as unknown as LoaderData;

  const [isChanged, setIsChanged] = useState(false);
  const submit = useSubmit();
  const { setForm, saveForm, resetForm, ...formValues } = useEditableForm();
  const { isFormValid } = useFormValid();
  const loaderData = useLoaderData() as unknown as LoaderData;
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (subscription) {
      useEditableForm.setState({
        appName: subscription.name,
        participants: JSON.parse(subscription.participants as string),
        startDate: new Date(subscription.activatedAt),
        totalMonthlyCost: String(subscription.monthlyPrice),
      });
    }
  }, []);

  const { ...savedForm } = useSavedForm();

  const onChangeDate = (date: Date) => {
    setForm({ startDate: date });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ [e.target.name]: e.target.value });
  };

  const updateIsChanged = useCallback(() => {
    const convertDate = (date: Date) => {
      return new Date(date).toISOString();
    };

    const pickForm = (form: ComparableFormStateType) => {
      return pick(
        { ...form, startDate: convertDate(form.startDate || defaultStartDate) },
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

  useLayoutEffect(() => {
    useEditableForm.persist.rehydrate();

    // set default start date if not exist
    if (
      !useSavedForm.getState().startDate &&
      !useEditableForm.getState().startDate
    ) {
      setForm({ startDate: defaultStartDate });
    }

    updateIsChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const noTotalCostText = (
    <span className="text-neutral-600 text-base font-normal">
      (isi total biaya langganan & anggota)
    </span>
  );

  const totalCostByParticipant = `Rp 
      ${Number(
        cleanNumber(formValues.totalMonthlyCost) /
          formValues.participants.length
      ).toLocaleString("id-ID")}`;

  const displayText = formValues?.participants?.length
    ? formValues.totalMonthlyCost
      ? totalCostByParticipant
      : noTotalCostText
    : noTotalCostText;

  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error === "INVALID_FORM_DATA") {
      const participants = JSON.parse(
        actionData.data.participants as unknown as string
      );

      if (participants.length === 0) {
        toast("Jangan lupa isi nama anggota yang ikut patungan ya!", {
          icon: <InfoIcon className="w-6 h-6 fill-yellow-500" />,
        });
      } else if (!isFormValid) {
        toast("Lengkapi form diatas ya!", {
          icon: <InfoIcon className="w-6 h-6 fill-yellow-500" />,
        });
      }
    } else if (actionData?.error === null) {
      if (!loaderData.user) {
        toast("Data tersimpan,\nbisa connect telegram ya!", {
          icon: <TelegramIcon className="w-5 h-5" />,
        });

        // scrollto #connect-telegram
        const connectTelegram = document.getElementById("connect-telegram");
        if (connectTelegram) {
          connectTelegram.scrollIntoView({
            behavior: "smooth",
          });
        }
      } else {
        toast.success("Data berhasil disimpan!", {
          position: "top-center",
        });
      }
    }

    const isAfterTelegramConnected =
      searchParams.get("telegram-connected") === "1";
    if (actionData?.error === null && isAfterTelegramConnected) {
      navigate(`/subs/${actionData?.data.subscription.id}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    if (searchParams.get("telegram-connected") == "1") {
      // submit Form
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [searchParams, hydrated]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parseFormValues = (form: ComparableFormStateType) => {
      return {
        appName: form.appName,
        totalMonthlyCost: cleanNumber(form.totalMonthlyCost),
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : null,
        participants: JSON.stringify(form.participants),
      };
    };

    const parsedFormValues = parseFormValues(formValues);

    submit(parsedFormValues, {
      method: "post",
    });
  }

  return (
    <>
      <main className="flex px-6 flex-col pt-8 max-w-2xl mx-auto space-y-4 mb-8">
        <header className="pb-4">
          <h1 className="text-2xl font-bold">Patungan!</h1>
        </header>

        <Form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <Label className="pb-3" htmlFor="app-name">
              Nama aplikasi
            </Label>
            <Input
              onChange={handleChange}
              placeholder="Nama aplikasi langganan"
              type="text"
              name="appName"
              id="app-name"
              className="input"
              defaultValue={subscription?.name}
              value={formValues?.appName}
            />
            <span className="text-sm mt-1 text-muted-foreground">
              Nama aplikasi yang kamu gunakan untuk patungan. Contoh: Netflix,
              Spotify, dll.
            </span>
          </div>

          <div className="flex flex-col">
            <Label className="pb-3" htmlFor="total-biaya">
              Total biaya per bulan (keseluruhan)
            </Label>
            <Input
              placeholder="Total biaya langganan (Rp)"
              leftIcon={
                <BanknoteIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              }
              value={formValues?.totalMonthlyCost}
              defaultValue={subscription?.monthlyPrice}
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                handleChange(e);
              }}
              name="totalMonthlyCost"
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
              date={
                formValues.startDate
                  ? new Date(formValues.startDate)
                  : defaultStartDate
              }
              setDate={onChangeDate}
            />
          </div>

          <div className="flex flex-col">
            <Label className="pb-3" htmlFor="participants">
              Anggota
            </Label>
            <ClientOnly
              fallback={
                <div className="block h-[38px] w-full border border-input rounded"></div>
              }
            >
              {() => (
                <Creatable
                  key={formValues?.participants?.length}
                  defaultValue={
                    subscription?.participants || formValues?.participants
                  }
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
                  isClearable={false}
                />
              )}
            </ClientOnly>

            <div className="mt-3">
              <p>
                <span className="block">Biaya per bulan per anggota:</span>
                <span className="text-lg pt-2 font-medium">{displayText}</span>
              </p>
            </div>

            <ParticipantsCheckBoxes />

            <div className="flex space-x-2 items-center mt-6">
              <Button
                onClick={() => {
                  saveForm();
                  updateIsChanged();
                }}
                variant={isChanged ? "default" : "outline"}
                className="w-full space-x-3"
                size="xl"
              >
                {navigation.state !== "idle" && (
                  <Loader2 className="w-5 h-5 text-neutral-800 animate-spin" />
                )}
                Simpan
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 px-4"
                variant={isChanged ? "save" : "ghost"}
                type="button"
                onClick={() => {
                  useEditableForm.getState().resetForm();
                }}
              >
                <UndoIcon />
              </Button>
            </div>
          </div>
        </Form>
      </main>
    </>
  );
}
