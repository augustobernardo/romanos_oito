import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { MetricsCards } from "./MetricsCards";
import { RegistrationFilters } from "./RegistrationFilters";
import { RegistrationsTable } from "./RegistrationsTable";
import { RegistrationDetailsDrawer } from "./RegistrationDetailsDrawer";
import { PentecosteService } from "@/services/admin/pentecoste.service";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import type { PentecosteRegistration, RegisterFilters } from "@/types/pentecoste";

const PAGE_SIZE = 20;

const emptyFilters: RegisterFilters = {
  search: "",
  status: "",
  method: "",
  workshop: "",
  underage: "",
  dateFrom: "",
  dateTo: "",
};

const PentecosteAdmin = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RegisterFilters>(emptyFilters);
  const [selectedRegistration, setSelectedRegistration] =
    useState<PentecosteRegistration | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: registrationData,
    isLoading: registrationsLoading,
    isError: registrationsError,
    refetch: refetchRegistrations,
  } = useQuery({
    queryKey: ["pentecoste-registrations", page, filters],
    queryFn: () => PentecosteService.findAll(page, PAGE_SIZE, filters),
  });

  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ["pentecoste-metrics"],
    queryFn: PentecosteService.getMetrics,
    staleTime: 30_000,
  });

  const totalPages = Math.max(
    1,
    Math.ceil((registrationData?.total ?? 0) / PAGE_SIZE),
  );

  const handleFilterChange = useCallback(
    (partial: Partial<RegisterFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
      setPage(1);
    },
    [],
  );

  const handleReset = useCallback(() => {
    setFilters(emptyFilters);
    setPage(1);
  }, []);

  const handleSelect = useCallback((reg: PentecosteRegistration) => {
    setSelectedRegistration(reg);
    setDrawerOpen(true);
  }, []);

  const registrations = useMemo(
    () => registrationData?.registrations ?? [],
    [registrationData],
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Pentecoste
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchRegistrations();
              refetchMetrics();
            }}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </div>

        <MetricsCards metrics={metrics ?? null} isLoading={metricsLoading} />

        <RegistrationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {registrationsError ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm font-medium text-red-700">
              Erro ao carregar inscrições
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchRegistrations()}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Tentar novamente
            </Button>
          </div>
        ) : registrationsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Nenhuma inscrição encontrada
            </p>
            <p className="text-xs text-muted-foreground">
              {filters.search || filters.status || filters.method
                ? "Tente ajustar os filtros de busca."
                : "As inscrições aparecerão aqui quando forem realizadas."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {registrationData?.total ?? 0} inscrição(ões) encontrada(s)
              {page > 1 && ` — Página ${page} de ${totalPages}`}
            </p>

            <RegistrationsTable
              registrations={registrations}
              onSelect={handleSelect}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <RegistrationDetailsDrawer
        registration={selectedRegistration}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </AdminLayout>
  );
};

export default PentecosteAdmin;
