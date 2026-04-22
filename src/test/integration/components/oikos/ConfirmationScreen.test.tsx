/**
 * Tests for ConfirmationScreen component.
 * Verifies messages for each payment method.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmationScreen } from "@/components/oikos/ConfirmationScreen";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe("ConfirmationScreen", () => {
  it("exibe mensagem de comprovante enviado para PIX", () => {
    render(<ConfirmationScreen paymentMethod="pix" />);
    expect(screen.getByText("Comprovante enviado!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seu comprovante foi enviado com sucesso para nossa equipe.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seja bem-vindo ao melhor fim de semana da sua vida. Dúvidas? Entre em contato com SAC (33) 99842-7416. Tmj, ehnois! Romanos Oito",
      ),
    ).toBeInTheDocument();
  });

  it("exibe mensagem de inscrição confirmada para cupom", () => {
    render(<ConfirmationScreen paymentMethod="cupom" />);
    expect(screen.getByText("Inscrição confirmada!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seu cupom foi validado e sua inscrição foi confirmada com sucesso!",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nos vemos no OIKOS!/)).toBeInTheDocument();
  });

  it("exibe mensagem de redirecionamento para cartão de crédito", () => {
    render(<ConfirmationScreen paymentMethod="credit" />);
    expect(screen.getByText("Redirecionamento realizado!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você foi redirecionado para o ambiente seguro de pagamento.",
      ),
    ).toBeInTheDocument();
  });

  it("usa mensagem de cartão como fallback quando paymentMethod é null", () => {
    render(<ConfirmationScreen paymentMethod={null} />);
    expect(screen.getByText("Redirecionamento realizado!")).toBeInTheDocument();
  });
});
