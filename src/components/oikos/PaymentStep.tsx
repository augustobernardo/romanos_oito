import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  QrCode,
  Upload,
  X,
  ArrowLeft,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PixCopyButton } from "@/components/ui/pix-copy-button";
import qrCodePix from "@/assets/qr_code_pix.png";
import { PIX_KEY, PIX_RECEIVER_NAME } from "@/utils/pix";
import { WHATSAPP_NUMBER_FORMATTED } from "@/config/constants";

type PaymentCard = "pix" | "cartao";

interface PaymentStepProps {
  isEspecial: boolean;
  comprovantePreview: string | null;
  comprovanteFile: File | null;
  uploading: boolean;
  cupomInfo: {
    nomeTitular: string | null;
    comprovanteUrl: string | null;
  } | null;
  onPixPayment: () => void;
  onCardManualPayment: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearComprovante: () => void;
  onBack: () => void;
}

export const PaymentStep = ({
  isEspecial,
  comprovantePreview,
  comprovanteFile,
  uploading,
  onPixPayment,
  onCardManualPayment,
  onFileChange,
  onClearComprovante,
  onBack,
}: PaymentStepProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentCard>("pix");

  const handlePixSubmit = async () => {
    onPixPayment();
  };

  const handleCardSubmit = async () => {
    onCardManualPayment();
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
            OIKOS 2026 — escolha a forma de pagamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMethod("pix")}
            className={`
              cursor-pointer rounded-lg border-2 p-6 transition-all
              ${
                selectedMethod === "pix"
                  ? "border-[hsl(195,100%,45%)] bg-[#fffbef]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <QrCode
                className="h-8 w-8"
                style={{
                  color:
                    selectedMethod === "pix"
                      ? "hsl(195,100%,45%)"
                      : "#9ca3af",
                }}
              />
              <span
                className="font-medium"
                style={{
                  color:
                    selectedMethod === "pix"
                      ? "hsl(195,100%,45%)"
                      : "#393939",
                }}
              >
                PIX
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMethod("cartao")}
            className={`
              cursor-pointer rounded-lg border-2 p-6 transition-all
              ${
                selectedMethod === "cartao"
                  ? "border-[hsl(195,100%,45%)] bg-[#fffbef]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <CreditCard
                className="h-8 w-8"
                style={{
                  color:
                    selectedMethod === "cartao"
                      ? "hsl(195,100%,45%)"
                      : "#9ca3af",
                }}
              />
              <span
                className="font-medium"
                style={{
                  color:
                    selectedMethod === "cartao"
                      ? "hsl(195,100%,45%)"
                      : "#393939",
                }}
              >
                Cartão
              </span>
            </div>
          </motion.div>
        </div>

        {selectedMethod === "pix" && (
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

            <div className="w-full max-w-[300px] aspect-square bg-white flex items-center justify-center">
              <img
                src={qrCodePix}
                className="w-full h-full"
                alt="QR Code PIX"
              />
            </div>

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
        )}

        {selectedMethod === "cartao" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 rounded-lg border bg-[#fffbef] p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full">
              <CreditCard
                className="h-7 w-7 text-primary"
                style={{ color: "hsl(195 100% 45%)" }}
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 w-full max-w-sm">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Após finalizar sua inscrição, entre em contato com o SAC para realizar o pagamento no cartão.
              </p>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=5533998427416&text=Olá! Gostaria de realizar o pagamento do OIKOS 2026 no cartão.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-sm"
            >
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 min-h-[44px]"
                type="button"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Falar com SAC no WhatsApp
              </Button>
            </a>

            <Button
              className="w-full max-w-sm"
              style={{ backgroundColor: "hsl(195 100% 45%)" }}
              onClick={handleCardSubmit}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Continuar com pagamento em cartão
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
