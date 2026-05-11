import { useRef, useState } from "react";
import secondSectionDesktop from "@/assets/pentecoste/DESKTOP_PENTECOSTE.png";
import secondSectionMobile from "@/assets/pentecoste/MOBILE_PENTECOSTE.png";
import PentecostesForm from "@/components/pentecostes/PentecostesForm";
import WhatsAppSupportCTA from "@/components/support/WhatsAppSupportCTA";
import { useIsMobile } from "@/hooks/use-mobile";

const DEBUG_HOTSPOT = false;

/**
 * CTA "EU QUERO IR!" hotspot, expressed as percentages of the image
 * so the click area scales perfectly with the responsive background.
 * Each artwork (desktop / mobile) has its own coordinates, since the
 * button is positioned differently in each composition.
 */
const CTA_HOTSPOT = {
  desktop: {
    left: "40%",
    top: "86.5%",
    width: "18%",
    height: "7%",
  },
  mobile: {
    left: "10%",
    top: "70.5%",
    width: "80%",
    height: "11.5%",
  },
} as const;

const Pentecostes = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const isMobile = useIsMobile();
  const hotspot = isMobile ? CTA_HOTSPOT.mobile : CTA_HOTSPOT.desktop;

  const handleOpenForm = () => {
    setShowForm(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="min-h-screen bg-pentecoste-texture text-pentecoste-navy">
      <WhatsAppSupportCTA />
      <section className="relative mx-auto w-full max-w-[1920px]">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={secondSectionMobile}
          />
          <source
            media="(min-width: 768px)"
            srcSet={secondSectionDesktop}
          />
          <img
            src={secondSectionDesktop}
            alt="Vigília de Pentecostes 2025 - Paróquia Cristo Redentor"
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </picture>
        <button
          type="button"
          onClick={handleOpenForm}
          aria-label="Ir para o formulário de inscrição da Vigília de Pentecostes"
          data-testid="pentecostes-hotspot"
          className={`absolute rounded-full bg-transparent p-0 transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-pentecoste-red focus-visible:ring-offset-2 ${
            DEBUG_HOTSPOT ? "border-2 border-yellow-400 bg-yellow-400/20" : ""
          }`}
          style={{
            left: hotspot.left,
            top: hotspot.top,
            width: hotspot.width,
            height: hotspot.height,
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        />
      </section>

      {showForm && (
        <section
          ref={formRef}
          id="inscricao"
          className="overflow-hidden bg-pentecoste-texture px-4 py-16 sm:px-6 lg:py-24 animate-slide-down"
          aria-labelledby="pentecoste-form-title"
        >
          <div className="mx-auto w-full max-w-3xl">
            <header className="mb-10 text-center">
              <h1
                id="pentecoste-form-title"
                className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight text-pentecoste-red sm:text-5xl md:text-6xl"
              >
                Formulário de Inscrição
              </h1>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-pentecoste-navy/80 sm:text-sm">
                Paróquia Cristo Redentor · Início 21h | Término 7h
              </p>
            </header>

            <div className="border-2 border-pentecoste-navy bg-pentecoste-paper p-6 shadow-[6px_6px_0_0_rgba(27,37,65,1)] sm:p-10">
              <PentecostesForm />
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Pentecostes;
