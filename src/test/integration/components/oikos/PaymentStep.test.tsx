/**
 * Tests for PaymentStep component.
 * Verifies payment method selection, PIX flow, and comprovante preview.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentStep } from "@/components/oikos/PaymentStep";

// Minimal framer-motion mock - strip animation props
vi.mock("framer-motion", () => {
  const MotionDiv = ({ children, whileHover, whileTap, initial, animate, transition, ...props }: any) => (
    <div {...props}>{children}</div>
  );
  return {
    motion: { div: MotionDiv },
  };
});

vi.mock("@/utils/stripe", () => ({
  PIX_KEY: "test-pix-key",
  PIX_RECEIVER_NAME: "Test Receiver",
}));

vi.mock("@/assets/qr_code_pix.png", () => ({
  default: "mocked-qr.png",
}));

describe("PaymentStep", () => {
  const defaultProps = {
    isEspecial: false,
    paymentMethod: null as "credit" | "pix" | "cupom" | null,
    comprovantePreview: null,
    comprovanteFile: null,
    uploading: false,
    cupomInfo: null,
    onSelectMethod: vi.fn(),
    onCreditPayment: vi.fn(),
    onCupomPayment: vi.fn(),
    onPixPayment: vi.fn(),
    onCopyPixKey: vi.fn(),
    onFileChange: vi.fn(),
    onClearComprovante: vi.fn(),
    onBack: vi.fn(),
  };

  it("exibe opções de Cartão e PIX", () => {
    render(<PaymentStep {...defaultProps} />);
    expect(screen.getByText("Cartão de Crédito")).toBeInTheDocument();
    expect(screen.getByText("PIX")).toBeInTheDocument();
  });

  it("chama onSelectMethod ao clicar em Cartão de Crédito", () => {
    const onSelectMethod = vi.fn();
    render(<PaymentStep {...defaultProps} onSelectMethod={onSelectMethod} />);
    fireEvent.click(screen.getByText("Cartão de Crédito"));
    expect(onSelectMethod).toHaveBeenCalledWith("credit");
  });

  it("chama onSelectMethod ao clicar em PIX", () => {
    const onSelectMethod = vi.fn();
    render(<PaymentStep {...defaultProps} onSelectMethod={onSelectMethod} />);
    fireEvent.click(screen.getByText("PIX"));
    expect(onSelectMethod).toHaveBeenCalledWith("pix");
  });

  it("exibe QR Code quando método é pix", () => {
    render(<PaymentStep {...defaultProps} paymentMethod="pix" />);
    expect(screen.getByAltText("QR Code PIX")).toBeInTheDocument();
  });

  it("exibe botão de upload quando não há comprovante", () => {
    render(<PaymentStep {...defaultProps} paymentMethod="pix" />);
    expect(screen.getByText(/Clique para selecionar o comprovante/)).toBeInTheDocument();
  });

  it("exibe botão 'Finalizar pagamento' quando comprovante existe", () => {
    render(
      <PaymentStep
        {...defaultProps}
        paymentMethod="pix"
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
        paymentMethod="pix"
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

  it("mostra apenas 'Voltar' independente de isEspecial", () => {
    render(<PaymentStep {...defaultProps} isEspecial={true} />);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });
});
