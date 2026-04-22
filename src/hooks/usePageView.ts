import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/metaPixel";

/**
 * Hook que dispara Meta Pixel PageView a cada mudança de rota.
 * Compatível com SPA — escuta o pathname do React Router.
 * Deve ser chamado uma única vez dentro do <BrowserRouter>.
 */
export function usePageView(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    // Dispara PageView sempre que a rota muda
    trackPageView();
  }, [pathname]);
}
