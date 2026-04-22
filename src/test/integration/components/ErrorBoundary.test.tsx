/**
 * Tests for ErrorBoundary component.
 * Verifies that it renders children normally and catches errors.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

describe("ErrorBoundary", () => {
  it("renderiza filhos normalmente quando não há erro", () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("exibe fallback quando componente filho lança erro", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
    expect(screen.getByText("Tentar novamente")).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it("o botão 'Tentar novamente' recarrega a página", () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    vi.spyOn(console, "error").mockImplementation(() => {});
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    screen.getByText("Tentar novamente").click();
    expect(reloadMock).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
