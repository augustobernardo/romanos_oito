import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventosService } from "@/services/eventos.service";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Evento = Tables<"eventos">;

const emptyEvento = {
  nome: "",
  descricao: "",
  local: "",
  data_inicio: "",
  data_fim: "",
  status: "ativo",
  tem_lote: true,
};

const formatDateEvento = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const AdminEventos = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);
  const [form, setForm] = useState(emptyEvento);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ["eventos"],
    queryFn: async () => {
      const { data, error } = await EventosService.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["eventos"] });

  const eventoMutation = useMutation({
    mutationFn: async ({ action, payload }: { action: string; payload: unknown }) => {
      if (action === "insert") return await EventosService.insert(payload as Tables<"eventos">);
      if (action === "update") {
        const { id, ...data } = payload as Tables<"eventos"> & { id: string };
        return await EventosService.update(id, data);
      }
      return await EventosService.deleteById(payload as string);
    },
    onSuccess: (_, { action }) => {
      if (action === "insert") toast.success("Evento criado");
      else if (action === "update") toast.success("Evento atualizado");
      else toast.success("Excluído");
      refetch();
    },
    onError: (_, { action }) => {
      if (action === "insert") toast.error("Erro ao criar");
      else if (action === "update") toast.error("Erro ao atualizar");
      else toast.error("Erro ao excluir");
    },
  });

  const openNew = () => { setEditing(null); setForm(emptyEvento); setOpen(true); };
  const openEdit = (e: Evento) => {
    setEditing(e);
    setForm({
      nome: e.nome,
      descricao: e.descricao ?? "",
      local: e.local ?? "",
      data_inicio: e.data_inicio ?? "",
      data_fim: e.data_fim ?? "",
      status: e.status,
      tem_lote: e.tem_lote,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome) { toast.error("Nome é obrigatório"); return; }
    const payload = {
      nome: form.nome,
      descricao: form.descricao || null,
      local: form.local || null,
      data_inicio: form.data_inicio || null,
      data_fim: form.data_fim || null,
      status: form.status,
      tem_lote: form.tem_lote,
    };
    eventoMutation.mutate({
      action: editing ? "update" : "insert",
      payload: editing ? { ...payload, id: editing.id } : payload,
    });
    setOpen(false);
  };

  const handleDeleteClick = (id: string) => { setDeleteId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = () => {
    if (!deleteId) return;
    setDeleteDialogOpen(false);
    eventoMutation.mutate({ action: "delete", payload: deleteId });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-normal uppercase text-foreground">Eventos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Novo Evento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div><Label>Descrição</Label><Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
              <div><Label>Local</Label><Input value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Data Início</Label><Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} /></div>
                <div><Label>Data Fim</Label><Input type="date" value={form.data_fim} onChange={(e) => setForm({ ...form, data_fim: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Status</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.tem_lote} onChange={(e) => setForm({ ...form, tem_lote: e.target.checked })} />
                    Tem Lote
                  </label>
                </div>
              </div>
              <Button className="w-full" onClick={handleSave}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p className="text-muted-foreground">Carregando...</p> : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center whitespace-nowrap">Nome</TableHead>
                <TableHead className="text-center whitespace-nowrap">Local</TableHead>
                <TableHead className="text-center whitespace-nowrap">Status</TableHead>
                <TableHead className="text-center whitespace-nowrap">Datas</TableHead>
                <TableHead className="w-24 text-center whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-center">{e.nome}</TableCell>
                  <TableCell className="text-center">{e.local}</TableCell>
                  <TableCell className="text-center"><Badge variant={e.status === "ativo" ? "default" : "secondary"}>{e.status}</Badge></TableCell>
                  <TableCell className="text-sm text-center">{formatDateEvento(e.data_inicio)} — {formatDateEvento(e.data_fim)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        description="Tem certeza que deseja excluir este evento?"
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminEventos;
