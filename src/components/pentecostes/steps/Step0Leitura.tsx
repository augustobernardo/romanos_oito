import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { PentecostesFormData } from "../schema";

interface Props {
  form: UseFormReturn<PentecostesFormData>;
  onConfirmationChange?: (checked: boolean) => void;
}

const VIGILIA_INFO_TEXT = `📖 LEIA COM ATENÇÃO AS INFORMAÇÕES DA VIGÍLIA DE PENTECOSTES

A Vigília de Pentecostes é um momento de profunda experiência espiritual, onde nos reunimos para clamar o derramamento do Espírito Santo sobre nossas vidas.

🕘 HORÁRIOS
• Início: 21h30
• Término: 7h do dia seguinte
• Check-in: a partir das 21h30

📍 LOCAL
Paróquia Cristo Redentor

🙏 O QUE ESPERAR
• Momentos de oração e louvor
• Pregações e partilhas da Palavra
• Adoração ao Santíssimo Sacramento
• Workshops sobre os Dons do Espírito Santo
• Partilha de alimentos (cada participante contribui)

📋 REGRAS IMPORTANTES
• É necessário trazer documento de identificação
• Menores de 18 anos devem trazer autorização assinada pelos pais/responsáveis
• Não é permitido sair e retornar durante a vigília
• Celulares devem permanecer no modo silencioso
• Respeitar o ambiente de oração e os momentos de silêncio

🍞 PARTILHA
Cada participante deve contribuir com um item para a partilha de alimentos
(as opções serão apresentadas no formulário)

👕 VESTIMENTA
Roupas confortáveis e adequadas ao ambiente de igreja

📞 CONTATO
Em caso de dúvidas, entre em contato com a organização da Paróquia Cristo Redentor`;

const Step0Leitura = ({ form, onConfirmationChange }: Props) => {
  return (
    <div className="space-y-6">
      <div
        className="max-h-[50vh] overflow-y-auto border-2 border-pentecoste-navy bg-pentecoste-paper p-6 font-mono text-xs uppercase leading-relaxed tracking-wide text-pentecoste-navy/85 whitespace-pre-line"
        style={{ scrollBehavior: "smooth" }}
      >
        {VIGILIA_INFO_TEXT}
      </div>

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
