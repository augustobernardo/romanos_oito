/**
 * Factory for creating test data for lotes.
 */
import type { Tables } from "@/integrations/supabase/types";

type LoteOverrides = Partial<Tables<"lotes">>;

export const createLote = (overrides: LoteOverrides = {}): Tables<"lotes"> => ({
  id: Math.floor(Math.random() * 10000),
  nome: "Lote Normal",
  preco: "150.00",
  ordem: 1,
  status: "disponivel",
  created_at: new Date().toISOString(),
  is_especial: false,
  id_payment_link: null,
  ...overrides,
});

export const createLoteEspecial = (overrides: LoteOverrides = {}): Tables<"lotes"> =>
  createLote({
    nome: "Lote Especial",
    is_especial: true,
    status: "disponivel",
    ...overrides,
  });
