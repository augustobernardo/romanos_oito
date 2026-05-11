/**
 * Tests for useLotes hook and helper functions.
 */
import { describe, it, expect } from "vitest";
import { getLoteDisponivel } from "@/hooks/useLotes";

const makeLote = (overrides: Partial<ReturnType<typeof defaultLote>> = {}) => {
  const defaults = defaultLote();
  return { ...defaults, ...overrides };
};

function defaultLote() {
  return {
    id: 1,
    nome: "Lote 1",
    preco: "100.00",
    status: "disponivel" as const,
    is_especial: false,
  };
}

describe("getLoteDisponivel", () => {
  it("retorna o ID do primeiro lote disponível", () => {
    const lotes = [
      makeLote({ id: 1, status: "esgotado" }),
      makeLote({ id: 2, status: "disponivel" }),
      makeLote({ id: 3, status: "disponivel" }),
    ];
    expect(getLoteDisponivel(lotes)).toBe(2);
  });

  it("retorna null quando nenhum lote está disponível", () => {
    const lotes = [
      makeLote({ id: 1, status: "esgotado" }),
      makeLote({ id: 2, status: "esgotado" }),
    ];
    expect(getLoteDisponivel(lotes)).toBeNull();
  });

  it("ignora lotes especiais", () => {
    const lotes = [
      makeLote({ id: 1, status: "disponivel", is_especial: true }),
      makeLote({ id: 2, status: "disponivel", is_especial: false }),
    ];
    expect(getLoteDisponivel(lotes)).toBe(2);
  });

  it("retorna null para array vazio", () => {
    expect(getLoteDisponivel([])).toBeNull();
  });
});
