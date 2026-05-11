import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOikosForm } from "@/components/oikos/useOikosForm";
import {
  InscricoesService,
} from "@/services/inscricoes.service";

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/hooks/useLotes", () => ({
  useLotes: () => ({
    lotes: [{ id: 1, is_especial: false }],
    loading: false,
  }),
  getLoteDisponivel: () => 1,
}));

vi.mock("@/services/inscricoes.service", () => ({
  InscricoesService: {
    insertInscricao: vi.fn(),
    updateComprovante: vi.fn(),
  },
  uploadComprovanteFile: vi.fn(),
}));

const fillRequiredForm = (
  hook: ReturnType<
    typeof renderHook<ReturnType<typeof useOikosForm>, never>
  >["result"],
) => {
  act(() => {
    hook.current.form.reset({
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
      cienteTrocaCamisa: true,
      expectativaOikos: "Crescer na fé",
    });
    hook.current.setLoteSelecionado(1);
  });
};

describe("useOikosForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(InscricoesService.insertInscricao).mockResolvedValue({
      data: { id: "inscricao-1" },
      error: null,
    });
    vi.mocked(InscricoesService.updateComprovante).mockResolvedValue({
      error: null,
    });
  });

  it("salva pagamento por card_manual com status pending", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result);

    await act(async () => {
      await result.current.handleCardManualPayment();
    });

    expect(InscricoesService.insertInscricao).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ nome: "Maria Oliveira" }),
      "card_manual",
      "pending",
      undefined,
      null,
    );
    expect(result.current.currentStep).toBe("confirmation");
    expect(result.current.paymentMethodUsed).toBe("card_manual");
  });
});
