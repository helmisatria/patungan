import { Label } from "@radix-ui/react-label";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
  useNavigate,
  useFetcher,
} from "@remix-run/react";
import ParticipantsCheckBoxes from "./Participants";
import toast from "react-hot-toast";
import type { LoaderData } from "~/routes/_index";
import type { SubmitFormType } from "~/store/store-form";
import { BanknoteIcon, InfoIcon, Loader2, UndoIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ClientOnly, useHydrated } from "remix-utils";
import { DatePicker } from "../ui/date-picker";
import { Input } from "../ui/input";
import { TelegramIcon } from "../icons/telegram";
import { cleanNumber, cleanObject } from "~/lib/helpers";
import { pick, isEqual } from "lodash-es";
import { produce } from "immer";
import { useEditableForm, defaultStartDate } from "~/store/store-form";
import { useFormValid } from "../hooks/useFormValid";
import { useState, useEffect, useRef, useMemo } from "react";
import { SelectParticipants } from "./SelectParticipants.client";

const comparableFields = [
  "appName",
  "totalMonthlyPrice",
  "startDate",
  "participants",
];

export function MainForm() {
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const loaderData = useLoaderData() as unknown as LoaderData;
  const [, setResetIdentifier] = useState(Date.now());
  const [isMounted, setIsMounted] = useState(false);

  const { subscription } = useLoaderData() as unknown as LoaderData;

  const defaultFormValues = useMemo(() => {
    return {
      appName: subscription?.name || loaderData.form?.appName || "",
      totalMonthlyPrice: String(
        (subscription?.monthlyPrice || loaderData.form?.totalMonthlyPrice) ?? ""
      )
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      startDate:
        subscription?.activatedAt || loaderData.form?.startDate
          ? new Date(
              subscription?.activatedAt ??
                loaderData.form?.startDate ??
                new Date().toISOString()
            )
          : defaultStartDate,
      participants:
        subscription?.participants || loaderData.form?.participants
          ? JSON.parse(
              (subscription?.participants ||
                loaderData.form?.participants) as string
            )
          : [],
    };
  }, [loaderData.form, subscription]);

  const [editableSubscription, setEditableSubscription] =
    useState(defaultFormValues);

  const [isChanged, setIsChanged] = useState(false);
  const fetcher = useFetcher();
  const { setForm } = useEditableForm();
  const { isFormValid } = useFormValid();
  const navigation = useNavigation();

  useEffect(() => {
    setForm(editableSubscription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editableSubscription]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ [e.target.name]: e.target.value });
    switch (e.target.name) {
      case "appName":
        setEditableSubscription(
          produce((draft) => {
            draft.appName = e.target.value;
          })
        );
        break;
      case "totalMonthlyPrice":
        setEditableSubscription(
          produce((draft) => {
            draft.totalMonthlyPrice = e.target.value
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const convertDate = (date: Date | string) => {
      return new Date(date).toISOString();
    };

    const pickForm = (form?: SubmitFormType) => {
      if (!form) return {};

      return pick(
        { ...form, startDate: convertDate(form.startDate ?? defaultStartDate) },
        comparableFields
      );
    };

    const saved = pickForm(defaultFormValues);
    const edited = pickForm(editableSubscription);

    const isEdited = !isEqual(saved, edited);
    setIsChanged(isEdited);
  }, [defaultFormValues, editableSubscription, loaderData.form]);

  const noTotalCostText = (
    <span className="text-neutral-600 text-base font-normal">
      (isi total biaya langganan & anggota)
    </span>
  );

  const totalCostByParticipant = `Rp 
      ${Number(
        cleanNumber(editableSubscription.totalMonthlyPrice) /
          editableSubscription.participants.length
      ).toLocaleString("id-ID")}`;

  const displayText = editableSubscription?.participants?.length
    ? editableSubscription.totalMonthlyPrice
      ? totalCostByParticipant
      : noTotalCostText
    : noTotalCostText;

  useEffect(() => {
    if (fetcher.data?.error === "INVALID_FORM_DATA") {
      const participants = JSON.parse(
        fetcher.data.data.participants as unknown as string
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
    } else if (fetcher.data?.error === null) {
      if (!loaderData.user) {
        toast("Data tersimpan,\nbisa connect telegram ya!", {
          icon: <TelegramIcon className="w-5 h-5" />,
        });

        setTimeout(() => {
          // scrollto #connect-telegram
          const connectTelegram = document.getElementById("connect-telegram");
          if (connectTelegram) {
            connectTelegram.scrollIntoView({
              behavior: "smooth",
            });
          }
        }, 1000);
      } else {
        toast.success("Data berhasil disimpan!", {
          position: "top-center",
        });
      }
    }

    const isAfterTelegramConnected =
      searchParams.get("telegram-connected") === "1";
    if (fetcher.data?.error === null && isAfterTelegramConnected) {
      navigate(`/subs/${fetcher.data?.data.subscription.id}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  useEffect(() => {
    if (searchParams.get("telegram-connected") == "1") {
      // submit Form
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [searchParams, hydrated]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parseFormValues = (form: SubmitFormType) => {
      return {
        appName: form.appName,
        totalMonthlyPrice: form.totalMonthlyPrice
          ? cleanNumber(form.totalMonthlyPrice)
          : undefined,
        participants: JSON.stringify(form.participants),
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : undefined,
      };
    };

    const parsedFormValues = parseFormValues(editableSubscription);

    fetcher.submit(cleanObject(parsedFormValues), {
      action: "/?index",
      method: "post",
    });
  }

  return (
    <>
      <main className="flex px-6 flex-col pt-8 max-w-2xl mx-auto space-y-4 mb-8">
        <header className="pb-4">
          <h1 className="text-2xl font-bold">Patungan!</h1>
        </header>

        <fetcher.Form
          ref={formRef}
          onSubmit={handleSubmit}
          action="/?index"
          method="post"
          className="space-y-4"
        >
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
              value={editableSubscription.appName}
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
              value={editableSubscription.totalMonthlyPrice}
              onChange={(e) => {
                handleChange(e);
              }}
              name="totalMonthlyPrice"
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
              date={editableSubscription.startDate}
              setDate={(e: any) => {
                setEditableSubscription(
                  produce((draft) => {
                    draft.startDate = e ? new Date(e) : defaultStartDate;
                  })
                );
              }}
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
              {() =>
                isMounted && (
                  <SelectParticipants
                    editableSubscription={editableSubscription}
                    setEditableSubscription={setEditableSubscription}
                  />
                )
              }
            </ClientOnly>

            <div className="mt-3">
              <p>
                <span className="block">Biaya per bulan per anggota:</span>
                <span className="text-lg pt-2 font-medium">{displayText}</span>
              </p>
            </div>

            <ParticipantsCheckBoxes
              participants={editableSubscription.participants}
              startDate={editableSubscription.startDate}
              onChangeParticipantLog={(participant, month, value) => {
                setEditableSubscription(
                  produce((draft) => {
                    const participantIndex = draft.participants.findIndex(
                      (p: { label: string; value: string; logs?: number[] }) =>
                        p.value === participant
                    );

                    if (participantIndex === -1) {
                      return;
                    }

                    if (!draft.participants[participantIndex].logs) {
                      draft.participants[participantIndex].logs = new Array(
                        12
                      ).fill(0);
                    }

                    draft.participants[participantIndex].logs[month] = value;
                  })
                );
              }}
            />

            <div className="flex space-x-2 items-center mt-6">
              <Button
                variant={isChanged ? "default" : "outline"}
                className="w-full space-x-3"
                size="xl"
              >
                {navigation.state !== "idle" && (
                  <Loader2 className="w-5 h-5 text-neutral-800 animate-spin" />
                )}
                <span>Simpan</span>
              </Button>
              <Button
                size="icon"
                className="h-14 w-14 px-4"
                variant={isChanged ? "save" : "ghost"}
                type="button"
                onClick={() => {
                  setResetIdentifier(Date.now());
                  if (loaderData.subscription || loaderData.form) {
                    setEditableSubscription(
                      produce((draft) => {
                        draft.appName = defaultFormValues.appName;
                        draft.totalMonthlyPrice =
                          defaultFormValues.totalMonthlyPrice;
                        draft.startDate = defaultFormValues.startDate;
                        draft.participants = defaultFormValues.participants;
                      })
                    );
                  }
                }}
              >
                <UndoIcon />
              </Button>
            </div>
          </div>
        </fetcher.Form>
      </main>
    </>
  );
}
