/**
 * Tests for PaymentStep component (PIX + Cartão cards with card_manual flow).
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentStep } from "@/components/oikos/PaymentStep";
import type { ComponentProps } from "react";

vi.mock("framer-motion", () => {
  const MotionDiv = ({ whileHover: _wh, whileTap: _wt, initial: _i, animate: _a, transition: _t, ...props }: ComponentProps<"div"> & Record<string, unknown>) => (
    <div {...props} />
  );
  return {
    motion: { div: MotionDiv },
  };
});

vi.mock("@/utils/pix", () => ({
  PIX_KEY: "test-pix-key-123",
  PIX_RECEIVER_NAME: "Test Receiver",
}));

vi.mock("@/assets/qr_code_pix.png", () => ({
  default: "mocked-qr.png",
}));

describe("PaymentStep", () => {
  const defaultProps = {
    isEspecial: false,
    comprovantePreview: null,
    comprovanteFile: null,
    uploading: false,
    cupomInfo: null,
    onPixPayment: vi.fn(),
    onCardManualPayment: vi.fn(),
    onFileChange: vi.fn(),
    onClearComprovante: vi.fn(),
    onBack: vi.fn(),
  };

  it("exibe PIX como método selecionado por padrão", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByAltText("QR Code PIX")).toBeInTheDocument();
  });

  it("exibe grid com dois cards: PIX e Cartão", () => {
    const { container } = render(<PaymentStep {...defaultProps} />);
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
    expect(screen.getByText("PIX")).toBeInTheDocument();
    expect(screen.getByText("Cartão")).toBeInTheDocument();
  });

  it("exibe botão de copiar chave PIX sem mostrar a chave no DOM", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByRole("button", { name: /copiar chave pix/i })).toBeInTheDocument();
    expect(screen.queryByText("test-pix-key-123")).toBeNull();
  });

  it("exibe nome do recebedor", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByText("Test Receiver")).toBeInTheDocument();
  });

  it("ao selecionar Cartão, exibe info SAC e botão de continuar", () => {
    render(<PaymentStep {...defaultProps} />);
    fireEvent.click(screen.getByText("Cartão"));
    expect(screen.getByText(/Após finalizar sua inscrição/i)).toBeInTheDocument();
    expect(screen.getByText("Falar com SAC no WhatsApp")).toBeInTheDocument();
    expect(screen.getByText(/Continuar com pagamento em cartão/i)).toBeInTheDocument();
  });

  it("chama onCardManualPayment ao clicar em Continuar", () => {
    const onCardManualPayment = vi.fn();
    render(<PaymentStep {...defaultProps} onCardManualPayment={onCardManualPayment} />);
    fireEvent.click(screen.getByText("Cartão"));
    fireEvent.click(screen.getByText(/Continuar com pagamento em cartão/i));
    expect(onCardManualPayment).toHaveBeenCalled();
  });

  it("exibe botão de upload quando não há comprovante (PIX selecionado)", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByText(/Clique para selecionar o comprovante/)).toBeInTheDocument();
  });

  it("exibe botão 'Finalizar pagamento' quando comprovante existe", () => {
    render(
      <PaymentStep
        {...defaultProps}
        comprovantePreview="data:image/png;base64,abc"
        comprovanteFile={new File([""], "test.png", { type: "image/png" })}
      />
    );
    expect(screen.getAllByText("Finalizar pagamento").length).toBeGreaterThan(0);
  });

  it("exibe 'Enviando...' quando uploading é true", () => {
    render(
      <PaymentStep
        {...defaultProps}
        comprovantePreview="data:image/png;base64,abc"
        comprovanteFile={new File([""], "test.png", { type: "image/png" })}
        uploading={true}
      />
    );
    expect(screen.getByText("Enviando...")).toBeInTheDocument();
  });

  it("chama onBack ao clicar no botão voltar", () => {
    const onBack = vi.fn();
    render(<PaymentStep {...defaultProps} onBack={onBack} />);
    fireEvent.click(screen.getByText("Voltar"));
    expect(onBack).toHaveBeenCalled();
  });

  it("mostra cabeçalho para escolha de pagamento", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByText(/escolha a forma de pagamento/i)).toBeInTheDocument();
  });

  it("chama onPixPayment ao clicar em Finalizar pagamento", () => {
    const onPixPayment = vi.fn();
    render(
      <PaymentStep
        {...defaultProps}
        onPixPayment={onPixPayment}
        comprovantePreview="data:image/png;base64,abc"
        comprovanteFile={new File([""], "test.png", { type: "image/png" })}
      />
    );
    const buttons = screen.getAllByRole("button", { name: /finalizar pagamento/i });
    fireEvent.click(buttons[buttons.length - 1]);
    expect(onPixPayment).toHaveBeenCalled();
  });

  it("ao selecionar Cartão, esconde a seção PIX", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByAltText("QR Code PIX")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cartão"));
    expect(screen.queryByAltText("QR Code PIX")).toBeNull();
  });

  it("ao voltar para PIX, exibe o QR code novamente", () => {
    render(<PaymentStep {...defaultProps} />);
    fireEvent.click(screen.getByText("Cartão"));
    expect(screen.queryByAltText("QR Code PIX")).toBeNull();
    fireEvent.click(screen.getByText("PIX"));
    expect(screen.getByAltText("QR Code PIX")).toBeInTheDocument();
  });
});
