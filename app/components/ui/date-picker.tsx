import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SelectSingleEventHandler } from "react-day-picker";

export interface DatePickerProps {
  date?: Date;
  setDate?: SelectSingleEventHandler | ((date: Date) => void);
}

export function DatePicker({
  date = new Date(new Date().getFullYear(), 0, 1),
  setDate,
}: DatePickerProps) {
  const [localDate, setLocalDate] = React.useState<string>();

  const [, startTransition] = React.useTransition();

  React.useEffect(() => {
    startTransition(() => {
      setLocalDate(format(date, "dd MMM yyyy"));
    });
  }, [date, startTransition]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full md:w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {localDate ? (
            localDate
          ) : (
            <span className="text-neutral-600">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={setDate as SelectSingleEventHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
