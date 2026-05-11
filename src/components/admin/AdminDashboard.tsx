import { useQuery } from "@tanstack/react-query";
import { InscricoesService } from "@/services/inscricoes.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Ticket, Users, AlertCircle, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const {
    data: stats = { eventos: 0, lotes: 0, inscricoes: 0 },
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-counts"],
    staleTime: 0,
    queryFn: InscricoesService.getDashboardStats,
  });

  const cards = [
    { label: "Eventos", value: stats.eventos, icon: CalendarDays },
    { label: "Lotes", value: stats.lotes, icon: Ticket },
    { label: "Inscrições", value: stats.inscricoes, icon: Users },
  ];

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">
        Dashboard
      </h1>

      {isError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">
              Erro ao carregar dados do dashboard
            </p>
            <p className="text-xs text-red-600 mt-1">
              Verifique se o Supabase está acessível.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading
          ? cards.map((c) => (
              <Card key={c.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </CardTitle>
                  <c.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          : cards.map((c) => (
              <Card key={c.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </CardTitle>
                  <c.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {c.value}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
