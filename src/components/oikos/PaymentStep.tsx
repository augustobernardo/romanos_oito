import { motion } from "framer-motion";
import {
  CheckCircle,
  QrCode,
  Upload,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PixCopyButton } from "@/components/ui/pix-copy-button";
import { PixQRCode } from "./PixQRCode";
import { PIX_KEY, PIX_RECEIVER_NAME } from "@/utils/pix";

interface PaymentStepProps {
  isEspecial: boolean;
  lotePreco: string | null;
  comprovantePreview: string | null;
  comprovanteFile: File | null;
  uploading: boolean;
  onPixPayment: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearComprovante: () => void;
  onBack: () => void;
}

export const PaymentStep = ({
  isEspecial,
  lotePreco,
  comprovantePreview,
  comprovanteFile,
  uploading,
  onPixPayment,
  onFileChange,
  onClearComprovante,
  onBack,
}: PaymentStepProps) => {
  const handlePixSubmit = async () => {
    onPixPayment();
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-2 text-[#393939] hover:text-[hsl(195,100%,45%)]"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {isEspecial && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-500 text-white">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-sm text-green-600 font-medium">
                Cupom Validado
              </span>
            </div>
            <div className="w-8 h-px bg-gray-300 mx-2" />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: "hsl(195 100% 45%)" }}
              >
                2
              </div>
              <span className="text-sm font-medium text-[#393939]">
                Pagamento
              </span>
            </div>
          </div>
        )}

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#393939] uppercase md:text-3xl">
            Finalizar pagamento
          </h1>
          <p className="mt-2 text-muted-foreground">
            OIKOS 2026 — pagamento via PIX
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-6 rounded-lg border bg-[#fffbef] p-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full">
            <QrCode
              className="h-7 w-7 text-primary"
              style={{ color: "hsl(195 100% 45%)" }}
            />
          </div>

            {isEspecial && (
              <p
                className="text-center text-lg font-semibold"
                style={{ color: "hsl(195 100% 45%)" }}
              >
                No PIX, o valor é de R$ 300,00
              </p>
            )}

            <PixQRCode preco={lotePreco} />

            <div className="w-full max-w-sm flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-[#393939] text-center">
                Clique no botão abaixo para copiar a chave PIX:
              </p>
              <PixCopyButton
                pixKey={PIX_KEY}
                className="min-w-[200px] min-h-[44px]"
              />
            </div>

            <div className="w-full max-w-sm flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-[#393939] text-center">
                Nome do recebedor:
              </p>
              <div className="bg-white rounded-md border px-3 py-2 text-md font-bold text-black text-center">
                {PIX_RECEIVER_NAME}
              </div>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <p className="text-sm font-medium text-[#393939] text-center">
                Após realizar o pagamento, envie o comprovante:
              </p>

              {!comprovantePreview ? (
                <div className="flex flex-col items-center gap-4">
                  <label
                    htmlFor="comprovante"
                    className="w-full cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[hsl(195,100%,45%)] transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Clique para selecionar o comprovante
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG ou JPEG (máx. 5MB)
                      </p>
                    </div>
                    <input
                      id="comprovante"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={comprovantePreview}
                      alt="Preview do comprovante"
                      className="w-full rounded-lg border max-h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white hover:text-[#00ace6]"
                      onClick={onClearComprovante}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="w-full"
                    style={{ backgroundColor: "hsl(195 100% 45%)" }}
                    onClick={handlePixSubmit}
                    disabled={uploading || !comprovanteFile}
                  >
                    {uploading ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Finalizar pagamento
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
      </div>
    </div>
  );
};
