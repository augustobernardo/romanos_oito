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
}

const LoteCard = ({ lote, isActive, isEnabled, onSelect }: LoteCardProps) => {
  const esgotado = lote.status === "esgotado";
  const disabled = !isEnabled || esgotado;

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
      {esgotado && (
        <span className="absolute -top-2.5 rounded-full bg-destructive px-3 py-0.5 text-xs font-semibold text-destructive-foreground">
          Esgotado
        </span>
      )}
      <span className="text-sm font-medium" style={{ color: "hsl(195 15% 50%)" }}>{lote.nome}</span>
      <span className="text-xl font-bold" style={{ color: "hsl(200 30% 25%)" }}>{lote.preco}</span>
      {isActive && <CheckCircle className="h-5 w-5" style={{ color: "hsl(195 100% 45%)" }} />}
    </button>
  );
};

export default LoteCard;
