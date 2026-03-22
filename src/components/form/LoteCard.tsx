import { CheckCircle } from "lucide-react";

export type LoteStatus = "disponivel" | "esgotado";

export interface LoteInfo {
  id: number;
  id_payment_link: string;
  nome: string;
  preco: string;
  status: LoteStatus;
}

interface LoteCardProps {
  lote: LoteInfo;
  isActive: boolean;
  isEnabled: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

const LoteCard = ({ lote, isActive, isEnabled, onSelect, isLoading = false }: LoteCardProps) => {
  const esgotado = lote.status === "esgotado";
  const disabled = !isEnabled || esgotado || isLoading;

  // Skeleton loading Card
  if (isLoading) {
    return (
      <div
        className="relative flex flex-col items-center gap-2 rounded-xl border-2 p-5"
        style={{
          borderColor: "hsl(195 40% 82%)",
          backgroundColor: "#f8f8f8",
        }}
      >
        {/* Nome do lote skeleton */}
        <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse bg-[length:200%_100%]" />
        
        {/* Preço skeleton */}
        <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse bg-[length:200%_100%] mt-1" />
        
        {/* Ícone skeleton */}
        <div className="h-5 w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse bg-[length:200%_100%] mt-2" />
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
        isActive
          ? "shadow-md"
          : disabled
            ? "cursor-not-allowed opacity-60"
            : "hover:shadow-sm"
      }`}
      style={{
        borderColor: isActive
          ? "hsl(195 100% 45%)"
          : disabled
            ? "hsl(195 40% 82%)"
            : "hsl(195 40% 82%)",
        backgroundColor: isActive
          ? "#faf7ef"
          : disabled
            ? "#e0e0e0"
            : "hsl(0 0% 100%)",
      }}
    >
      {esgotado && !isLoading && (
        <span className="absolute -top-2.5 rounded-full bg-destructive px-3 py-0.5 text-xs font-semibold text-destructive-foreground">
          Esgotado
        </span>
      )}
      <span className="text-sm font-medium" style={{ color: "hsl(195 15% 50%)" }}>{lote.nome}</span>
      <span className="text-xl font-bold" style={{ color: "hsl(200 30% 25%)" }}>{lote.preco}</span>
      {isActive && !isLoading && <CheckCircle className="h-5 w-5" style={{ color: "hsl(195 100% 45%)" }} />}
    </button>
  );
};

export default LoteCard;
