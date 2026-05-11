import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneField } from "../PhoneField";
import type { PentecostesFormData } from "../schema";
import { RadioCard } from "../components/RadioCard";
import { calculateAge } from "@/utils/dateUtils";

interface Props {
  form: UseFormReturn<PentecostesFormData>;
}

const Step1DadosPessoais = ({ form }: Props) => {
  const dataNascimento = form.watch("dataNascimento");
  const idade = dataNascimento ? calculateAge(dataNascimento) : 0;
  const isMenor = idade > 0 && idade < 18;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Nome Completo *</FormLabel>
            <FormControl>
              <Input
                placeholder="Seu nome completo"
                autoComplete="name"
                maxLength={100}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Instagram *</FormLabel>
              <FormControl>
                <Input
                  placeholder="@seuinsta"
                  autoComplete="off"
                  maxLength={30}
                  {...field}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && !v.startsWith("@")) {
                      field.onChange(`@${v}`);
                    }
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataNascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Data de Nascimento *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PhoneField
          form={form}
          name="whatsapp"
          label="Número do WhatsApp"
          required
        />
        {isMenor && (
          <PhoneField
            form={form}
            name="contatoResponsavel"
            label="Contato do responsável"
            required
          />
        )}
      </div>

      {isMenor && (
        <FormField
          control={form.control}
          name="confirmAuthorizationUnderage"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 border-2 border-pentecoste-navy bg-pentecoste-paper p-4">
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    aria-required
                    id="confirm_authorization_underage"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel
                    htmlFor="confirm_authorization_underage"
                    className="font-bold"
                  >
                    Sobre a ciência da autorização para menores de idade *
                  </FormLabel>
                  <p
                    className="leading-relaxed text-pentecoste-navy/80"
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      fontSize: "0.7rem",
                    }}
                  >
                    Estou assinalando está opção pois ESTOU CIENTE que eu sendo
                    de menor precisarei levar autorização assinada pelos meus
                    pais para que eu possa participar, caso contrário entendo
                    que não poderia permanecer durante a madrugada na igreja!
                  </p>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="paroquia"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Paróquia *</FormLabel>
            <FormControl>
              <Input
                placeholder="Nome da sua paróquia"
                maxLength={50}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="participaMovimento"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">
              Participa de algum movimento? (EAC, GO, Comunidade). Se sim, qual?
              *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Caso não participe, colocar 'Não'"
                maxLength={50}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jaParticipouR8"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">
              Já participou do Romanos 8? *
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-2"
              >
                <RadioCard value="sim" checked={field.value === "sim"}>
                  Sim! Já participei de vários.
                </RadioCard>
                <RadioCard value="nao" checked={field.value === "nao"}>
                  Não! Primeira vez que estarei participando de algo do R8
                </RadioCard>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step1DadosPessoais;
