/**
 * Testes do ProtectedRoute: verifica redirecionamento para login quando
 * não autenticado e bloqueio para não-admins.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock do useAuth
const mockUseAuth = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

import ProtectedRoute from "@/components/ProtectedRoute";

const renderWithRouter = (children: React.ReactNode, initialEntries = ["/admin"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("mostra loading enquanto verifica autenticação", () => {
    mockUseAuth.mockReturnValue({ user: null, isAdmin: false, loading: true });
    renderWithRouter(<ProtectedRoute><div>Admin</div></ProtectedRoute>);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("redireciona para login quando não autenticado", () => {
    mockUseAuth.mockReturnValue({ user: null, isAdmin: false, loading: false });
    const { container } = renderWithRouter(<ProtectedRoute><div>Admin</div></ProtectedRoute>);
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("redireciona para home quando autenticado mas não é admin", () => {
    mockUseAuth.mockReturnValue({ user: { id: "123" }, isAdmin: false, loading: false });
    const { container } = renderWithRouter(<ProtectedRoute><div>Admin</div></ProtectedRoute>);
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("renderiza conteúdo quando é admin", () => {
    mockUseAuth.mockReturnValue({ user: { id: "123" }, isAdmin: true, loading: false });
    renderWithRouter(<ProtectedRoute><div>Admin Content</div></ProtectedRoute>);
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
