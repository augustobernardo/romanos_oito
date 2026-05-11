import { z } from "zod";
import { isValidPhone } from "@/utils/phoneUtils";
import { calculateAge } from "@/utils/dateUtils";

const phoneField = z
  .string()
  .min(1, "Campo obrigatório")
  .refine(isValidPhone, { message: "Telefone inválido" });

export const BRING_SHARE_OPTIONS = [
  { value: "leite_1l", label: "01 Caixa de Leite (1L)" },
  { value: "suco_1l", label: "01 Suco de Caixinha (1L)" },
  { value: "achocolatado", label: "01 Caixa de Leite Achocolatado pronto" },
  { value: "iogurte_1l", label: "01L de Iogurte" },
  { value: "refrigerante_2l", label: "01 Pet 2L de Refrigerante" },
  { value: "cafe", label: "01 Garrafa com Café" },
  { value: "biscoito_recheado", label: "02 pct de Biscoito Recheado" },
  { value: "pao_de_forma", label: "01 Sacola de Pão de Forma" },
  { value: "paes_de_sal", label: "05 pães de Sal" },
  { value: "pao_de_queijo", label: "Pão de Queijo (Assado)" },
  { value: "salgadinho", label: "Pratinho de Salgadinho" },
  { value: "outro", label: "Outra coisa? Descreva abaixo" },
] as const;

export const WORKSHOP_OPTIONS = [
  {
    value: "turma_01",
    label:
      "Turma 01 - Dons de Elocução – Dom de Língua; Dom de Profecia e Dom de Interpretação de Línguas",
  },
  {
    value: "turma_02",
    label:
      "Turma 02 - Dons de Poder – Dom da fé; Dom de Cura e Dom de Milagres",
  },
  {
    value: "turma_03",
    label:
      "Turma 03 - Dons de Revelação – Palavra de Sabedoria; Palavra de Ciência e Discernimento dos Espíritos",
  },
  {
    value: "turma_04",
    label: "Turma 04 - Workshop - Exercitando e efetivando os DONS (Salão Paroquial)",
  },
] as const;

export const ARRIVAL_RESTRICTION_OPTIONS = ["22:00", "22:30", "23:00"] as const;

export const pentecostesFormSchema = z
  .object({
    // Step 1 - Reading
    read_descriptions_confirmation: z.literal(true, {
      errorMap: () => ({ message: "Você precisa confirmar a leitura das informações" }),
    }),
    // Step 2 - Personal Info
    nome: z
      .string()
      .trim()
      .min(5, "Nome deve ter pelo menos 5 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .refine((v) => !/\d/.test(v), { message: "O nome não pode conter números" }),
    instagram: z
      .string()
      .trim()
      .min(2, "Instagram deve ter pelo menos 2 caracteres")
      .max(30, "Instagram deve ter no máximo 30 caracteres")
      .transform((v) => v && !v.startsWith("@") ? `@${v}` : v),
    whatsapp: phoneField,
    dataNascimento: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .refine(
        (val) => {
          const d = new Date(val);
          return !isNaN(d.getTime()) && d.getFullYear() > 1900;
        },
        { message: "Data de nascimento inválida" },
      )
      .refine(
        (val) => {
          const age = calculateAge(val);
          return age >= 14;
        },
        { message: "Idade mínima é 14 anos" },
      ),
    contatoResponsavel: z.string().optional().or(z.literal("")),
    confirmAuthorizationUnderage: z.boolean().optional(),
    paroquia: z
      .string()
      .trim()
      .min(5, "Paróquia deve ter pelo menos 5 caracteres")
      .max(50, "Paróquia deve ter no máximo 50 caracteres"),
    participaMovimento: z
      .string()
      .trim()
      .min(3, "Mínimo de 3 caracteres")
      .max(50, "Máximo de 50 caracteres"),
    jaParticipouR8: z.enum(["sim", "nao"], {
      required_error: "Selecione uma opção",
    }),
    // Step 3 - Event Info
    bringShare: z.array(z.string()).min(1, "Selecione ao menos uma opção"),
    bringShareOther: z.string().trim().max(200).optional().or(z.literal("")),
    workshopGroup: z.enum(
      ["turma_01", "turma_02", "turma_03", "turma_04"],
      { required_error: "Selecione uma turma" },
    ),
    arrivalTime: z.boolean().optional(),
    arrivalTimeRestriction: z
      .enum(["22:00", "22:30", "23:00"])
      .optional(),
    expectationsPentecoste: z
      .string()
      .trim()
      .max(500, "Máximo de 500 caracteres")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const age = data.dataNascimento ? calculateAge(data.dataNascimento) : 0;
    if (age > 0 && age < 18) {
      if (!data.contatoResponsavel || !isValidPhone(data.contatoResponsavel)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contatoResponsavel"],
          message: "Contato do responsável é obrigatório para menores de 18 anos",
        });
      }
      if (data.confirmAuthorizationUnderage !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmAuthorizationUnderage"],
          message:
            "É necessário confirmar a ciência da autorização para menores de idade",
        });
      }
    }
    if (data.bringShare?.includes("outro")) {
      if (!data.bringShareOther || data.bringShareOther.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bringShareOther"],
          message: "Descreva o que você irá levar (mínimo 3 caracteres)",
        });
      }
    }
    if (data.arrivalTime !== true) {
      if (!data.arrivalTimeRestriction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["arrivalTimeRestriction"],
          message: "Selecione um horário de chegada",
        });
      }
    }
  });

export type PentecostesFormData = z.infer<typeof pentecostesFormSchema>;
export type Step1Data = PentecostesFormData;

export const STEP_FIELDS: Record<number, (keyof PentecostesFormData)[]> = {
  0: ["read_descriptions_confirmation"],
  1: [
    "nome",
    "instagram",
    "whatsapp",
    "dataNascimento",
    "contatoResponsavel",
    "confirmAuthorizationUnderage",
    "paroquia",
    "participaMovimento",
    "jaParticipouR8",
  ],
  2: [
    "bringShare",
    "bringShareOther",
    "workshopGroup",
    "arrivalTime",
    "arrivalTimeRestriction",
    "expectationsPentecoste",
  ],
};
