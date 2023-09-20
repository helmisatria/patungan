import { format } from "date-fns";
import { z } from "zod";

export const SchemaFormType = z.object({
  appName: z.string().min(1),
  totalMonthlyPrice: z
    .string()
    .min(1)
    .transform((val) => Number(val)),
  startDate: z
    .string()
    .min(1)
    .datetime()
    .transform((val) => {
      return format(new Date(val), "yyyy-MM-dd");
    }),
  participants: z
    .string()
    .min(1)
    .transform((val) => {
      return JSON.parse(val);
    }),
});
