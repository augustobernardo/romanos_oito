import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOikosForm } from "@/components/oikos/useOikosForm";
import {
  InscricoesService,
  uploadComprovanteFile,
} from "@/services/inscricoes.service";

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
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

describe("useOikosForm - status de pagamento", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(InscricoesService.insertInscricao).mockResolvedValue({
      data: { id: "inscricao-1" },
      error: null,
    });
    vi.mocked(InscricoesService.updateComprovante).mockResolvedValue({
      error: null,
    });
    vi.mocked(uploadComprovanteFile).mockResolvedValue("comprovante.png");
  });

  it("salva pagamento por crédito sempre com status confirmado", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result);

    await act(async () => {
      await result.current.handleCreditPayment();
    });

    expect(InscricoesService.insertInscricao).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ nome: "Maria Oliveira" }),
      "credit",
      "confirmado",
      undefined,
      null,
    );
  });

  it("salva pagamento por PIX sempre com status confirmado", async () => {
    const { result } = renderHook(() => useOikosForm());
    fillRequiredForm(result);

    act(() => {
      result.current.handleFileChange({
        target: {
          files: [new File(["pix"], "pix.png", { type: "image/png" })],
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => expect(result.current.comprovanteFile).not.toBeNull());

    await act(async () => {
      await result.current.handlePixPayment();
    });

    expect(InscricoesService.insertInscricao).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ nome: "Maria Oliveira" }),
      "pix",
      "confirmado",
      undefined,
      null,
    );
  });
});
