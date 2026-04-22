/**
 * Meta Pixel (Facebook Pixel) — serviço centralizado
 *
 * Configuração via variável de ambiente:
 *   VITE_META_PIXEL_ID=123456789012345
 *
 * O script do Pixel é injetado uma única vez no <head>.
 * Todas as chamadas passam por este módulo para evitar disparos duplicados.
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

/** Indica se o Pixel já foi inicializado nesta sessão */
let initialized = false;

/**
 * Inicializa o Meta Pixel (injeta o script e dispara PageView inicial).
 * Seguro para chamar múltiplas vezes — só executa na primeira.
 */
export function initMetaPixel(): void {
  if (initialized || !PIXEL_ID) return;

  // Snippet oficial do Meta Pixel adaptado para SPA
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      // eslint-disable-next-line prefer-rest-params
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", PIXEL_ID);
  initialized = true;
}

/**
 * Dispara um evento padrão do Meta Pixel.
 * @param eventName Nome do evento (ex: "PageView", "Lead", "CompleteRegistration")
 * @param data      Parâmetros opcionais do evento
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>): void {
  if (!initialized || !window.fbq) return;
  window.fbq("track", eventName, data);
}

/**
 * Dispara PageView — wrapper de conveniência.
 * Útil em navegação SPA onde cada rota deve registrar um PageView.
 */
export function trackPageView(): void {
  trackEvent("PageView");
}

// Tipagem global para o fbq
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}
