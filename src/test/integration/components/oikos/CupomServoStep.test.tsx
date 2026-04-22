import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CupomServoStep } from "@/components/oikos/CupomServoStep";

const renderStep = (overrides: Partial<React.ComponentProps<typeof CupomServoStep>> = {}) => {
  const defaultProps: React.ComponentProps<typeof CupomServoStep> = {
    cupomCode: "",
    setCupomCode: vi.fn(),
    cupomValidating: false,
    onValidate: vi.fn(),
    onSkip: vi.fn(),
    onBack: vi.fn(),
    ...overrides,
  };
  return { props: defaultProps, ...render(<CupomServoStep {...defaultProps} />) };
};

describe("CupomServoStep", () => {
  it("exibe título, instrução e indicador de etapa opcional", () => {
    renderStep();
    expect(screen.getByText(/algum servo te indicou/i)).toBeInTheDocument();
    expect(screen.getByText(/opcional/i)).toBeInTheDocument();
    expect(screen.getByText(/servo amigo/i)).toBeInTheDocument();
    expect(screen.getByText(/pagamento/i)).toBeInTheDocument();
  });

  it("desabilita o botão validar quando o código está vazio", () => {
    renderStep();
    const validateBtn = screen.getByRole("button", { name: /validar e continuar/i });
    expect(validateBtn).toBeDisabled();
  });

  it("habilita validar quando há código e dispara onValidate", () => {
    const onValidate = vi.fn();
    renderStep({ cupomCode: "SERVOAMIGO#001", onValidate });
    const validateBtn = screen.getByRole("button", { name: /validar e continuar/i });
    expect(validateBtn).not.toBeDisabled();
    fireEvent.click(validateBtn);
    expect(onValidate).toHaveBeenCalledTimes(1);
  });

  it("permite pular a etapa via botão dedicado", () => {
    const onSkip = vi.fn();
    renderStep({ onSkip });
    fireEvent.click(screen.getByRole("button", { name: /pular etapa/i }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("permite voltar ao formulário", () => {
    const onBack = vi.fn();
    renderStep({ onBack });
    fireEvent.click(screen.getByRole("button", { name: /voltar ao formulário/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("mostra estado de validando", () => {
    renderStep({ cupomCode: "SERVOAMIGO#001", cupomValidating: true });
    expect(screen.getByRole("button", { name: /validando/i })).toBeDisabled();
  });
});