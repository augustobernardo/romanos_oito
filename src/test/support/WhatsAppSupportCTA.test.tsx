import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Pentecostes from "@/pages/Pentecostes";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

const win = window as Record<string, unknown>;
if (!win.PointerEvent) {
  win.PointerEvent = MouseEvent;
}
if (!win.ResizeObserver) {
  win.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
Element.prototype.scrollIntoView = vi.fn();
const proto = Element.prototype as Record<string, unknown>;
proto.hasPointerCapture = vi.fn(() => false);
proto.releasePointerCapture = vi.fn();
proto.setPointerCapture = vi.fn();

const tooltipText = /Precisa de ajuda\? Fale conosco no WhatsApp/i;

const getTooltipWrapper = (): HTMLElement | null => {
  const textEl = screen.queryByText(tooltipText);
  if (!textEl) return null;
  return textEl.closest('[aria-hidden]') as HTMLElement | null;
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/pentecoste"]}>
      <Pentecostes />
    </MemoryRouter>,
  );

describe("WhatsApp Support CTA", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza o WhatsApp CTA na página", () => {
    renderPage();
    expect(screen.getByTestId("whatsapp-support-cta")).toBeInTheDocument();
  });

  it("renderiza o botão de WhatsApp com o link correto", () => {
    renderPage();
    const link = screen.getByTestId("whatsapp-support-button");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toContain("api.whatsapp.com/send");
    expect(link.getAttribute("aria-label")).toBe("Suporte via WhatsApp");
  });

  it("tooltip deve começar invisível (aria-hidden=true)", () => {
    renderPage();
    const wrapper = getTooltipWrapper();
    expect(wrapper).not.toBeNull();
    expect(wrapper!.getAttribute("aria-hidden")).toBe("true");
  });

  it("tooltip deve ficar visível após 3 segundos (aria-hidden=false)", () => {
    renderPage();
    const wrapper = getTooltipWrapper();
    expect(wrapper!.getAttribute("aria-hidden")).toBe("true");

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(wrapper!.getAttribute("aria-hidden")).toBe("false");
  });

  it("tooltip deve voltar a ficar invisível após 10 segundos", () => {
    renderPage();
    const wrapper = getTooltipWrapper();

    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(wrapper!.getAttribute("aria-hidden")).toBe("false");

    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(wrapper!.getAttribute("aria-hidden")).toBe("true");
  });

  it("tooltip usa classes de transição suave", () => {
    renderPage();
    const wrapper = getTooltipWrapper();
    expect(wrapper!.className).toContain("transition-all");
    expect(wrapper!.className).toContain("duration-500");
    expect(wrapper!.className).toContain("ease-in-out");
  });

  it("tooltip tem estilo pentecoste (border-navy, shadow)", () => {
    renderPage();
    const textEl = screen.getByText(tooltipText);
    const tooltipBox = textEl.closest("div.relative");
    expect(tooltipBox).not.toBeNull();
    expect(tooltipBox!.className).toContain("border-pentecoste-navy");
    expect(tooltipBox!.className).toContain("bg-white");
  });

  it("botão abre em nova aba com rel=noopener noreferrer", () => {
    renderPage();
    const link = screen.getByTestId("whatsapp-support-button");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("botão tem cor WhatsApp (#25D366)", () => {
    renderPage();
    const link = screen.getByTestId("whatsapp-support-button");
    expect(link.className).toContain("bg-[#25D366]");
  });

  it("botão contém ícone SVG do WhatsApp", () => {
    renderPage();
    const button = screen.getByTestId("whatsapp-support-button");
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  it("botão tem estilo pentecoste (borda navy, shadow)", () => {
    renderPage();
    const link = screen.getByTestId("whatsapp-support-button");
    expect(link.className).toContain("border-pentecoste-navy");
    expect(link.className).toContain("h-14");
    expect(link.className).toContain("w-14");
  });
});