import { describe, expect, it, vi } from "vitest";
import { attachEncontristasToCuponsServo } from "@/services/cuponsServo.service";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe("attachEncontristasToCuponsServo", () => {
  it("preenche o nome do encontrista que utilizou o cupom servo", () => {
    const result = attachEncontristasToCuponsServo(
      [
        {
          id: "cupom-1",
          codigo: "SERVOAMIGO#001",
          nome_servo: "Servo 1",
          ativo: false,
          created_at: "2026-04-27T00:00:00.000Z",
        },
      ],
      [{ codigo_servo: "SERVOAMIGO#001", nome: "Maria Encontrista" }],
    );

    expect(result[0].nome_encontrista).toBe("Maria Encontrista");
  });

  it("mantém vazio quando o cupom ainda não foi utilizado", () => {
    const result = attachEncontristasToCuponsServo(
      [
        {
          id: "cupom-2",
          codigo: "SERVOAMIGO#002",
          nome_servo: "Servo 2",
          ativo: true,
          created_at: "2026-04-27T00:00:00.000Z",
        },
      ],
      [],
    );

    expect(result[0].nome_encontrista).toBeNull();
  });
});
