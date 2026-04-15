/**
 * Stripe client-side config (no API required).
 * Create a Payment Link in Stripe Dashboard and set the URL in .env.
 */
export const STRIPE_PAYMENT_LINK_URL =
  (import.meta.env.VITE_STRIPE_OIKOS_PAYMENT_LINK_URL as string) || "";

export const STRIPE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_STRIPE_PUBLIC_KEY as string) || "";

export const STRIPE_PRICING_TABLE_ID =
  (import.meta.env.VITE_STRIPE_PRICING_TABLE_ID as string) || "";

export const STRIPE_PAYMENT_LINK_BASE_URL =
  (import.meta.env.VITE_STRIPE_PAYMENT_LINK_BASE_URL as string) || "https://buy.stripe.com/";

/**
 * PIX payment configuration.
 * Set these in .env to avoid hardcoding financial data in source.
 */
export const PIX_KEY = (import.meta.env.VITE_PIX_KEY as string) || "";
export const PIX_RECEIVER_NAME =
  (import.meta.env.VITE_PIX_RECEIVER_NAME as string) || "";