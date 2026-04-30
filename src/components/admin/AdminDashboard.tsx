import { useQuery } from "@tanstack/react-query";
import { InscricoesService } from "@/services/inscricoes.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Ticket, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
  const { data: stats = { eventos: 0, lotes: 0, inscricoes: 0 }, isLoading } = useQuery({
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
                  <div className="text-3xl font-bold text-foreground">...</div>
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
