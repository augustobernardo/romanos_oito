/**
 * Tests for lib/storage.ts — file path extraction, URL parsing.
 * Does NOT test actual Supabase storage calls (requires real bucket).
 */
import { describe, it, expect } from "vitest";
import { extractFilePathFromUrl } from "@/lib/storage";

describe("extractFilePathFromUrl", () => {
  it("extrai o nome do arquivo de uma URL completa", () => {
    const url = "https://example.com/storage/bucket/comprovante_123.jpg";
    expect(extractFilePathFromUrl(url)).toBe("comprovante_123.jpg");
  });

  it("extrai o nome do arquivo com múltiplos níveis de path", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/bucket/folder/file.png";
    expect(extractFilePathFromUrl(url)).toBe("file.png");
  });

  it("lida com URL contendo query params", () => {
    const url = "https://example.com/storage/file.jpg?token=abc123";
    expect(extractFilePathFromUrl(url)).toBe("file.jpg");
  });

  it("retorna string vazia para URL vazia", () => {
    expect(extractFilePathFromUrl("")).toBe("");
  });

  it("retorna último segmento para URL sem caminho", () => {
    const url = "https://example.com";
    expect(extractFilePathFromUrl(url)).toBe("");
  });
});
