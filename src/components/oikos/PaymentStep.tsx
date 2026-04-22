import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  QrCode,
  Upload,
  X,
  Copy,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import qrCodePix from "@/assets/qr_code_pix.png";
import {
  PIX_KEY,
  PIX_RECEIVER_NAME,
  STRIPE_PAYMENT_LINK_BASE_URL,
} from "@/utils/stripe";

import { WHATSAPP_NUMBER_FORMATTED } from "@/config/constants";

type PaymentMethod = "credit" | "pix" | "cupom" | null;

interface PaymentStepProps {
  isEspecial: boolean;
  paymentMethod: PaymentMethod;
  comprovantePreview: string | null;
  comprovanteFile: File | null;
  uploading: boolean;
  cupomInfo: {
    nomeTitular: string | null;
    comprovanteUrl: string | null;
  } | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onCreditPayment: () => void;
  onCupomPayment: () => void;
  onPixPayment: () => void;
  onCopyPixKey: (key: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearComprovante: () => void;
  onBack: () => void;
}

export const PaymentStep = ({
  isEspecial,
  paymentMethod,
  comprovantePreview,
  comprovanteFile,
  uploading,
  onSelectMethod,
  onCreditPayment,
  onCupomPayment,
  onPixPayment,
  onCopyPixKey,
  onFileChange,
  onClearComprovante,
  onBack,
}: PaymentStepProps) => {
  const [pixKeyCopied, setPixKeyCopied] = useState(false);

  const handleCopyPixKey = () => {
    onCopyPixKey(PIX_KEY);
    setPixKeyCopied(true);
    setTimeout(() => setPixKeyCopied(false), 2000);
  };

  const handleCreditClick = () => {
    // if (isEspecial) {
    //   onCupomPayment();
    // } else {
    //   onCreditPayment();
    // }
    onCreditPayment();
  };

  const handlePixSubmit = async () => {
    if (isEspecial) {
      try {
        onPixPayment();
      } catch {
        // Error handled inside onPixPayment
      }
    } else {
      onPixPayment();
    }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMethod("credit")}
            className={`
              cursor-pointer rounded-lg border-2 p-6 transition-all
              ${
                paymentMethod === "credit"
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
                    paymentMethod === "credit"
                      ? "hsl(195,100%,45%)"
                      : "#9ca3af",
                }}
              />
              <span
                className="font-medium"
                style={{
                  color:
                    paymentMethod === "credit"
                      ? "hsl(195,100%,45%)"
                      : "#393939",
                }}
              >
                Cartão de Crédito
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMethod("pix")}
            className={`
              cursor-pointer rounded-lg border-2 p-6 transition-all
              ${
                paymentMethod === "pix"
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
                    paymentMethod === "pix" ? "hsl(195,100%,45%)" : "#9ca3af",
                }}
              />
              <span
                className="font-medium"
                style={{
                  color:
                    paymentMethod === "pix" ? "hsl(195,100%,45%)" : "#393939",
                }}
              >
                PIX
              </span>
            </div>
          </motion.div>
        </div>

        {paymentMethod === "credit" && (
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
            <p className="text-center text-muted-foreground">
              Você será redirecionado para uma página segura para realizar o
              pagamento com cartão de crédito.
            </p>
            {isEspecial && (
              <p
                className="text-center text-lg font-semibold"
                style={{ color: "hsl(195 100% 45%)" }}
              >
                O valor no cartão é de R$ 317,90
              </p>
            )}
            <Button
              size="lg"
              className="w-full max-w-xs hover:bg-[#faf7ef]/90 text-white"
              style={{ backgroundColor: "hsl(195 100% 45%)" }}
              onClick={handleCreditClick}
              disabled={!paymentMethod}
            >
              Ir para pagamento
            </Button>
          </motion.div>
        )}

        {paymentMethod === "pix" && (
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
                Ou copie a chave PIX:
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-white rounded-md border px-3 py-2 text-md text-black font-bold text-center">
                  {PIX_KEY}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={handleCopyPixKey}
                >
                  {pixKeyCopied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
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

            <p className="text-center text-sm text-muted-foreground mt-2">
              {/*Fique tranquilo! Após o envio do comprovante, sua inscrição será
              confirmada pela nossa equipe em até 5 minutos.*/}
              Seja bem-vindo ao melhor fim de semana da sua vida. Dúvidas? Entre
              em contato com SAC{" "}
              <a
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER_FORMATTED}&text=Olá! Preciso de ajuda com o cupom especial do OIKOS 2026.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {WHATSAPP_NUMBER_FORMATTED}
              </a>
              . Tmj, ehnois! Romanos Oito
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
