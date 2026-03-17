import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Search, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Download } from "lucide-react";
import * as XLSX from "xlsx";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "../ui/button";
import { toast } from "../ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { columnLabels, createUniqueKey, formatNamesStringsInscricao, getUniqueRecentInscricoes } from "@/lib/utils";

type Inscricao = Tables<"inscricoes">;
type SortKey = "nome" | "created_at";
type SortDir = "asc" | "desc";

const formatPhone = (phone: string) =>
  phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

const emptyInscricao = { status: "" };

const AdminInscricoes = () => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Inscricao | null>(null);
  const [form, setForm] = useState(emptyInscricao);
  const [allInscricoes, setAllInscricoes] = useState<Inscricao[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchInscricoes = async () => {
    setLoading(true);
      const { data } = await supabase
        .from("inscricoes")
        .select("*")
        .order("created_at", { ascending: false });

    setAllInscricoes(data ?? []);
    
    // Aplica o filtro de registros únicos (apenas o mais recente por nome+telefone)
    const uniqueInscricoes = getUniqueRecentInscricoes(data ?? []);

    const formattedInscricoes = formatNamesStringsInscricao(uniqueInscricoes);

    setInscricoes(formattedInscricoes);
    setLoading(false);
  };

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const openNew = () => { setEditing(null); setForm(emptyInscricao); setOpen(true); };

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

  const statusColor = (s: string) => {
    if (s === "confirmado") return "default";
    if (s === "processando") return "secondary";
    return "destructive";
  };

  const exportToExcel = () => {
    const rows = sorted.map((i) => {
      const row: Record<string, string> = {};
      for (const key of Object.keys(columnLabels)) {
        let val = (i as any)[key] ?? "";
        if (key === "created_at") {
          val = new Date(val).toLocaleDateString("pt-BR");
        }

        if (key === "telefone") {
          val = formatPhone(val);
        }

        if (key == "data_nascimento") {
          val = val ? new Date(val).toLocaleDateString("pt-BR") : "";
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

  // Função para abrir o modal de edição
  const openEdit = (inscricao: Inscricao) => {
    setEditing(inscricao);
    setForm({ status: inscricao.status });
    setOpen(true);
  };

  // Função para salvar (apenas atualização)
  const handleSave = async () => {
    if (!form.status) {
      toast.error("Status é obrigatório");
      return;
    }

    if (editing) {
      // Atualizar registro existente
      const { error } = await supabase
        .from("inscricoes")
        .update({ status: form.status })
        .eq("id", editing.id);

      if (error) {
        toast.error("Erro ao atualizar status");
      } else {
        toast.success("Status atualizado com sucesso");
      }
    }

    setOpen(false);
    fetchInscricoes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta inscrição?")) return;
    
    // Antes de excluir, verifica se existem registros duplicados
    const inscricaoToDelete = allInscricoes.find(i => i.id === id);
    
    if (inscricaoToDelete) {
      const key = createUniqueKey(inscricaoToDelete);
      const duplicates = allInscricoes.filter(i => createUniqueKey(i) === key);
      
      if (duplicates.length > 1) {
        // Se houver duplicatas, pergunta se quer excluir todas ou apenas esta
        const action = confirm(
          `Foram encontradas ${duplicates.length} inscrições para esta pessoa. ` +
          `Deseja excluir TODAS as inscrições duplicadas? ` +
          `(Clique OK para excluir todas, ou Cancelar para excluir apenas esta)`
        );
        
        if (action) {
          // Exclui todas as duplicatas
          const idsToDelete = duplicates.map(d => d.id);
          const { error } = await supabase
            .from("inscricoes")
            .delete()
            .in("id", idsToDelete);
            
          if (error) {
            toast.error("Erro ao excluir registros duplicados");
          } else {
            toast.success(`${duplicates.length} inscrições excluídas com sucesso`);
            fetchInscricoes();
          }
          return;
        }
      }
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-normal uppercase text-foreground">
          Inscrições
        </h1>
        {/* Dialog Update Status */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-normal">
                Editar Status da Inscrição
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Status do Pagamento</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="processando">Processando</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="relative w-full max-w-xs">
          {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
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
                  className="w-[300px] whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort("nome")}
                >
                  Nome <SortIcon col="nome" />
                </TableHead>
                <TableHead className="w-[190px] whitespace-nowrap">Telefone</TableHead>
                <TableHead className="w-[200px] whitespace-nowrap">Instagram</TableHead>
                <TableHead className="w-[340px] whitespace-nowrap">Comunidade</TableHead>
                <TableHead className="w-[280px] whitespace-nowrap">Cidade/Estado</TableHead>
                <TableHead className="w-[80px] text-center whitespace-nowrap">Camisa</TableHead>
                <TableHead className="w-[70px] text-center whitespace-nowrap">Idade</TableHead>
                <TableHead className="w-[150px] text-center whitespace-nowrap">Status</TableHead>
                <TableHead
                  className="w-[170px] text-center whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort("created_at")}
                >
                  Data da Inscrição <SortIcon col="created_at" />
                </TableHead>
                <TableHead className="w-[100px] text-center whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium truncate max-w-[180px]" title={i.nome}>{i.nome}</TableCell>
                  <TableCell className="">
                    {formatPhone(i.telefone)}
                  </TableCell>
                  <TableCell className="">
                    {
                      i.instagram.toLowerCase().includes("não tenho") ||
                      i.instagram.toLowerCase().includes("nao tenho")
                        ? i.instagram
                        : i.instagram.startsWith("@")
                        ? i.instagram
                        : `@${i.instagram}`
                    }
                  </TableCell>
                  <TableCell className="truncate max-w-[140px]" title={i.comunidade}>{i.comunidade}</TableCell>
                  <TableCell className="truncate max-w-[130px]" title={i.cidade_estado}>{i.cidade_estado}</TableCell>
                  <TableCell className="text-center">
                    {i.tamanho_camisa}
                  </TableCell>
                  <TableCell className="text-center truncate max-w-[70px]" title={(i as any).idade ?? "—"}>
                    {(i as any).idade ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusColor(i.status)}>{i.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {/* {new Date(i.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} */}
                    {new Date(i.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })} - {new Date(i.created_at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(i)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(i.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
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
