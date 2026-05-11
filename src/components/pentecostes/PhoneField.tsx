import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatPhone } from "@/utils/phoneUtils";

interface PhoneFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function PhoneField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "(00) 00000-0000",
  required,
}: PhoneFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">
            {label}
            {required ? " *" : ""}
          </FormLabel>
          <FormControl>
            <Input
              inputMode="tel"
              autoComplete="tel"
              placeholder={placeholder}
              value={(field.value as string) ?? ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                field.onChange(formatPhone(digits));
              }}
              onBlur={field.onBlur}
              maxLength={16}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}