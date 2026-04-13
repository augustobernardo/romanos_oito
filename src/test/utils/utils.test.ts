/**
 * Testes para funções utilitárias (cn, createUniqueKey, getUniqueRecentInscricoes)
 */
import { describe, it, expect } from "vitest";
import { cn, createUniqueKey, getUniqueRecentInscricoes } from "@/lib/utils";

describe("cn (className merge)", () => {
  it("combina classes simples", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("resolve conflitos do tailwind", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("lida com valores condicionais", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
});

describe("createUniqueKey", () => {
  it("cria chave única normalizada por nome e telefone", () => {
    const inscricao = { nome: " João Silva ", telefone: " 11999999999 " } as any;
    expect(createUniqueKey(inscricao)).toBe("joão silva_11999999999");
  });
});

describe("getUniqueRecentInscricoes", () => {
  it("retorna apenas a inscrição mais recente por chave única", () => {
    const inscricoes = [
      { nome: "João", telefone: "11999", created_at: "2026-01-01T00:00:00Z" },
      { nome: "João", telefone: "11999", created_at: "2026-01-02T00:00:00Z" },
      { nome: "Maria", telefone: "11888", created_at: "2026-01-01T00:00:00Z" },
    ] as any[];

    const result = getUniqueRecentInscricoes(inscricoes);
    expect(result).toHaveLength(2);
    
    const joao = result.find((r: any) => r.nome === "João");
    expect(joao?.created_at).toBe("2026-01-02T00:00:00Z");
  });

  it("retorna array vazio para input vazio", () => {
    expect(getUniqueRecentInscricoes([])).toEqual([]);
  });
});
