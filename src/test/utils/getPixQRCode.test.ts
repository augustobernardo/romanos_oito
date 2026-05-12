import { describe, it, expect, vi } from "vitest";
import { extractNumericValue, getPixQRCode } from "@/utils/getPixQRCode";

vi.mock("@/assets/PIX_125_OIKOS.png", () => ({ default: "/mocked/PIX_125_OIKOS.png" }));
vi.mock("@/assets/PIX_135_OIKOS.png", () => ({ default: "/mocked/PIX_135_OIKOS.png" }));

describe("extractNumericValue", () => {
  it("extrai valor de formato brasileiro (R$125,00)", () => {
    expect(extractNumericValue("R$125,00")).toBe(125);
  });

  it("extrai valor de formato com ponto (150.00)", () => {
    expect(extractNumericValue("150.00")).toBe(150);
  });

  it("extrai valor de formato R$ 1.250,50", () => {
    expect(extractNumericValue("R$ 1.250,50")).toBe(1250.5);
  });

  it("retorna null para string vazia", () => {
    expect(extractNumericValue("")).toBeNull();
  });

  it("retorna null para string sem números", () => {
    expect(extractNumericValue("abc")).toBeNull();
  });

  it("retorna null para valor zero", () => {
    expect(extractNumericValue("R$0,00")).toBeNull();
  });
});

describe("getPixQRCode", () => {
  it("retorna caminho da imagem para valor 125", () => {
    const result = getPixQRCode("R$125,00");
    expect(result).toBe("/mocked/PIX_125_OIKOS.png");
  });

  it("retorna caminho da imagem para valor 135", () => {
    const result = getPixQRCode("135.00");
    expect(result).toBe("/mocked/PIX_135_OIKOS.png");
  });

  it("retorna null para valor sem mapeamento (ex: 250)", () => {
    const result = getPixQRCode("R$250,00");
    expect(result).toBeNull();
  });

  it("retorna null para preco inválido", () => {
    const result = getPixQRCode("");
    expect(result).toBeNull();
  });

  it("retorna null para preco que extrai para zero", () => {
    const result = getPixQRCode("R$0,00");
    expect(result).toBeNull();
  });
});
