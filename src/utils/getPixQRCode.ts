import pix125 from "@/assets/PIX_125_OIKOS.png";
import pix135 from "@/assets/PIX_135_OIKOS.png";

const PIX_QRCODE_MAP: Record<number, string> = {
  125: pix125,
  135: pix135,
};

export function extractNumericValue(preco: string): number | null {
  const digitsOnly = preco.replace(/[^\d,.]/g, "");

  const lastComma = digitsOnly.lastIndexOf(",");
  const lastDot = digitsOnly.lastIndexOf(".");

  let normalized: string;
  if (lastComma > lastDot && lastComma === digitsOnly.length - 3) {
    normalized = digitsOnly.replace(/\./g, "").replace(",", ".");
  } else {
    normalized = digitsOnly.replace(",", "");
  }

  const parsed = parseFloat(normalized);
  if (isNaN(parsed) || parsed <= 0) return null;

  return parsed;
}

export function getPixQRCode(preco: string): string | null {
  const value = extractNumericValue(preco);
  if (value === null) return null;

  return PIX_QRCODE_MAP[value] ?? null;
}
