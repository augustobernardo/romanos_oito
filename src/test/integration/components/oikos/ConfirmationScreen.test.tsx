/**
 * Tests for ConfirmationScreen component (PIX + card_manual variants).
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmationScreen } from "@/components/oikos/ConfirmationScreen";
import { ComponentProps } from "react";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ ...props }: ComponentProps<"div">) => <div {...props} />,
    h2: ({ ...props }: ComponentProps<"h2">) => <h2 {...props} />,
    p: ({ ...props }: ComponentProps<"p">) => <p {...props} />,
  },
}));

describe("ConfirmationScreen", () => {
  it("exibe mensagem de comprovante enviado (variante pix padrão)", () => {
    render(<ConfirmationScreen />);
    expect(screen.getByText("Comprovante enviado!")).toBeInTheDocument();
    expect(
      screen.getByText(/Seu comprovante foi enviado com sucesso/),
    ).toBeInTheDocument();
  });

  it("exibe mensagem de inscrição realizada para card_manual", () => {
    render(<ConfirmationScreen variant="card_manual" />);
    expect(screen.getByText("Inscrição realizada com sucesso!")).toBeInTheDocument();
    expect(
      screen.getByText(/Seu pagamento ficou pendente/),
    ).toBeInTheDocument();
  });

  it("exibe WhatsApp CTA para card_manual", () => {
    render(<ConfirmationScreen variant="card_manual" />);
    expect(screen.getByText("Falar com SAC no WhatsApp")).toBeInTheDocument();
  });

  it("exibe instrução final com contato SAC (variante pix)", () => {
    render(<ConfirmationScreen />);
    expect(
      screen.getByText(/Seja bem-vindo ao melhor fim de semana da sua vida/),
    ).toBeInTheDocument();
  });

  it("exibe mensagem de status automática", () => {
    render(<ConfirmationScreen />);
    expect(
      screen.getByText(/Esta é uma mensagem automática/),
    ).toBeInTheDocument();
  });
});
