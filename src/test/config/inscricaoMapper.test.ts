/**
 * Tests for the inscricaoMapper: calculateAge and mapFormToInscricao.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateAge, mapFormToInscricao } from "@/config/inscricaoMapper";

describe("calculateAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("calcula idade correta para aniversário já passado", () => {
    vi.setSystemTime(new Date(2026, 3, 15)); // April 15, 2026
    expect(calculateAge("1990-03-10")).toBe(36);
  });

  it("calcula idade para aniversário ainda não ocorrido no ano", () => {
    vi.setSystemTime(new Date(2026, 3, 15)); // April 15, 2026
    expect(calculateAge("1990-05-20")).toBe(35);
  });

  it("calcula idade para aniversário no mesmo dia", () => {
    vi.setSystemTime(new Date(2026, 3, 15)); // April 15, 2026
    expect(calculateAge("2000-04-15")).toBe(26);
  });

  it("calcula zero para recém-nascido", () => {
    vi.setSystemTime(new Date(2026, 0, 1)); // Jan 1, 2026
    expect(calculateAge("2025-12-30")).toBe(0);
  });
});

describe("mapFormToInscricao", () => {
  const validFormData = {
    nome: "Maria Oliveira",
    dataNascimento: "1995-06-20",
    telefone: "11912345678",
    instagram: "@maria",
    comunidade: "Paróquia São José",
    cidadeEstado: "São Paulo - SP",
    enderecoCompleto: "Rua das Flores, 123",
    comoConheceu: "amigo",
    comoConheceuOutro: "",
    nomeMae: "Ana Oliveira",
    numeroMae: "11912345678",
    nomePai: "Carlos Oliveira",
    numeroPai: "11912345678",
    numeroResponsavelProximo: "",
    isCatolico: "sim",
    isCatolicoOutro: "",
    participaMovimento: "Comunidade Vida",
    fezRetiro: "sim",
    fezRetiroOutro: "",
    nomePessoaEmergencia: "João Silva",
    grauParentescoEmergencia: "Irmão",
    numeroEmergencia: "11912345678",
    tamanhoCamisa: "M",
    expectativaOikos: "Crescer na fé",
  };

  it("mapeia todos os campos corretamente", () => {
    const result = mapFormToInscricao(1, validFormData, "pix", "processando");
    expect(result.nome).toBe("Maria Oliveira");
    expect(result.telefone).toBe("11912345678");
    expect(result.comunidade).toBe("Paróquia São José");
    expect(result.cidade_estado).toBe("São Paulo - SP");
    expect(result.tamanho_camisa).toBe("M");
    expect(result.metodo_pagamento).toBe("pix");
    expect(result.status).toBe("processando");
    expect(result.lote_especial).toBe(false);
    expect(result.titular_especial).toBeNull();
    expect(result.comprovante_url).toBeNull();
  });

  it("remove caracteres não numéricos do telefone", () => {
    const result = mapFormToInscricao(1, {
      ...validFormData,
      telefone: "(11) 91234-5678",
    }, "pix", "processando");
    expect(result.telefone).toBe("11912345678");
  });

  it("define lote_especial como true para método cupom", () => {
    const result = mapFormToInscricao(1, validFormData, "cupom", "confirmado");
    expect(result.lote_especial).toBe(true);
  });

  it("define lote_especial como false para método credit", () => {
    const result = mapFormToInscricao(1, validFormData, "credit", "confirmado");
    expect(result.lote_especial).toBe(false);
  });

  it("define campos de titular e comprovante quando cupomInfo é fornecido", () => {
    const cupomInfo = {
      nomeTitular: "João Silva",
      comprovanteUrl: "cupons/comprovante.jpg",
    };
    const result = mapFormToInscricao(1, validFormData, "cupom", "confirmado", cupomInfo);
    expect(result.titular_especial).toBe("João Silva");
    expect(result.comprovante_url).toBe("cupons/comprovante.jpg");
  });

  it("usa null para campos opcionais vazios", () => {
    const result = mapFormToInscricao(1, validFormData, "pix", "processando");
    expect(result.como_conheceu_outro).toBeNull();
    expect(result.is_catolico_outro).toBeNull();
    expect(result.fez_retiro_outro).toBeNull();
    expect(result.numero_responsavel_proximo).toBeNull();
    expect(result.expectativa_oikos).toBe("Crescer na fé");
  });

  it("define idade corretamente baseado na data de nascimento", () => {
    const result = mapFormToInscricao(1, validFormData, "pix", "processando");
    expect(result.idade).toBeGreaterThan(0);
  });
});
