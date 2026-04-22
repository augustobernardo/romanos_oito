import { useQuery } from "@tanstack/react-query";
import { LotesService } from "@/services/lotes.service";
import { useToast } from "@/hooks/use-toast";
import type { LoteInfo } from "@/components/form/LoteCard";

const mapLote = (l: {
  id: number;
  id_payment_link: string | null;
  nome: string;
  preco: string;
  status: string | null;
  is_especial: boolean | null;
}): LoteInfo => ({
  id: l.id,
  id_payment_link: l.id_payment_link ?? "",
  nome: l.nome,
  preco: l.preco,
  status: (l.status ?? "esgotado") as "disponivel" | "esgotado",
  is_especial: l.is_especial ?? false,
});

export const useLotes = () => {
  const { toast } = useToast();

  const { data = [], isLoading } = useQuery({
    queryKey: ["lotes"],
    queryFn: async () => {
      const { data, error } = await LotesService.findAll();
      if (error) {
        toast({ title: "Erro ao carregar lotes", variant: "destructive" });
        return [];
      }
      return data?.map(mapLote) ?? [];
    },
  });

  return { lotes: data, loading: isLoading };
};

export const getLoteDisponivel = (lotes: LoteInfo[]): number | null => {
  for (const lote of lotes) {
    if (lote.status === "disponivel" && !lote.is_especial) return lote.id;
  }
  return null;
};

export const getLoteDisponivelPaymentLink = (
  lotes: LoteInfo[],
  loteId: number,
): string | null => {
  const lote = lotes.find((l) => l.id === loteId);
  if (lote && lote.status === "disponivel") {
    return lote.id_payment_link;
  }
  return null;
};
