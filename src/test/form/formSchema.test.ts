/**
 * Testes de validação do schema Zod do formulário de inscrição.
 * Cobre campos obrigatórios, limites, e regras condicionais.
 */
import { describe, it, expect } from "vitest";
import { formSchema } from "@/components/form/types";

const validData = {
  nome: "João da Silva",
  dataNascimento: "2000-01-01",
  telefone: "11912345678",
  instagram: "@joao",
  comunidade: "Paróquia São José",
  cidadeEstado: "São Paulo - SP",
  enderecoCompleto: "Rua das Flores, 123",
  comoConheceu: "amigo",
  nomeMae: "Maria da Silva",
  numeroMae: "11912345678",
  nomePai: "José da Silva",
  numeroPai: "11912345678",
  isCatolico: "sim",
  participaMovimento: "Comunidade Vida",
  fezRetiro: "sim",
  nomePessoaEmergencia: "Ana Santos",
  grauParentescoEmergencia: "Mãe",
  numeroEmergencia: "11912345678",
  tamanhoCamisa: "M",
  cienteTrocaCamisa: true,
};

describe("formSchema - validação", () => {
  it("aceita dados válidos completos", () => {
    const result = formSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejeita nome com menos de 3 caracteres", () => {
    const result = formSchema.safeParse({ ...validData, nome: "Jo" });
    expect(result.success).toBe(false);
  });

  it("rejeita nome com números", () => {
    const result = formSchema.safeParse({ ...validData, nome: "João123" });
    expect(result.success).toBe(false);
  });

  it("rejeita telefone inválido", () => {
    const result = formSchema.safeParse({ ...validData, telefone: "123" });
    expect(result.success).toBe(false);
  });

  it("rejeita sem data de nascimento", () => {
    const result = formSchema.safeParse({ ...validData, dataNascimento: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita sem tamanho de camisa", () => {
    const result = formSchema.safeParse({ ...validData, tamanhoCamisa: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita quando cienteTrocaCamisa é false", () => {
    const result = formSchema.safeParse({ ...validData, cienteTrocaCamisa: false });
    expect(result.success).toBe(false);
  });

  it("exige comoConheceuOutro quando comoConheceu é 'outro'", () => {
    const result = formSchema.safeParse({
      ...validData,
      comoConheceu: "outro",
      comoConheceuOutro: "",
    });
    expect(result.success).toBe(false);
  });

  it("aceita comoConheceu 'outro' com explicação", () => {
    const result = formSchema.safeParse({
      ...validData,
      comoConheceu: "outro",
      comoConheceuOutro: "Vi no Facebook",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita endereço muito curto", () => {
    const result = formSchema.safeParse({ ...validData, enderecoCompleto: "Rua" });
    expect(result.success).toBe(false);
  });

  it("aceita número de emergência válido", () => {
    const result = formSchema.safeParse({ ...validData, numeroEmergencia: "(11) 91234-5678" });
    expect(result.success).toBe(true);
  });
});
