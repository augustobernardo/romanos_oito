import { motion, AnimatePresence } from "framer-motion";
import { QrCode, AlertCircle } from "lucide-react";
import { getPixQRCode } from "@/utils/getPixQRCode";

interface PixQRCodeProps {
  preco: string | null;
}

export const PixQRCode = ({ preco }: PixQRCodeProps) => {
  if (!preco) {
    return (
      <div className="w-full max-w-[300px] aspect-square bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 p-4">
        <QrCode className="h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-400 text-center">
          Selecione um lote para visualizar o QRCode
        </p>
      </div>
    );
  }

  const qrCodeSrc = getPixQRCode(preco);

  if (!qrCodeSrc) {
    return (
      <div className="w-full max-w-[300px] aspect-square bg-white border border-dashed border-amber-300 rounded-lg flex flex-col items-center justify-center gap-3 p-4">
        <AlertCircle className="h-10 w-10 text-amber-400" />
        <p className="text-sm text-amber-600 text-center font-medium">
          QRCode não disponível para este lote.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={qrCodeSrc}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[300px] aspect-square bg-white flex items-center justify-center"
      >
        <img
          src={qrCodeSrc}
          className="w-full h-full"
          alt="QR Code PIX"
        />
      </motion.div>
    </AnimatePresence>
  );
};
