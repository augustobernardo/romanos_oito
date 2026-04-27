import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CuponsServoService,
  getNextServoCouponCode,
  type CupomServo,
} from "@/services/cuponsServo.service";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Copy, RefreshCw, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";

const AdminCuponsServo = () => {
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createNomeServo, setCreateNomeServo] = useState("");
  const [creating, setCreating] = useState(false);

  const [editCupom, setEditCupom] = useState<CupomServo | null>(null);
  const [editNomeServo, setEditNomeServo] = useState("");
  const [editAtivo, setEditAtivo] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: cupons = [], isLoading } = useQuery({
    queryKey: ["cupons_servo"],
    queryFn: async () => {
      const { data, error } =
        await CuponsServoService.findAllWithEncontristas();
      if (error) throw error;
      return data ?? [];
    },
  });

  const refetch = () =>
    queryClient.invalidateQueries({ queryKey: ["cupons_servo"] });

  const insertMutation = useMutation({
    mutationFn: async (payload: { codigo: string; nome_servo: string }) =>
      await CuponsServoService.insert(payload),
    onSuccess: () => {
      toast.success("Cupom criado!");
      refetch();
    },
    onError: () => toast.error("Erro ao criar cupom"),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      nome_servo: string;
      ativo: boolean;
    }) =>
      await CuponsServoService.update(payload.id, {
        nome_servo: payload.nome_servo,
        ativo: payload.ativo,
      }),
    onSuccess: () => {
      toast.success("Cupom atualizado!");
      refetch();
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await CuponsServoService.deleteById(id),
    onSuccess: () => {
      toast.success("Cupom excluído");
      refetch();
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  const handleOpenCreate = () => {
    setCreateNomeServo("");
    setCreateDialogOpen(true);
  };

  const handleCreate = async () => {
    const nome = createNomeServo.trim();
    if (!nome) {
      toast.error("Informe o nome do servo");
      return;
    }
    setCreating(true);
    try {
      const codigo = await getNextServoCouponCode();
      insertMutation.mutate(
        { codigo, nome_servo: nome },
        {
          onSettled: () => {
            setCreating(false);
            setCreateDialogOpen(false);
          },
        },
      );
    } catch {
      setCreating(false);
      toast.error("Erro ao gerar código");
    }
  };

  const openEdit = (cupom: CupomServo) => {
    setEditCupom(cupom);
    setEditNomeServo(cupom.nome_servo);
    setEditAtivo(cupom.ativo);
  };

  const handleSaveEdit = () => {
    if (!editCupom) return;
    const nome = editNomeServo.trim();
    if (!nome) {
      toast.error("Informe o nome do servo");
      return;
    }
    setSaving(true);
    updateMutation.mutate(
      { id: editCupom.id, nome_servo: nome, ativo: editAtivo },
      {
        onSettled: () => {
          setSaving(false);
          setEditCupom(null);
        },
      },
    );
  };

  const handleCopy = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast.success("Código copiado!");
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    setDeleteDialogOpen(false);
    deleteMutation.mutate(deleteId);
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Servos amigos
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo cupom
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Cupons de rastreio no formato <strong>SERVOAMIGO#XXX</strong>. Eles não
        alteram o valor da inscrição — servem para identificar qual servo está
        convidando mais pessoas e qual encontrista utilizou cada código.
      </p>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : cupons.length === 0 ? (
        <p className="text-muted-foreground">Nenhum cupom cadastrado.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center whitespace-nowrap">
                  Código
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Nome do servo
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Encontrista
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="text-center whitespace-nowrap">
                  Criado em
                </TableHead>
                <TableHead className="w-28 whitespace-nowrap">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-center text-sm">
                    {c.codigo}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {c.nome_servo}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {c.nome_encontrista ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {c.ativo ? (
                      <Badge className="bg-green-600">Ativo</Badge>
                    ) : (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(c)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(c.codigo)}
                        title="Copiar código"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(c.id)}
                        title="Excluir"
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo cupom de servo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="nome_servo_create">Nome do servo</Label>
              <Input
                id="nome_servo_create"
                value={createNomeServo}
                onChange={(e) => setCreateNomeServo(e.target.value)}
                placeholder="Ex: João da Silva"
                maxLength={100}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              O código será gerado automaticamente no formato SERVOAMIGO#XXX.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editCupom}
        onOpenChange={(open) => !open && setEditCupom(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cupom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Código</Label>
              <Input
                value={editCupom?.codigo ?? ""}
                disabled
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="nome_servo_edit">Nome do servo</Label>
              <Input
                id="nome_servo_edit"
                value={editNomeServo}
                onChange={(e) => setEditNomeServo(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo_edit">Cupom ativo</Label>
              <Switch
                id="ativo_edit"
                checked={editAtivo}
                onCheckedChange={setEditAtivo}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCupom(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        description="Tem certeza que deseja excluir este cupom?"
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminCuponsServo;
