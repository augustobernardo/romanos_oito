import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { PentecostesFormData } from "../schema";
import VigiliaInfoSummary from "../VigiliaInfoSummary";

interface Props {
  form: UseFormReturn<PentecostesFormData>;
  onConfirmationChange?: (checked: boolean) => void;
}

const Step0Leitura = ({ form, onConfirmationChange }: Props) => {
  return (
    <div className="space-y-6">
      <VigiliaInfoSummary />

      <FormField
        control={form.control}
        name="read_descriptions_confirmation"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 border-2 border-pentecoste-red bg-pentecoste-paper p-5">
            <div className="flex items-start gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(checked) => {
                    const value = checked === true;
                    field.onChange(value);
                    onConfirmationChange?.(value);
                  }}
                  aria-required
                  id="read_descriptions_confirmation"
                />
              </FormControl>
              <div className="space-y-1">
                <label
                  htmlFor="read_descriptions_confirmation"
                  className="cursor-pointer font-mono text-xs font-bold uppercase tracking-wider text-pentecoste-navy"
                >
                  Li e estou ciente de todas as informações *
                </label>
                <p
                  className="leading-relaxed text-pentecoste-navy/70"
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontSize: "0.7rem",
                  }}
                >
                  Confirmo que li atentamente as informações acima sobre a
                  Vigília de Pentecostes e estou de acordo com todas as regras e
                  orientações.
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step0Leitura;
