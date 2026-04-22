/**
 * Tests for the ConfirmDialog component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renderiza com props padrão quando aberto", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );
    expect(screen.getByText("Confirmar exclusão")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza que deseja excluir este item?")).toBeInTheDocument();
    expect(screen.getByText("Esta ação não pode ser desfeita.")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("não renderiza quando fechado", () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByText("Confirmar exclusão")).not.toBeInTheDocument();
  });

  it("renderiza com props customizadas", () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        title="Tem certeza?"
        description="Deseja realmente continuar?"
        warning="Cuidado com esta ação!"
        cancelLabel="Voltar"
        confirmLabel="Continuar"
      />,
    );
    expect(screen.getByText("Tem certeza?")).toBeInTheDocument();
    expect(screen.getByText("Deseja realmente continuar?")).toBeInTheDocument();
    expect(screen.getByText("Cuidado com esta ação!")).toBeInTheDocument();
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("Continuar")).toBeInTheDocument();
  });

  it("chama onConfirm ao clicar no botão de confirmação", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByText("Excluir"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("chama onOpenChange(false) ao clicar no botão de cancelar", () => {
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Cancelar"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
