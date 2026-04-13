/**
 * Testes para utilitários de telefone (validação e formatação)
 */
import { describe, it, expect } from "vitest";
import { isValidPhone, formatPhone } from "@/utils/phoneUtils";

describe("isValidPhone", () => {
  it("aceita telefone com 10 dígitos (fixo)", () => {
    expect(isValidPhone("1134567890")).toBe(true);
  });

  it("aceita telefone com 11 dígitos (celular)", () => {
    expect(isValidPhone("11912345678")).toBe(true);
  });

  it("aceita telefone formatado", () => {
    expect(isValidPhone("(11) 91234-5678")).toBe(true);
  });

  it("rejeita telefone com menos de 10 dígitos", () => {
    expect(isValidPhone("123456789")).toBe(false);
  });

  it("rejeita telefone com mais de 11 dígitos", () => {
    expect(isValidPhone("123456789012")).toBe(false);
  });

  it("aceita string vazia (campo opcional)", () => {
    expect(isValidPhone("")).toBe(true);
  });
});

describe("formatPhone", () => {
  it("formata celular com 11 dígitos", () => {
    expect(formatPhone("11912345678")).toBe("(11) 91234-5678");
  });

  it("formata fixo com 10 dígitos", () => {
    expect(formatPhone("1134567890")).toBe("(11) 3456-7890");
  });

  it("retorna string vazia para input vazio", () => {
    expect(formatPhone("")).toBe("");
  });

  it("remove caracteres não numéricos antes de formatar", () => {
    expect(formatPhone("(11) 91234-5678")).toBe("(11) 91234-5678");
  });

  it("limita a 11 dígitos", () => {
    expect(formatPhone("119123456789999")).toBe("(11) 91234-5678");
  });
});
