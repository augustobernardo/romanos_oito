/**
 * Tests for CupomValidationStep component.
 * Verifies input, validation, and back button behavior.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CupomValidationStep } from "@/components/oikos/CupomValidationStep";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("CupomValidationStep", () => {
  it("exibe input e botão de validação", () => {
    render(
      <CupomValidationStep
        cupomCode=""
        setCupomCode={vi.fn()}
        cupomValidating={false}
        onValidate={vi.fn()}
        onBack={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText("Cole o código do cupom aqui")).toBeInTheDocument();
    expect(screen.getByText("Validar cupom")).toBeInTheDocument();
  });

  it("chama setCupomCode ao digitar no input", () => {
    const setCupomCode = vi.fn();
    render(
      <CupomValidationStep
        cupomCode=""
        setCupomCode={setCupomCode}
        cupomValidating={false}
        onValidate={vi.fn()}
        onBack={vi.fn()}
      />
    );
    const input = screen.getByPlaceholderText("Cole o código do cupom aqui");
    fireEvent.change(input, { target: { value: "VCMAISDOIS#0001" } });
    expect(setCupomCode).toHaveBeenCalledWith("VCMAISDOIS#0001");
  });

  it("chama onValidate ao clicar no botão de validar", () => {
    const onValidate = vi.fn();
    render(
      <CupomValidationStep
        cupomCode="VCMAISDOIS#0001"
        setCupomCode={vi.fn()}
        cupomValidating={false}
        onValidate={onValidate}
        onBack={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Validar cupom"));
    expect(onValidate).toHaveBeenCalled();
  });

  it("chama onBack ao clicar no botão voltar", () => {
    const onBack = vi.fn();
    render(
      <CupomValidationStep
        cupomCode=""
        setCupomCode={vi.fn()}
        cupomValidating={false}
        onValidate={vi.fn()}
        onBack={onBack}
      />
    );
    fireEvent.click(screen.getByText("Voltar ao formulário"));
    expect(onBack).toHaveBeenCalled();
  });

  it("desabilita o botão quando cupom está vazio", () => {
    render(
      <CupomValidationStep
        cupomCode=""
        setCupomCode={vi.fn()}
        cupomValidating={false}
        onValidate={vi.fn()}
        onBack={vi.fn()}
      />
    );
    expect(screen.getByText("Validar cupom")).toBeDisabled();
  });

  it("exibe loading quando cupomValidating é true", () => {
    render(
      <CupomValidationStep
        cupomCode="VCMAISDOIS#0001"
        setCupomCode={vi.fn()}
        cupomValidating={true}
        onValidate={vi.fn()}
        onBack={vi.fn()}
      />
    );
    expect(screen.getByText("Validando...")).toBeInTheDocument();
  });
});
