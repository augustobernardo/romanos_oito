import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle } from "lucide-react";

interface OikosMetrics {
  total: number;
  awaiting_confirmation: number;
  paid: number;
}

interface InscricoesMetricsCardsProps {
  metrics: OikosMetrics | null;
  isLoading: boolean;
}

export const InscricoesMetricsCards = ({
  metrics,
  isLoading,
}: InscricoesMetricsCardsProps) => {
  const cards = [
    {
      label: "Total de Inscrições",
      value: metrics?.total,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Pagos",
      value: metrics?.paid,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {card.value ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
