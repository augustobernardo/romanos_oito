import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  warning?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Confirmar exclusão",
  description = "Tem certeza que deseja excluir este item?",
  warning = "Esta ação não pode ser desfeita.",
  cancelLabel = "Cancelar",
  confirmLabel = "Excluir",
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-normal text-xl">{title}</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p className="text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground mt-1">{warning}</p>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
