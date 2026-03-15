import { useEffect, useState } from "react";
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
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
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

type Inscricao = Tables<"inscricoes">;

const formatPhone = (phone: string) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const emptyInscricao = { status: "" };

// Função para criar uma chave única baseada em nome e telefone
const createUniqueKey = (inscricao: Inscricao) => {
  return `${inscricao.nome.trim().toLowerCase()}_${inscricao.telefone}`;
};

// Função para filtrar apenas os registros mais recentes por chave única
const getUniqueRecentInscricoes = (inscricoes: Inscricao[]) => {
  const uniqueMap = new Map();
  
  inscricoes.forEach(inscricao => {
    const key = createUniqueKey(inscricao);
    const existing = uniqueMap.get(key);
    
    // Se não existir ou se este registro for mais recente, adiciona/substitui
    if (!existing || new Date(inscricao.created_at) > new Date(existing.created_at)) {
      uniqueMap.set(key, inscricao);
    }
  });
  
  return Array.from(uniqueMap.values());
};

const AdminInscricoes = () => {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Inscricao | null>(null);
  const [form, setForm] = useState(emptyInscricao);
  const [allInscricoes, setAllInscricoes] = useState<Inscricao[]>([]);

  const fetchInscricoes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("inscricoes")
      .select("*")
      .order("nome", { ascending: true });

    setAllInscricoes(data ?? []);
    
    // Aplica o filtro de registros únicos (apenas o mais recente por nome+telefone)
    const uniqueInscricoes = getUniqueRecentInscricoes(data ?? []);
    setInscricoes(uniqueInscricoes);
    setLoading(false);
  };

  useEffect(() => {
    fetchInscricoes();
  }, []);

  const openNew = () => { setEditing(null); setForm(emptyInscricao); setOpen(true); };

  const filtered = inscricoes.filter(
    (i) =>
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      i.telefone.includes(search) ||
      i.comunidade.toLowerCase().includes(search.toLowerCase()),
  );

  const statusColor = (s: string) => {
    if (s === "confirmado") return "default";
    if (s === "processando") return "secondary";
    return "destructive";
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

  // const handleDelete = async (id: string) => {
  //   if (!confirm("Tem certeza que deseja excluir esta inscrição?")) return;
  //   const { error } = await supabase.from("inscricoes").delete().eq("id", id);
  //   if (error) {
  //     toast.error("Erro ao excluir");
  //   } else {
  //     toast.success("Inscrição excluída com sucesso");
  //     fetchInscricoes();
  //   }
  // };

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
        <h1 className="font-display text-2xl font-bold text-foreground">
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} inscrição(ões) encontrada(s)
      </p>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">Telefone</TableHead>
                <TableHead className="text-center">Comunidade</TableHead>
                <TableHead className="text-center">Cidade/Estado</TableHead>
                <TableHead className="text-center">Camisa</TableHead>
                <TableHead className="text-center">Idade</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.nome}</TableCell>
                  <TableCell className="text-center">
                    {formatPhone(i.telefone)}
                  </TableCell>
                  <TableCell className="text-center">{i.comunidade}</TableCell>
                  <TableCell className="text-center">
                    {i.cidade_estado}
                  </TableCell>
                  <TableCell className="text-center">
                    {i.tamanho_camisa}
                  </TableCell>
                  <TableCell className="text-center">
                    {(i as any).idade ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusColor(i.status)}>{i.status}</Badge>
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
