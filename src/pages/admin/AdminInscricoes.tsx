import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download } from "lucide-react";
import * as XLSX from "xlsx";
import type { Tables } from "@/integrations/supabase/types";

type Inscricao = Tables<"inscricoes">;
type SortKey = "nome" | "created_at";
type SortDir = "asc" | "desc";

const formatPhone = (phone: string) =>
  phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

const AdminInscricoes = () => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("inscricoes")
        .select("*")
        .order("created_at", { ascending: false });
      setInscricoes(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "nome" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc"
      ? <ArrowUp className="ml-1 inline h-3.5 w-3.5" />
      : <ArrowDown className="ml-1 inline h-3.5 w-3.5" />;
  };

  const sorted = useMemo(() => {
    const filtered = inscricoes.filter(
      (i) =>
        i.nome.toLowerCase().includes(search.toLowerCase()) ||
        i.telefone.includes(search) ||
        i.comunidade.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortKey === "nome") {
        const cmp = a.nome.localeCompare(b.nome, "pt-BR");
        return sortDir === "asc" ? cmp : -cmp;
      }
      const cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [inscricoes, search, sortKey, sortDir]);

  const columnLabels: Record<string, string> = {
    nome: "Nome",
    telefone: "Telefone",
    data_nascimento: "Data de Nascimento",
    instagram: "Instagram",
    comunidade: "Comunidade",
    cidade_estado: "Cidade/Estado",
    endereco_completo: "Endereço Completo",
    tamanho_camisa: "Tamanho Camisa",
    nome_pai: "Nome do Pai",
    numero_pai: "Número do Pai",
    nome_mae: "Nome da Mãe",
    numero_mae: "Número da Mãe",
    numero_responsavel_proximo: "Número Responsável Próximo",
    is_catolico: "É Católico?",
    is_catolico_outro: "Católico (Outro)",
    participa_movimento: "Participa de Movimento",
    fez_retiro: "Fez Retiro?",
    fez_retiro_outro: "Retiro (Outro)",
    como_conheceu: "Como Conheceu",
    como_conheceu_outro: "Como Conheceu (Outro)",
    nome_pessoa_emergencia: "Pessoa de Emergência",
    grau_parentesco_emergencia: "Grau de Parentesco (Emergência)",
    numero_emergencia: "Número de Emergência",
    expectativa_oikos: "Expectativa OIKOS",
    status: "Status",
    created_at: "Data da Inscrição",
  };

  const exportToExcel = () => {
    const rows = sorted.map((i) => {
      const row: Record<string, string> = {};
      for (const key of Object.keys(columnLabels)) {
        let val = (i as any)[key] ?? "";
        if (key === "created_at") {
          val = new Date(val).toLocaleDateString("pt-BR");
        }
        row[columnLabels[key]] = val;
      }
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inscrições");
    XLSX.writeFile(wb, `inscricoes_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Inscrições</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por nome, telefone..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap" onClick={exportToExcel}>
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{sorted.length} inscrição(ões) encontrada(s)</p>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="rounded-md border overflow-x-auto max-h-[70vh] overflow-y-auto">
          <Table className="min-w-[900px] table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead
                  className="w-[180px] whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort("nome")}
                >
                  Nome <SortIcon col="nome" />
                </TableHead>
                <TableHead className="w-[140px] text-center whitespace-nowrap">Telefone</TableHead>
                <TableHead className="w-[140px] text-center whitespace-nowrap">Comunidade</TableHead>
                <TableHead className="w-[130px] text-center whitespace-nowrap">Cidade/Estado</TableHead>
                <TableHead className="w-[80px] text-center whitespace-nowrap">Camisa</TableHead>
                <TableHead className="w-[70px] text-center whitespace-nowrap">Idade</TableHead>
                <TableHead className="w-[110px] text-center whitespace-nowrap">Status</TableHead>
                <TableHead
                  className="w-[150px] text-center whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort("created_at")}
                >
                  Data da Inscrição <SortIcon col="created_at" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium truncate max-w-[180px]" title={i.nome}>{i.nome}</TableCell>
                  <TableCell className="text-center">{formatPhone(i.telefone)}</TableCell>
                  <TableCell className="text-center truncate max-w-[140px]" title={i.comunidade}>{i.comunidade}</TableCell>
                  <TableCell className="text-center truncate max-w-[130px]" title={i.cidade_estado}>{i.cidade_estado}</TableCell>
                  <TableCell className="text-center">{i.tamanho_camisa}</TableCell>
                  <TableCell className="text-center">{(i as any).idade ?? "—"}</TableCell>
                  <TableCell className="text-center"><Badge variant={statusColor(i.status)}>{i.status}</Badge></TableCell>
                  <TableCell className="text-sm text-center">{new Date(i.created_at).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInscricoes;
