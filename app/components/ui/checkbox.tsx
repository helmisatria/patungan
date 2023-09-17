import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "~/lib/utils";

type CheckboxProps = React.PropsWithChildren<
  {
    label: string;
  } & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>;

const Checkbox: React.FC<CheckboxProps> = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-9 w-9 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-800 data-[state=checked]:text-primary-foreground inline-flex items-center justify-center",
      className
    )}
    {...props}
  >
    <span className="text-xs">{label.slice(0, 3).toUpperCase()}</span>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
