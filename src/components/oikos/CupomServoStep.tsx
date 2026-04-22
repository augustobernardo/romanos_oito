import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Tag, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CupomServoStepProps {
  cupomCode: string;
  setCupomCode: (code: string) => void;
  cupomValidating: boolean;
  onValidate: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const CupomServoStep = ({
  cupomCode,
  setCupomCode,
  cupomValidating,
  onValidate,
  onSkip,
  onBack,
}: CupomServoStepProps) => {
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
              Servo amigo
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
            Algum servo te indicou?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Se algum servo te convidou, insira o cupom que ele te enviou. Essa
            etapa é <strong>opcional</strong>.
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
            Insira o cupom que o servo te enviou.
          </p>
          <div className="w-full max-w-xs space-y-3">
            <input
              type="text"
              placeholder="Cole o código aqui"
              value={cupomCode}
              onChange={(e) => setCupomCode(e.target.value)}
              maxLength={50}
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
                  Validar e continuar
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-[#393939]"
              onClick={onSkip}
              disabled={cupomValidating}
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Não tenho cupom, pular etapa
            </Button>
          </div>
          {/*<p className="text-center text-xs text-muted-foreground">
            Esse código é apenas para identificarmos quem te convidou. Não
            altera o valor da inscrição.
          </p>*/}
        </motion.div>
      </div>
    </div>
  );
};
