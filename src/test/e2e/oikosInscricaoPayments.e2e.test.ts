import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOikosForm } from "@/components/oikos/useOikosForm";
import { mapFormToInscricao } from "@/config/inscricaoMapper";
import {
  InscricoesService,
  uploadComprovanteFile,
} from "@/services/inscricoes.service";
import { CuponsServoService } from "@/services/cuponsServo.service";

const toastMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock("@/hooks/useLotes", () => ({
  useLotes: () => ({
    lotes: [{ id: 1, is_especial: false, id_payment_link: null }],
    loading: false,
  }),
  getLoteDisponivel: () => 1,
  getLoteDisponivelPaymentLink: () => null,
}));

vi.mock("@/services/inscricoes.service", () => ({
  InscricoesService: {
    insertInscricao: vi.fn(),
    updateComprovante: vi.fn(),
  },
  uploadComprovanteFile: vi.fn(),
}));

vi.mock("@/services/cuponsServo.service", () => ({
  CuponsServoService: {
    validar: vi.fn(),
  },
}));

type HookResult = ReturnType<typeof renderHook<ReturnType<typeof useOikosForm>, never>>["result"];

const fillRequiredForm = (hook: HookResult, nome = "Maria Oliveira") => {
  act(() => {
    hook.current.form.reset({
      nome,
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
      cienteTrocaCamisa: true,
      expectativaOikos: "Crescer na fé",
    });
    hook.current.setLoteSelecionado(1);
  });
};

const validateServoCoupon = async (hook: HookResult, codigo = "SERVOAMIGO#001") => {
  vi.mocked(CuponsServoService.validar).mockResolvedValueOnce({
    data: { valid: true, codigo, nome_servo: "Servo Teste" },
    error: null,
  });

  act(() => {
    hook.current.setCupomServoCode(codigo);
  });

  await act(async () => {
    await hook.current.handleCupomServoValidation();
  });
};

const insertWithAtomicServoDeactivation = vi.fn(
  async (
    loteId: number,
    formData: Parameters<typeof InscricoesService.insertInscricao>[1],
    method: "credit" | "pix" | "cupom",
    status: string,
    cupomInfo?: Parameters<typeof InscricoesService.insertInscricao>[4],
    codigoServo?: string | null,
  ) => {
    const row = mapFormToInscricao(loteId, formData, method, status, cupomInfo, codigoServo);

    if (codigoServo) {
      const cupom = servoCoupons.get(codigoServo);
      if (!cupom) return { data: null, error: new Error("Cupom Servo Amigo não encontrado") };
      if (!cupom.ativo) {
        return {
          data: null,
          error: new Error("Cupom Servo Amigo já foi utilizado ou está inativo"),
        };
      }
      servoCoupons.set(codigoServo, { ...cupom, ativo: false });
    }

    inscricoes.push(row);
    return { data: { id: `inscricao-${inscricoes.length}`, ...row }, error: null };
  },
);

const servoCoupons = new Map<string, { ativo: boolean }>();
const inscricoes: ReturnType<typeof mapFormToInscricao>[] = [];

describe("E2E - inscrição OIKOS com pagamentos e cupom SERVOAMIGO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    servoCoupons.clear();
    inscricoes.length = 0;
    vi.mocked(InscricoesService.insertInscricao).mockImplementation(
      insertWithAtomicServoDeactivation,
    );
    vi.mocked(InscricoesService.updateComprovante).mockResolvedValue({ error: null });
    vi.mocked(uploadComprovanteFile).mockResolvedValue("comprovante-pix.png");
  });

  it("simula inscrição com crédito e mantém o status final como confirmado", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result);

    await act(async () => {
      await result.current.handleCreditPayment();
    });

    expect(inscricoes).toHaveLength(1);
    expect(inscricoes[0]).toMatchObject({
      metodo_pagamento: "credit",
      status: "confirmado",
      nome: "Maria Oliveira",
    });
    expect(result.current.currentStep).toBe("confirmation");
  });

  it("simula inscrição com PIX, upload do comprovante e mantém o status final como confirmado", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result);

    act(() => {
      result.current.handleFileChange({
        target: { files: [new File(["pix"], "pix.png", { type: "image/png" })] },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => expect(result.current.comprovanteFile).not.toBeNull());

    await act(async () => {
      await result.current.handlePixPayment();
    });

    expect(inscricoes).toHaveLength(1);
    expect(inscricoes[0]).toMatchObject({
      metodo_pagamento: "pix",
      status: "confirmado",
      nome: "Maria Oliveira",
    });
    expect(uploadComprovanteFile).toHaveBeenCalledWith(expect.any(File), "inscricao-1");
    expect(InscricoesService.updateComprovante).toHaveBeenCalledWith(
      "inscricao-1",
      "comprovante-pix.png",
    );
    expect(result.current.currentStep).toBe("confirmation");
  });

  it("inativa atomicamente o cupom SERVOAMIGO ao inserir a inscrição e bloqueia reuso", async () => {
    const codigoServo = "SERVOAMIGO#001";
    servoCoupons.set(codigoServo, { ativo: true });

    const primeiraInscricao = renderHook(() => useOikosForm());
    fillRequiredForm(primeiraInscricao.result, "Primeira Encontrista");
    await validateServoCoupon(primeiraInscricao.result, codigoServo);

    await act(async () => {
      await primeiraInscricao.result.current.handleCreditPayment();
    });

    expect(inscricoes).toHaveLength(1);
    expect(inscricoes[0]).toMatchObject({
      codigo_servo: codigoServo,
      metodo_pagamento: "credit",
      status: "confirmado",
    });
    expect(servoCoupons.get(codigoServo)?.ativo).toBe(false);

    const segundaInscricao = renderHook(() => useOikosForm());
    fillRequiredForm(segundaInscricao.result, "Segunda Encontrista");
    await validateServoCoupon(segundaInscricao.result, codigoServo);

    await act(async () => {
      await segundaInscricao.result.current.handleCreditPayment();
    });

    expect(inscricoes).toHaveLength(1);
    expect(segundaInscricao.result.current.currentStep).toBe("payment");
    expect(insertWithAtomicServoDeactivation).toHaveBeenLastCalledWith(
      1,
      expect.objectContaining({ nome: "Segunda Encontrista" }),
      "credit",
      "confirmado",
      undefined,
      codigoServo,
    );
  });

  it("bloqueia inscrição com cupom SERVOAMIGO inexistente e exibe a mensagem correta", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result, "Cupom Inexistente");

    act(() => {
      result.current.setCurrentStep("cupom_servo");
    });

    vi.mocked(CuponsServoService.validar).mockResolvedValueOnce({
      data: { valid: false, error: "Cupom não encontrado ou inativo" },
      error: null,
    });

    act(() => {
      result.current.setCupomServoCode("SERVOAMIGO#999");
    });

    await act(async () => {
      await result.current.handleCupomServoValidation();
    });

    expect(result.current.currentStep).toBe("cupom_servo");
    expect(InscricoesService.insertInscricao).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({
      title: "Código inválido",
      description: "Cupom não encontrado ou inativo",
      variant: "destructive",
    });
  });

  it("bloqueia inscrição com cupom SERVOAMIGO em formato diferente e exibe a mensagem correta", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result, "Formato Inválido");

    act(() => {
      result.current.setCurrentStep("cupom_servo");
    });

    vi.mocked(CuponsServoService.validar).mockResolvedValueOnce({
      data: { valid: false, error: "Cupom não encontrado ou inativo" },
      error: null,
    });

    act(() => {
      result.current.setCupomServoCode("SERVO-AMIGO-001");
    });

    await act(async () => {
      await result.current.handleCupomServoValidation();
    });

    expect(CuponsServoService.validar).toHaveBeenCalledWith("SERVO-AMIGO-001");
    expect(result.current.currentStep).toBe("cupom_servo");
    expect(InscricoesService.insertInscricao).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith({
      title: "Código inválido",
      description: "Cupom não encontrado ou inativo",
      variant: "destructive",
    });
  });
});