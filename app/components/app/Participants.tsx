import { useFormStore } from "~/store/store";
import { Checkbox } from "../ui/checkbox";

export default function ParticipantsCheckBoxes() {
  const { participants } = useFormStore();

  return (
    <section>
      {participants.map((participant) => (
        <div key={participant.value}>
          <label htmlFor={participant.value}>{participant.value}</label>
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Checkbox
                key={i}
                name={participant.value}
                id={`${participant.value}-month-${i}`}
              ></Checkbox>
            ))}
        </div>
      ))}
    </section>
  );
}
