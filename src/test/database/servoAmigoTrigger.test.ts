import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve(
    process.cwd(),
    "supabase/migrations/20260427220742_9bac1155-e4c6-4f59-966d-f630b1d5f468.sql",
  ),
  "utf8",
).replace(/\s+/g, " ");

describe("trigger inativar_cupom_servo_ao_inscrever", () => {
  it("bloqueia o cupom SERVOAMIGO com lock de linha antes de inserir a inscrição", () => {
    expect(migration).toContain(
      "CREATE OR REPLACE FUNCTION public.inativar_cupom_servo_ao_inscrever()",
    );
    expect(migration).toContain("WHERE codigo = NEW.codigo_servo FOR UPDATE");
    expect(migration).toContain("BEFORE INSERT ON public.inscricoes");
    expect(migration).toContain(
      "EXECUTE FUNCTION public.inativar_cupom_servo_ao_inscrever()",
    );
  });

  it("inativa o cupom na mesma transação e rejeita cupom inexistente ou já inativo", () => {
    expect(migration).toContain("IF NOT FOUND THEN RAISE EXCEPTION");
    expect(migration).toContain("IF _cupom.ativo = false THEN RAISE EXCEPTION");
    expect(migration).toContain("UPDATE public.cupons_servo SET ativo = false");
    expect(migration).toContain("WHERE id = _cupom.id");
  });
});
