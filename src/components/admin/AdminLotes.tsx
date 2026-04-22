import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LotesService } from "@/services/lotes.service";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lote = Tables<"lotes">;

const emptyLote = { nome: "", preco: "", ordem: 1, status: "disponivel" };

const AdminLotes = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lote | null>(null);
  const [form, setForm] = useState(emptyLote);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: lotes = [], isLoading } = useQuery({
    queryKey: ["lotes"],
    queryFn: async () => {
      const { data, error } = await LotesService.findAll();
      if (error) throw error;
      return data ?? [];
    },
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["lotes"] });

  const loteMutation = useMutation({
    mutationFn: async ({ action, payload }: { action: string; payload: unknown }) => {
      if (action === "insert") return await LotesService.insert(payload as Tables<"lotes">);
      if (action === "update") {
        const { id, ...data } = payload as Tables<"lotes"> & { id: number };
        return await LotesService.update(id, data);
      }
      return await LotesService.deleteById(payload as number);
    },
    onSuccess: (_, { action }) => {
      if (action === "insert") toast.success("Lote criado");
      else if (action === "update") toast.success("Lote atualizado");
      else toast.success("Excluído");
      refetch();
    },
    onError: (_, { action }) => {
      if (action === "insert") toast.error("Erro ao criar");
      else if (action === "update") toast.error("Erro ao atualizar");
      else toast.error("Erro ao excluir");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm(emptyLote);
    setOpen(true);
  };
  const openEdit = (l: Lote) => {
    setEditing(l);
    setForm({
      nome: l.nome,
      preco: l.preco,
      ordem: l.ordem,
      status: l.status ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome || !form.preco) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    const payload = {
      nome: form.nome,
      preco: form.preco,
      ordem: form.ordem,
      status: form.status,
    };
    loteMutation.mutate({
      action: editing ? "update" : "insert",
      payload: editing ? { ...payload, id: editing.id } : payload,
    });
    setOpen(false);
  };

  const handleDeleteClick = (id: number) => { setDeleteId(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = () => {
    if (!deleteId) return;
    setDeleteDialogOpen(false);
    loteMutation.mutate({ action: "delete", payload: deleteId });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-normal uppercase text-foreground">
          Lotes
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Lote" : "Novo Lote"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço</Label>
                  <Input
                    value={form.preco}
                    onChange={(e) =>
                      setForm({ ...form, preco: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={form.ordem}
                    onChange={(e) =>
                      setForm({ ...form, ordem: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="embreve">Em Breve</option>
                  <option value="disponivel">Disponível</option>
                  <option value="esgotado">Esgotado</option>
                  <option value="indisponivel">Indisponível</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center whitespace-nowrap">
                  Nome
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Preço
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Ordem
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="w-24 whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium text-center">
                    {l.nome}
                  </TableCell>
                  <TableCell className="text-center">{l.preco}</TableCell>
                  <TableCell className="text-center">{l.ordem}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        l.status === "disponivel" ? "default" : "secondary"
                      }
                    >
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(l)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(l.id)}
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        description="Tem certeza que deseja excluir este lote?"
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminLotes;
