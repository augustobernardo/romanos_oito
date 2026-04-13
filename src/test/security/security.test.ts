/**
 * Testes de segurança: verifica que o cliente Supabase unificado está sendo usado
 * e que não há padrões inseguros no código.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC_DIR = path.resolve(__dirname, "../../");

const findFilesWithPattern = (dir: string, pattern: RegExp, ext: string[]): string[] => {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.includes("node_modules") && entry.name !== "test") {
      results.push(...findFilesWithPattern(fullPath, pattern, ext));
    } else if (entry.isFile() && ext.some(e => entry.name.endsWith(e))) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (pattern.test(content)) {
        results.push(fullPath);
      }
    }
  }
  return results;
};

describe("Segurança - Padrões de código", () => {
  it("não deve existir cliente Supabase duplicado (utils/supabase.ts)", () => {
    const filePath = path.resolve(SRC_DIR, "utils/supabase.ts");
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("não deve importar de @/utils/supabase nos componentes", () => {
    const files = findFilesWithPattern(
      SRC_DIR,
      /from\s+["']@\/utils\/supabase["']/,
      [".ts", ".tsx"]
    );
    expect(files).toEqual([]);
  });

  it("não deve usar dangerouslySetInnerHTML em componentes customizados", () => {
    const files = findFilesWithPattern(
      SRC_DIR,
      /dangerouslySetInnerHTML/,
      [".tsx"]
    ).filter(f => !f.includes("/ui/")); // Exclui componentes de biblioteca (shadcn)
    expect(files).toEqual([]);
  });

  it("não deve ter console.log com dados sensíveis de auth", () => {
    const files = findFilesWithPattern(
      SRC_DIR,
      /console\.log.*(?:password|token|secret|api_key)/i,
      [".ts", ".tsx"]
    );
    expect(files).toEqual([]);
  });

  it("não deve armazenar role de admin em localStorage", () => {
    const files = findFilesWithPattern(
      SRC_DIR,
      /localStorage\.setItem\(.*(?:role|admin|isAdmin)/i,
      [".ts", ".tsx"]
    );
    expect(files).toEqual([]);
  });
});
