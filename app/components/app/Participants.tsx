import { useEditableForm } from "~/store/store-form";
import { Checkbox } from "../ui/checkbox";
import { MONTHS } from "~/lib/helpers";
import { getMonth } from "date-fns";
import { cn } from "~/lib/utils";
import { InfoIcon } from "lucide-react";

export default function ParticipantsCheckBoxes() {
  const { participants, startDate, updateLogParticipant } = useEditableForm();

  const startDateMonth = startDate ? getMonth(new Date(startDate)) : 99;

  return participants.length === 0 ? (
    <div className="mt-4">
      <div className="bg-blue-50 text-blue-900 py-4 px-6 w-full rounded-md flex space-x-3 border border-blue-200">
        <InfoIcon className="w-6 h-6"></InfoIcon>
        <span>Isi anggota terlebih dahulu</span>
      </div>
    </div>
  ) : (
    <section className="px-6 rounded-md border border-input mt-8 bg-white">
      <div className={cn(participants.length ? "opacity-100" : "opacity-80")}>
        {
          <div className="pt-4 pb-8">
            <h2 className="text-2xl font-semibold text-neutral-800">
              Histori Pembayaran
            </h2>
            <p className="text-sm text-neutral-700">
              Centang bulan jika sudah bayar
            </p>
            <div className="space-y-4 mt-6">
              {participants.map((participant) => (
                <div
                  // to make sure the component rerender when the logs changed
                  key={`${participant.value}-${JSON.stringify(
                    participant.logs
                  )}`}
                >
                  <label
                    className="block text-lg font-medium mb-2"
                    htmlFor={participant.value}
                  >
                    {participant.value}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MONTHS.map((month, i) => {
                      const monthNumber = i;
                      const id = `${participant.value}-month-${monthNumber}`;

                      return (
                        <label
                          className="inline-flex items-center space-x-2"
                          htmlFor={id}
                          key={id}
                        >
                          <Checkbox
                            className={cn(
                              monthNumber < startDateMonth && "opacity-50"
                            )}
                            key={i}
                            label={month}
                            name={participant.value}
                            id={id}
                            defaultChecked={!!participant.logs?.[monthNumber]}
                            onCheckedChange={(checked) => {
                              updateLogParticipant(
                                participant.value,
                                monthNumber,
                                checked ? 1 : 0
                              );
                            }}
                          ></Checkbox>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </section>
  );
}
