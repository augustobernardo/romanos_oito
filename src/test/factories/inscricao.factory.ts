/**
 * Factory for creating test data for inscricoes.
 */
import type { Tables } from "@/integrations/supabase/types";

type InscricaoOverrides = Partial<Tables<"inscricoes">>;

export const createInscricao = (overrides: InscricaoOverrides = {}): Tables<"inscricoes"> => ({
  id: crypto.randomUUID(),
  nome: "João da Silva",
  telefone: "11912345678",
  instagram: "@joao",
  comunidade: "Paróquia São José",
  cidade_estado: "São Paulo - SP",
  endereco_completo: "Rua das Flores, 123",
  como_conheceu: "amigo",
  como_conheceu_outro: null,
  nome_mae: "Ana Silva",
  numero_mae: "11912345678",
  nome_pai: "José Silva",
  numero_pai: "11912345678",
  numero_responsavel_proximo: null,
  is_catolico: "sim",
  is_catolico_outro: null,
  participa_movimento: "Comunidade Vida",
  fez_retiro: "sim",
  fez_retiro_outro: null,
  nome_pessoa_emergencia: "Maria Silva",
  grau_parentesco_emergencia: "Irmã",
  numero_emergencia: "11912345678",
  tamanho_camisa: "M",
  expectativa_oikos: "Crescer na fé",
  idade: 30,
  data_nascimento: "1995-06-20",
  evento_id: "a4a01143-0560-44cd-735f7b29bf25",
  lote_id: 1,
  status: "processando",
  metodo_pagamento: "pix",
  comprovante_url: null,
  lote_especial: false,
  titular_especial: null,
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createInscricaoConfirmada = (overrides: InscricaoOverrides = {}): Tables<"inscricoes"> =>
  createInscricao({ status: "confirmado", ...overrides });

export const createInscricaoCancelada = (overrides: InscricaoOverrides = {}): Tables<"inscricoes"> =>
  createInscricao({ status: "cancelado", ...overrides });
