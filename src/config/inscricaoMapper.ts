import type { TablesInsert } from "@/integrations/supabase/types";
import { OIKOS_EVENT_ID } from "./constants";

type FormValues = {
  nome: string;
  dataNascimento: string;
  telefone: string;
  instagram: string;
  comunidade: string;
  cidadeEstado: string;
  enderecoCompleto: string;
  comoConheceu: string;
  comoConheceuOutro: string;
  nomeMae: string;
  numeroMae: string;
  nomePai: string;
  numeroPai: string;
  numeroResponsavelProximo: string;
  isCatolico: string;
  isCatolicoOutro: string;
  participaMovimento: string;
  fezRetiro: string;
  fezRetiroOutro: string;
  nomePessoaEmergencia: string;
  grauParentescoEmergencia: string;
  numeroEmergencia: string;
  tamanhoCamisa: string;
  expectativaOikos: string;
};

export const calculateAge = (birthday: string): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const mapFormToInscricao = (
  loteId: number,
  formData: FormValues,
  method: "credit" | "pix" | "cupom",
  status: string,
  cupomInfo?: { nomeTitular: string | null; comprovanteUrl: string | null },
  codigoServo?: string | null,
): TablesInsert<"inscricoes"> => ({
  lote_id: loteId,
  evento_id: OIKOS_EVENT_ID,
  nome: formData.nome,
  data_nascimento: formData.dataNascimento,
  telefone: formData.telefone.replace(/\D/g, ""),
  instagram: formData.instagram,
  comunidade: formData.comunidade,
  cidade_estado: formData.cidadeEstado,
  endereco_completo: formData.enderecoCompleto,
  como_conheceu: formData.comoConheceu,
  como_conheceu_outro: formData.comoConheceuOutro || null,
  nome_mae: formData.nomeMae,
  numero_mae: formData.numeroMae,
  nome_pai: formData.nomePai,
  numero_pai: formData.numeroPai,
  numero_responsavel_proximo: formData.numeroResponsavelProximo || null,
  is_catolico: formData.isCatolico,
  is_catolico_outro: formData.isCatolicoOutro || null,
  participa_movimento: formData.participaMovimento,
  fez_retiro: formData.fezRetiro,
  fez_retiro_outro: formData.fezRetiroOutro || null,
  nome_pessoa_emergencia: formData.nomePessoaEmergencia,
  grau_parentesco_emergencia: formData.grauParentescoEmergencia,
  numero_emergencia: formData.numeroEmergencia,
  tamanho_camisa: formData.tamanhoCamisa,
  expectativa_oikos: formData.expectativaOikos || null,
  idade: calculateAge(formData.dataNascimento),
  status,
  metodo_pagamento: method,
  lote_especial: method === "cupom",
  titular_especial: cupomInfo?.nomeTitular || null,
  comprovante_url: cupomInfo?.comprovanteUrl || null,
  // codigo_servo was added by the SERVOAMIGO migration. The generated types
  // may not yet include it; cast keeps build clean while remaining type-safe at runtime.
  ...(codigoServo ? ({ codigo_servo: codigoServo } as Record<string, string>) : {}),
});
