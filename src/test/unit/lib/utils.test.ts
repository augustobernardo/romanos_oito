/**
 * Tests for lib/utils.ts — formatNamesString, formatNamesStringsInscricao.
 * cn, createUniqueKey, and getUniqueRecentInscricoes are already tested in utils/utils.test.ts
 */
import { describe, it, expect } from "vitest";
import { formatNamesString, formatNamesStringsInscricao, columnLabels } from "@/lib/utils";

describe("formatNamesString", () => {
  it("capitaliza a primeira letra de cada palavra", () => {
    expect(formatNamesString("joão da silva")).toBe("João Da Silva");
  });

  it("lida com string toda em maiúsculas", () => {
    expect(formatNamesString("JOÃO SILVA")).toBe("João Silva");
  });

  it("lida com string vazia", () => {
    expect(formatNamesString("")).toBe("");
  });

  it("mantém acentuação", () => {
    expect(formatNamesString("maria josé de souza")).toBe("Maria José De Souza");
  });
});

describe("formatNamesStringsInscricao", () => {
  it("formata nome, comunidade e cidade_estado", () => {
    const inscricoes = [
      {
        nome: "JOÃO SILVA",
        comunidade: "paróquia são josé",
        cidade_estado: "são paulo - sp",
      },
    ] as any[];
    const result = formatNamesStringsInscricao(inscricoes);
    expect(result[0].nome).toBe("João Silva");
    expect(result[0].comunidade).toBe("Paróquia São José");
    expect(result[0].cidade_estado).toBe("São Paulo - Sp");
  });

  it("não modifica outros campos", () => {
    const inscricoes = [
      {
        nome: "maria",
        telefone: "11912345678",
        instagram: "@maria",
        comunidade: "igreja",
        cidade_estado: "rio - rj",
      },
    ] as any[];
    const result = formatNamesStringsInscricao(inscricoes);
    expect(result[0].telefone).toBe("11912345678");
    expect(result[0].instagram).toBe("@maria");
  });

  it("retorna array vazio para input vazio", () => {
    expect(formatNamesStringsInscricao([])).toEqual([]);
  });
});

describe("columnLabels", () => {
  it("contém labels para colunas principais", () => {
    expect(columnLabels["nome"]).toBeDefined();
    expect(columnLabels["telefone"]).toBeDefined();
    expect(columnLabels["status"]).toBeDefined();
    expect(columnLabels["created_at"]).toBeDefined();
  });

  it("possui labels em português para todas as colunas", () => {
    for (const [key, label] of Object.entries(columnLabels)) {
      expect(label.length).toBeGreaterThan(0);
      expect(typeof label).toBe("string");
    }
  });
});
