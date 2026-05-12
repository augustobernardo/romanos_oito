/**
 * Tests for ConfirmationScreen component (PIX variant).
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
  it("exibe mensagem de comprovante enviado", () => {
    render(<ConfirmationScreen />);
    expect(screen.getByText("Comprovante enviado!")).toBeInTheDocument();
    expect(
      screen.getByText(/Seu comprovante foi enviado com sucesso/),
    ).toBeInTheDocument();
  });

  it("exibe instrução final com contato SAC", () => {
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
