import { useEffect } from "react";
import { initMetaPixel } from "@/lib/metaPixel";
import { usePageView } from "@/hooks/usePageView";

/**
 * Componente que inicializa o Meta Pixel e rastreia PageViews.
 * Deve ser renderizado DENTRO do <BrowserRouter>.
 * Não renderiza nenhum elemento visual.
 */
const MetaPixelProvider = ({ children }: { children: React.ReactNode }) => {
  // Inicializa o Pixel uma única vez no mount
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Dispara PageView a cada mudança de rota
  usePageView();

  return <>{children}</>;
};

export default MetaPixelProvider;
