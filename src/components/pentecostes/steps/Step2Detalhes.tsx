import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ARRIVAL_RESTRICTION_OPTIONS,
  BRING_SHARE_OPTIONS,
  PentecostesFormData,
  WORKSHOP_OPTIONS,
} from "../schema";
import { RadioCard } from "../components/RadioCard";

interface Props {
  form: UseFormReturn<PentecostesFormData>;
}

const monoStyle = {
  fontFamily: "ui-monospace, monospace",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  fontSize: "0.7rem",
};

const Step2Detalhes = ({ form }: Props) => {
  const bringShare = form.watch("bringShare") || [];
  const arrivalTime = form.watch("arrivalTime");
  const showOther = bringShare.includes("outro");
  const restrictionDisabled = arrivalTime === true;

  return (
    <div className="space-y-6">
      {/* bring_share Multi Select */}
      <FormField
        control={form.control}
        name="bringShare"
        render={() => (
          <FormItem>
            <FormLabel className="font-bold">O que você vai trazer? *</FormLabel>
            <p
              className="leading-relaxed text-pentecoste-navy/80"
              style={monoStyle}
            >
              Selecione o que você vai trazer para partilhar. Caso escolha
              "Outro", descreva abaixo o que você irá levar.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {BRING_SHARE_OPTIONS.map((opt) => (
                <FormField
                  key={opt.value}
                  control={form.control}
                  name="bringShare"
                  render={({ field }) => {
                    const checked = (field.value || []).includes(opt.value);
                    return (
                      <FormItem className="flex items-start gap-2 space-y-0 border-2 border-pentecoste-navy/30 bg-pentecoste-paper p-3">
                        <FormControl>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(c) => {
                              const current: string[] = field.value || [];
                              if (c === true) {
                                field.onChange([...current, opt.value]);
                              } else {
                                field.onChange(
                                  current.filter((v) => v !== opt.value),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer font-medium">
                          {opt.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOther && (
        <FormField
          control={form.control}
          name="bringShareOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Descreva o que você irá levar *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Frutas variadas"
                  maxLength={200}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* workshop_group */}
      <FormField
        control={form.control}
        name="workshopGroup"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">
              Escolha sua turma de workshop *
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-2"
              >
                {WORKSHOP_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    value={opt.value}
                    checked={field.value === opt.value}
                  >
                    {opt.label}
                  </RadioCard>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* arrival_time checkbox */}
      <FormField
        control={form.control}
        name="arrivalTime"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2 border-2 border-pentecoste-navy bg-pentecoste-paper p-4">
            <div className="flex items-start gap-3">
              <FormControl>
                <Checkbox
                  id="arrival_time"
                  checked={field.value === true}
                  onCheckedChange={(c) => {
                    field.onChange(c === true);
                    if (c === true) {
                      form.setValue("arrivalTimeRestriction", undefined, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel htmlFor="arrival_time" className="font-bold">
                  Comprometimento de chegada às 21h30
                </FormLabel>
                <p
                  className="leading-relaxed text-pentecoste-navy/80"
                  style={monoStyle}
                >
                  Comprometo-me chegar às 21h30 para realizar o meu check-in.
                  Caso escolha outro horário, desmarque esta opção.
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* arrival_time_restriction */}
      <FormField
        control={form.control}
        name="arrivalTimeRestriction"
        render={({ field }) => (
          <FormItem
            aria-disabled={restrictionDisabled}
            className={restrictionDisabled ? "opacity-50" : ""}
          >
            <FormLabel className="font-bold">
              Horário alternativo de chegada {!restrictionDisabled && "*"}
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={restrictionDisabled}
                className="flex flex-col gap-2"
              >
                {ARRIVAL_RESTRICTION_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt}
                    value={opt}
                    checked={field.value === opt}
                    disabled={restrictionDisabled}
                    align="center"
                  >
                    {opt}
                  </RadioCard>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* expectations_pentecoste */}
      <FormField
        control={form.control}
        name="expectationsPentecoste"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">
              Quais são suas expectativas para essa Vigília?
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Compartilhe sua expectativa"
                maxLength={500}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step2Detalhes;