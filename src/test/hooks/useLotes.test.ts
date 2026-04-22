/**
 * Tests for useLotes hook and helper functions.
 * Tests the pure functions (getLoteDisponivel, getLoteDisponivelPaymentLink)
 * without mocking Supabase queries.
 */
import { describe, it, expect } from "vitest";
import { getLoteDisponivel, getLoteDisponivelPaymentLink } from "@/hooks/useLotes";

const makeLote = (overrides: Partial<ReturnType<typeof defaultLote>> = {}) => {
  const defaults = defaultLote();
  return { ...defaults, ...overrides };
};

function defaultLote() {
  return {
    id: 1,
    id_payment_link: "link-1",
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

describe("getLoteDisponivelPaymentLink", () => {
  it("retorna o payment link do lote solicitado", () => {
    const lotes = [
      makeLote({ id: 1, id_payment_link: "link-1" }),
      makeLote({ id: 2, id_payment_link: "link-2" }),
    ];
    expect(getLoteDisponivelPaymentLink(lotes, 2)).toBe("link-2");
  });

  it("retorna null quando lote não existe", () => {
    const lotes = [makeLote({ id: 1 })];
    expect(getLoteDisponivelPaymentLink(lotes, 99)).toBeNull();
  });

  it("retorna null quando lote está esgotado", () => {
    const lotes = [makeLote({ id: 1, status: "esgotado" })];
    expect(getLoteDisponivelPaymentLink(lotes, 1)).toBeNull();
  });

  it("retorna null para array vazio", () => {
    expect(getLoteDisponivelPaymentLink([], 1)).toBeNull();
  });
});
