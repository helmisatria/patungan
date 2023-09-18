import { useEditableForm } from "~/store/store-form";
import { Checkbox } from "../ui/checkbox";
import { MONTHS } from "~/lib/helpers";
import { getMonth } from "date-fns";
import { cn } from "~/lib/utils";

export default function ParticipantsCheckBoxes() {
  const { participants, startDate } = useEditableForm();

  const startDateMonth = startDate ? getMonth(new Date(startDate)) : 99;

  return (
    <section className="px-6 pt-4 pb-8 rounded-md border border-input mt-8 bg-white">
      <h2 className="text-2xl font-semibold text-neutral-600">
        Anggota Patungan
      </h2>

      {!!participants.length && (
        <div className="space-y-4 mt-6">
          {participants.map((participant) => (
            <div key={participant.value}>
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
                      ></Checkbox>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
