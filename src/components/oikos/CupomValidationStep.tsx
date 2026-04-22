import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Tag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/config/constants";

interface CupomValidationStepProps {
  cupomCode: string;
  setCupomCode: (code: string) => void;
  cupomValidating: boolean;
  onValidate: () => void;
  onBack: () => void;
}

export const CupomValidationStep = ({
  cupomCode,
  setCupomCode,
  cupomValidating,
  onValidate,
  onBack,
}: CupomValidationStepProps) => {
  return (
    <div className="flex-1 px-4 py-8 md:px-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-2 text-[#393939] hover:text-[hsl(195,100%,45%)]"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao formulário
        </Button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: "hsl(195 100% 45%)" }}
            >
              1
            </div>
            <span className="text-sm font-medium text-[#393939]">
              Validar Cupom
            </span>
          </div>
          <div className="w-8 h-px bg-gray-300 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-500">
              2
            </div>
            <span className="text-sm text-gray-400">Pagamento</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#393939] uppercase md:text-3xl">
            Validar Cupom Especial
          </h1>
          <p className="mt-2 text-muted-foreground">
            Insira o código do cupom VC+2 que você recebeu
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-6 rounded-lg border bg-[#fffbef] p-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full">
            <Tag className="h-7 w-7" style={{ color: "hsl(195 100% 45%)" }} />
          </div>
          <p className="text-center text-muted-foreground">
            Insira o código do cupom especial que você recebeu.
          </p>
          <div className="w-full max-w-xs space-y-4">
            <input
              type="text"
              placeholder="Cole o código do cupom aqui"
              value={cupomCode}
              onChange={(e) => setCupomCode(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-center font-mono tracking-wider"
            />
            <Button
              size="lg"
              className="w-full text-white"
              style={{ backgroundColor: "hsl(195 100% 45%)" }}
              onClick={onValidate}
              disabled={cupomValidating || !cupomCode.trim()}
            >
              {cupomValidating ? (
                "Validando..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validar cupom
                </>
              )}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            O cupom especial é válido para até 3 inscrições do mesmo grupo.
          </p>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Você não tem um CUPOM para validação? Chama o SAC no WPP no botão
              abaixo que a gente te ajuda
            </p>
            <Button
              size="sm"
              className="text-white"
              style={{ backgroundColor: "hsl(195 100% 45%)" }}
              asChild
            >
              <a
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=Olá! Preciso de ajuda com o cupom especial do OIKOS 2026.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com o SAC
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
