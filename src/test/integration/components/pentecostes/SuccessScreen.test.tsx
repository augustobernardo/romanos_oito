/**
 * Tests for Pentecostes success/confirmation screen:
 * - VIGILIA_INFO_TEXT renders on success
 * - checkbox is NOT rendered
 * - underage reminder text appears
 * - existing success elements preserved
 * - SAC WhatsApp CTA renders
 * - read-only mode (no scrollbar container)
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PentecostesForm from "@/components/pentecostes/PentecostesForm";
import { VIGILIA_INFO_TEXT } from "@/components/pentecostes/VigiliaInfoSummary";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useWatch: () => ({}) as unknown,
  };
});

vi.mock("@/components/pentecostes/usePentecostesForm", () => ({
  usePentecostesForm: () => ({
    form: {
      control: {},
      register: vi.fn(),
      handleSubmit: vi.fn(),
    },
    currentStep: 0,
    totalSteps: 5,
    next: vi.fn(),
    back: vi.fn(),
    submit: vi.fn(),
    reset: vi.fn(),
    isStepValid: vi.fn(() => true),
    canSubmit: vi.fn(() => true),
    isFirstStep: true,
    isLastStep: false,
    isSubmitting: false,
    isSuccess: true,
    isError: false,
    syncToMachine: vi.fn(),
    paymentProofFile: null,
    paymentProofName: "",
    paymentProofSize: 0,
    handleFileUpload: vi.fn(),
    handleRemoveFile: vi.fn(),
    submissionError: null,
  }),
}));

describe("Pentecostes Success Screen", () => {
  it("renders the existing success heading and reset button", () => {
    render(<PentecostesForm />);
    expect(screen.getByText("Inscrição recebida!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /nova inscrição/i })
    ).toBeInTheDocument();
  });

  it("renders VIGILIA_INFO_TEXT content on the success screen", () => {
    render(<PentecostesForm />);
    expect(
      screen.getByText(/LEIA COM ATENÇÃO AS INFORMAÇÕES DA VIGÍLIA DE PENTECOSTES/i)
    ).toBeInTheDocument();
  });

  it("renders the informational reminder heading", () => {
    render(<PentecostesForm />);
    expect(
      screen.getByText(/Leia novamente atentamente as informações/i)
    ).toBeInTheDocument();
  });

  it("does NOT render the read_descriptions_confirmation checkbox", () => {
    render(<PentecostesForm />);
    expect(
      screen.queryByRole("checkbox")
    ).toBeNull();
    expect(
      screen.queryByText(/li e estou ciente de todas as informações/i)
    ).toBeNull();
  });

  it("renders the underage reminder text", () => {
    render(<PentecostesForm />);
    expect(
      screen.getByText(/É menor de idade\? Chama o SAC do R8 para pegar a sua autorização\./i)
    ).toBeInTheDocument();
  });

  it("renders the SAC WhatsApp CTA button with correct link", () => {
    render(<PentecostesForm />);
    const sacButton = screen.getByRole("button", { name: /falar com o sac/i });
    expect(sacButton).toBeInTheDocument();

    const link = sacButton.closest("a");
    expect(link).toHaveAttribute("href");
    expect(link?.getAttribute("href")).toContain("api.whatsapp.com");
    expect(link?.getAttribute("href")).toContain("Pentecostes");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders VIGILIA_INFO_TEXT in read-only mode (no scrollbar container)", () => {
    render(<PentecostesForm />);
    // The scrollable container uses overflow-y-auto, which should not be present in readOnly mode
    const infoText = screen.getByText(/LEIA COM ATENÇÃO/i).closest("div");
    // In readOnly mode, the container should NOT have the scroll classes
    expect(infoText?.className).not.toContain("overflow-y-auto");
    expect(infoText?.className).not.toContain("max-h-\\[50vh\\]");
  });

  it("renders the SAC advisory card with AlertCircle icon", () => {
    render(<PentecostesForm />);
    // The underage advisory uses a red border style
    const advisoryText = screen.getByText(/É menor de idade\?/i);
    const advisoryContainer = advisoryText.closest("div");
    expect(advisoryContainer?.className).toContain("border-pentecoste-red");
    expect(advisoryContainer?.className).toContain("bg-pentecoste-red");
  });
});
