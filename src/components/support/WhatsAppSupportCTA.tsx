import { useState, useEffect } from "react";
import { WHATSAPP_NUMBER } from "@/config/constants";

interface WhatsAppSupportCTAProps {
  className?: string;
}

const TOOLTIP_AUTO_SHOW_MS = 3000;
const TOOLTIP_AUTO_HIDE_MS = 10000;

const WhatsAppSupportCTA = ({ className = "" }: WhatsAppSupportCTAProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), TOOLTIP_AUTO_SHOW_MS);
    const hideTimer = setTimeout(() => setShowTooltip(false), TOOLTIP_AUTO_HIDE_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 ${className}`}
      data-testid="whatsapp-support-cta"
    >
      <div
        className={`
          transition-all duration-500 ease-in-out
          ${
            showTooltip
              ? "opacity-100 translate-x-0 visible"
              : "opacity-0 translate-x-4 invisible"
          }
        `}
        aria-hidden={!showTooltip}
      >
        <div className="relative bg-white border-2 border-pentecoste-navy shadow-[3px_3px_0_0_rgba(27,37,65,1)] px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium max-w-[55vw] sm:max-w-none sm:whitespace-nowrap">
          <span className="font-mono uppercase tracking-[0.08em] sm:tracking-[0.1em] text-[10px] leading-tight sm:text-xs text-pentecoste-navy block">
            <span className="sm:hidden">Precisa de ajuda? Fale no WhatsApp</span>
            <span className="hidden sm:inline">Precisa de ajuda? Fale conosco no WhatsApp</span>
          </span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="border-8 border-transparent border-l-pentecoste-navy" />
          </div>
        </div>
      </div>

      <a
        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Olá! Preciso de ajuda com a Vigília de Pentecostes.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Suporte via WhatsApp"
        data-testid="whatsapp-support-button"
        className="flex h-14 w-14 items-center justify-center border-2 border-pentecoste-navy bg-[#25D366] shadow-[3px_3px_0_0_rgba(27,37,65,1)] transition-transform hover:scale-105 hover:shadow-[2px_2px_0_0_rgba(27,37,65,1)] hover:translate-x-[1px] hover:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-pentecoste-red focus-visible:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-7 w-7"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.054 9.378L1.056 31.08l5.898-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0Zm9.314 22.606c-.39 1.1-1.932 2.012-3.178 2.278-.852.18-1.964.324-5.71-1.226-4.796-1.982-7.882-6.85-8.122-7.168-.23-.318-1.932-2.574-1.932-4.908s1.222-3.48 1.656-3.958c.434-.478.948-.598 1.264-.598.316 0 .63.002.906.016.29.014.68-.112 1.064.812.39.94 1.33 3.274 1.448 3.512.118.238.196.516.04.832-.158.318-.236.516-.476.794-.238.278-.5.62-.714.832-.238.238-.486.496-.21.972.278.478 1.234 2.034 2.65 3.296 1.82 1.622 3.354 2.124 3.832 2.362.478.238.756.198 1.034-.12.278-.316 1.196-1.392 1.514-1.87.318-.478.636-.396 1.074-.238.436.158 2.77 1.306 3.248 1.544.478.238.796.358.914.554.118.198.118 1.142-.272 2.242Z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppSupportCTA;