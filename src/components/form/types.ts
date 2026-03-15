import { z } from "zod";
import { isValidPhone } from "@/utils/phoneUtils";

const phoneField = z.string().refine(isValidPhone, { message: "Contato inválido" });

export const formSchema = z.object({
  // Dados Pessoais
  nome: z
    .string()
    .min(3, "O nome precisa ter pelo menos 3 caracteres")
    .refine((val) => !/\d/.test(val), {
      message: "O nome não pode conter números",
    }),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  telefone: z
      .string()
      .min(10, "Telefone incompleto")
      .max(15)
      .refine(isValidPhone, {
        message: "Telefone inválido",
      }),
  instagram: z.string().min(3, "Instagram deve ter pelo menos 3 caracteres").max(100),
  comunidade: z.string().min(2, "Comunidade/Paróquia é obrigatória").max(100),
  cidadeEstado: z.string().min(8, "Estado e Cidade são obrigatórios").max(100),
  enderecoCompleto: z.string().min(5, "Endereço completo é obrigatório").max(255),
  comoConheceu: z.string({
    required_error: "Selecione como conheceu o Romanos Oito",
  }),
  comoConheceuOutro: z.string().optional(),

  // Pais / Responsáveis
  nomeMae: z.string().min(3, "Nome da mãe deve ter pelo menos 3 caracteres").max(100),
  numeroMae: phoneField,
  nomePai: z.string().min(3, "Nome do pai deve ter pelo menos 3 caracteres").max(100),
  numeroPai: phoneField,
  numeroResponsavelProximo: phoneField.optional(),

  // Vida na Igreja
  isCatolico: z.string().min(1, "Selecione uma opção"),
  isCatolicoOutro: z.string().optional(),
  participaMovimento: z.string().min(2, "Campo obrigatório").max(100),
  fezRetiro: z.string().min(1, "Selecione uma opção"),
  fezRetiroOutro: z.string().optional(),

  // Emergência
  nomePessoaEmergencia: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  grauParentescoEmergencia: z.string().min(2, "Grau de parentesco é obrigatório").max(50),
  numeroEmergencia: z.string().refine(isValidPhone, { message: "Número de emergência inválido" }),

  // Camisa
  tamanhoCamisa: z.string().min(1, "Selecione o tamanho da camisa"),
  cienteTrocaCamisa: z.boolean().refine((val) => val === true, {
    message: "Você precisa confirmar que está ciente da troca de camisa",
  }),

  // Expectativa
  expectativaOikos: z.string().optional(),
}).refine((data) => {
  if (data.comoConheceu === "outro") {
    return data.comoConheceuOutro && data.comoConheceuOutro.length > 2
  }
  return true
}, {
  message: "Explique como conheceu o evento",
  path: ["comoConheceuOutro"],
});

export type FormData = z.infer<typeof formSchema>;

export type FormInstance = ReturnType<typeof import("react-hook-form").useForm<FormData>>;
