import { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface RadioCardProps {
  value: string;
  checked: boolean;
  children: ReactNode;
  disabled?: boolean;
  align?: "start" | "center";
  className?: string;
}

/**
 * Reusable card-styled radio option for the Pentecostes form.
 * Standardizes border, hover shadow and selected highlight.
 */
export const RadioCard = ({
  value,
  checked,
  children,
  disabled,
  align = "start",
  className,
}: RadioCardProps) => {
  return (
    <FormItem
      data-checked={checked}
      className={cn(
        "flex gap-2 space-y-0 border-2 border-pentecoste-navy/30 bg-pentecoste-paper p-3 transition-all duration-200",
        "hover:border-pentecoste-red hover:shadow-[2px_2px_0_0_rgba(168,50,74,0.6)]",
        "data-[checked=true]:border-pentecoste-red",
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      <FormControl>
        <RadioGroupItem value={value} disabled={disabled} />
      </FormControl>
      <FormLabel className="!mt-0 cursor-pointer font-medium">
        {children}
      </FormLabel>
    </FormItem>
  );
};

export default RadioCard;