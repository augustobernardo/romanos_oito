/**
 * Testes para a lógica de geração de código de cupom.
 * Verifica formato sequencial VCMAISDOIS#XXXX.
 */
import { describe, it, expect } from "vitest";

// Reproduz a lógica de geração para teste isolado
const parseNextCode = (lastCode: string | null): string => {
  const prefix = "VCMAISDOIS#";
  let nextNum = 1;

  if (lastCode) {
    const numPart = parseInt(lastCode.replace(prefix, ""), 10);
    if (!isNaN(numPart)) nextNum = numPart + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, "0")}`;
};

describe("Geração de código de cupom", () => {
  it("gera VCMAISDOIS#0001 quando não há cupons", () => {
    expect(parseNextCode(null)).toBe("VCMAISDOIS#0001");
  });

  it("incrementa corretamente a partir do último código", () => {
    expect(parseNextCode("VCMAISDOIS#0005")).toBe("VCMAISDOIS#0006");
  });

  it("mantém formatação com 4 dígitos (zero à esquerda)", () => {
    expect(parseNextCode("VCMAISDOIS#0099")).toBe("VCMAISDOIS#0100");
  });

  it("funciona com código alto", () => {
    expect(parseNextCode("VCMAISDOIS#9999")).toBe("VCMAISDOIS#10000");
  });

  it("gera código com prefixo correto", () => {
    const code = parseNextCode("VCMAISDOIS#0001");
    expect(code.startsWith("VCMAISDOIS#")).toBe(true);
  });
});
