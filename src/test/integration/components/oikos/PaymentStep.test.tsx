/**
 * Tests for PaymentStep component (PIX only).
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentStep } from "@/components/oikos/PaymentStep";
import type { ComponentProps } from "react";

vi.mock("framer-motion", () => {
  const MotionDiv = ({ whileHover: _wh, whileTap: _wt, initial: _i, animate: _a, transition: _t, exit: _e, key: _k, ...props }: ComponentProps<"div"> & Record<string, unknown>) => (
    <div {...props} />
  );
  return {
    motion: { div: MotionDiv },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock("@/utils/pix", () => ({
  PIX_KEY: "test-pix-key-123",
  PIX_RECEIVER_NAME: "Test Receiver",
}));

vi.mock("@/assets/PIX_125_OIKOS.png", () => ({ default: "/mocked/PIX_125_OIKOS.png" }));
vi.mock("@/assets/PIX_135_OIKOS.png", () => ({ default: "/mocked/PIX_135_OIKOS.png" }));

describe("PaymentStep", () => {
  const defaultProps = {
    isEspecial: false,
    lotePreco: null,
    comprovantePreview: null,
    comprovanteFile: null,
    uploading: false,
    onPixPayment: vi.fn(),
    onFileChange: vi.fn(),
    onClearComprovante: vi.fn(),
    onBack: vi.fn(),
  };

  it("exibe PIX como método selecionado por padrão", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$125,00" />);
    expect(screen.getByAltText("QR Code PIX")).toBeInTheDocument();
  });

  it("exibe placeholder quando lotePreco é null", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByText(/Selecione um lote para visualizar o QRCode/i)).toBeInTheDocument();
    expect(screen.queryByAltText("QR Code PIX")).toBeNull();
  });

  it("exibe QRCode correto para valor 125 (preco R$125,00)", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$125,00" />);
    const img = screen.getByAltText("QR Code PIX") as HTMLImageElement;
    expect(img.src).toContain("PIX_125_OIKOS");
  });

  it("exibe QRCode correto para valor 135 (preco 135.00)", () => {
    render(<PaymentStep {...defaultProps} lotePreco="135.00" />);
    const img = screen.getByAltText("QR Code PIX") as HTMLImageElement;
    expect(img.src).toContain("PIX_135_OIKOS");
  });

  it("exibe fallback quando valor não tem QRCode mapeado", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$250,00" />);
    expect(screen.getByText(/QRCode não disponível para este lote/i)).toBeInTheDocument();
    expect(screen.queryByAltText("QR Code PIX")).toBeNull();
  });

  it("exibe botão de copiar chave PIX sem mostrar a chave no DOM", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$125,00" />);
    expect(screen.getByRole("button", { name: /copiar chave pix/i })).toBeInTheDocument();
    expect(screen.queryByText("test-pix-key-123")).toBeNull();
  });

  it("exibe nome do recebedor", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$125,00" />);
    expect(screen.getByText("Test Receiver")).toBeInTheDocument();
  });

  it("exibe botão de upload quando não há comprovante", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$125,00" />);
    expect(screen.getByText(/Clique para selecionar o comprovante/)).toBeInTheDocument();
  });

  it("exibe botão 'Finalizar pagamento' quando comprovante existe", () => {
    render(
      <PaymentStep
        {...defaultProps}
        lotePreco="R$125,00"
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
        lotePreco="R$125,00"
        comprovantePreview="data:image/png;base64,abc"
        comprovanteFile={new File([""], "test.png", { type: "image/png" })}
        uploading={true}
      />
    );
    expect(screen.getByText("Enviando...")).toBeInTheDocument();
  });

  it("chama onBack ao clicar no botão voltar", () => {
    const onBack = vi.fn();
    render(<PaymentStep {...defaultProps} onBack={onBack} lotePreco="R$125,00" />);
    fireEvent.click(screen.getByText("Voltar"));
    expect(onBack).toHaveBeenCalled();
  });

  it("mostra cabeçalho para pagamento via PIX", () => {
    render(<PaymentStep {...defaultProps} lotePreco="R$125,00" />);
    expect(screen.getByText(/pagamento via PIX/i)).toBeInTheDocument();
  });

  it("chama onPixPayment ao clicar em Finalizar pagamento", () => {
    const onPixPayment = vi.fn();
    render(
      <PaymentStep
        {...defaultProps}
        onPixPayment={onPixPayment}
        lotePreco="R$125,00"
        comprovantePreview="data:image/png;base64,abc"
        comprovanteFile={new File([""], "test.png", { type: "image/png" })}
      />
    );
    const buttons = screen.getAllByRole("button", { name: /finalizar pagamento/i });
    fireEvent.click(buttons[buttons.length - 1]);
    expect(onPixPayment).toHaveBeenCalled();
  });
});
