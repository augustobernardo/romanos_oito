import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

type PaymentMethod = "credit" | "pix" | "cupom" | null;

const confirmationMessages: Record<
  string,
  { title: string; mainMessage: string; instruction: string }
> = {
  pix: {
    title: "Comprovante enviado!",
    mainMessage: "Seu comprovante foi enviado com sucesso para nossa equipe.",
    instruction:
      "Seja bem-vindo ao melhor fim de semana da sua vida. Dúvidas? Entre em contato com SAC (33) 99842-7416. Tmj, ehnois! Romanos Oito",
  },
  cupom: {
    title: "Inscrição confirmada!",
    mainMessage:
      "Seu cupom foi validado e sua inscrição foi confirmada com sucesso!",
    instruction:
      "Não é necessário nenhum pagamento adicional. Nos vemos no OIKOS!",
  },
  credit: {
    title: "Redirecionamento realizado!",
    mainMessage: "Você foi redirecionado para o ambiente seguro de pagamento.",
    instruction:
      "Após a confirmação do pagamento, sua inscrição será automaticamente confirmada.",
  },
};

export const ConfirmationScreen = ({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod;
}) => {
  const messages = confirmationMessages[paymentMethod ?? "credit"];

  return (
    <div className="flex-1 px-4 py-8 md:px-6 min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md w-full"
      >
        <div className="bg-[#fffbef] rounded-2xl border shadow-lg p-8 md:p-10 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl md:text-3xl font-bold text-[#393939]"
          >
            {messages.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground">{messages.mainMessage}</p>
            <p className="text-sm text-muted-foreground">
              {messages.instruction}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground pt-2"
          >
            Esta é uma mensagem automática. O status do seu pagamento será
            atualizado em breve.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};
