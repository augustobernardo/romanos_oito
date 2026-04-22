/**
 * Factory for creating test data for cupons.
 */
import type { Tables } from "@/integrations/supabase/types";

type CupomOverrides = Partial<Tables<"cupons">>;

export const createCupom = (overrides: CupomOverrides = {}): Tables<"cupons"> => ({
  id: crypto.randomUUID(),
  codigo: "VCMAISDOIS#0001",
  nome_titular: null,
  comprovante_url: null,
  status: "ativo",
  usos_atuais: 0,
  max_usos: 3,
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createCupomUtilizado = (overrides: CupomOverrides = {}): Tables<"cupons"> =>
  createCupom({
    status: "utilizado",
    usos_atuais: 3,
    nome_titular: "Maria Oliveira",
    ...overrides,
  });
