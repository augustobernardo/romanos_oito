import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { formSchema, type FormData } from "@/components/form/schema";
import {
  useLotes,
  getLoteDisponivel,
  getLoteDisponivelPaymentLink,
} from "@/hooks/useLotes";
import {
  InscricoesService,
  uploadComprovanteFile,
} from "@/services/inscricoes.service";
import {
  STRIPE_PAYMENT_LINK_BASE_URL,
  STRIPE_SERVO_AMIGO_PAYMENT_LINK,
} from "@/utils/stripe";
import { CuponsServoService } from "@/services/cuponsServo.service";

type PaymentMethod = "credit" | "pix" | "cupom" | null;
type PaymentStep =
  | "form"
  | "cupom_validation"
  | "cupom_servo"
  | "payment"
  | "confirmation";

export const useOikosForm = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("form");
  const [loteSelecionado, setLoteSelecionado] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [inscricaoId, setInscricaoId] = useState<number | null>(null);
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [comprovantePreview, setComprovantePreview] = useState<string | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [cupomCode, setCupomCode] = useState("");
  const [cupomValidating, setCupomValidating] = useState(false);
  const [cupomInfo, setCupomInfo] = useState<{
    nomeTitular: string | null;
    comprovanteUrl: string | null;
  } | null>(null);
  const [cupomServoCode, setCupomServoCode] = useState("");
  const [cupomServoValidating, setCupomServoValidating] = useState(false);
  const [cupomServoCodigo, setCupomServoCodigo] = useState<string | null>(null);

  const { toast } = useToast();
  const { lotes, loading: lotesLoading } = useLotes();
  const loteDisponivelId = getLoteDisponivel(lotes);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      dataNascimento: "",
      telefone: "",
      instagram: "",
      comunidade: "",
      cidadeEstado: "",
      enderecoCompleto: "",
      comoConheceu: "",
      comoConheceuOutro: "",
      nomeMae: "",
      numeroMae: "",
      nomePai: "",
      numeroPai: "",
      numeroResponsavelProximo: "",
      isCatolico: "",
      isCatolicoOutro: "",
      participaMovimento: "",
      fezRetiro: "",
      fezRetiroOutro: "",
      nomePessoaEmergencia: "",
      grauParentescoEmergencia: "",
      numeroEmergencia: "",
      tamanhoCamisa: "",
      cienteTrocaCamisa: false,
      expectativaOikos: "",
    },
  });

  const isLoteEspecialSelected = () => {
    if (!loteSelecionado) return false;
    const lote = lotes.find((l) => l.id === loteSelecionado);
    return lote?.is_especial ?? false;
  };

  const goToPaymentLink = () => {
    if (cupomServoCodigo) {
      window.location.href = STRIPE_SERVO_AMIGO_PAYMENT_LINK;
      return;
    }

    const selectedLotePaymentId = getLoteDisponivelPaymentLink(
      lotes,
      loteSelecionado!,
    );
    if (selectedLotePaymentId) {
      const paymentLink = `${STRIPE_PAYMENT_LINK_BASE_URL}${selectedLotePaymentId}`;
      const url = new URL(paymentLink);
      window.location.href = url.toString();
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (isLoteEspecialSelected()) {
      setCurrentStep("cupom_validation");
    } else {
      setCurrentStep("cupom_servo");
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const getInscricaoErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("cupom servo amigo")) {
      return "Este cupom Servo Amigo já foi utilizado ou está inativo.";
    }

    return "Tente novamente mais tarde.";
  };

  const handleCreditPayment = async () => {
    if (!loteSelecionado) {
      toast({
        title: "Erro ao processar pagamento",
        description: "Selecione um método de pagamento primeiro.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await InscricoesService.insertInscricao(
        loteSelecionado,
        form.getValues(),
        "credit",
        "confirmado",
        undefined,
        cupomServoCodigo,
      );
      if (error) throw error;

      goToPaymentLink();
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Erro ao salvar inscrição:", error);
      toast({
        title: "Erro ao processar inscrição",
        description: getInscricaoErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleCupomValidation = async () => {
    if (!cupomCode.trim()) {
      toast({ title: "Insira o código do cupom", variant: "destructive" });
      return;
    }

    setCupomValidating(true);
    try {
      const { data: result, error } = await InscricoesService.validarCupom(
        cupomCode.trim(),
      );
      if (error) throw error;

      const parsed = result as {
        valid: boolean;
        error?: string;
        nome_titular?: string;
        comprovante_url?: string;
      };

      if (!parsed.valid) {
        toast({
          title: "Cupom inválido",
          description: parsed.error,
          variant: "destructive",
        });
        return;
      }

      setCupomInfo({
        nomeTitular: parsed.nome_titular || null,
        comprovanteUrl: parsed.comprovante_url || null,
      });

      toast({
        title: "Cupom validado!",
        description: "Prossiga para o pagamento.",
      });
      setCurrentStep("payment");
    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      toast({
        title: "Erro ao validar cupom",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCupomValidating(false);
    }
  };

  const handleCupomPayment = async () => {
    if (!loteSelecionado) return;

    try {
      const { error } = await InscricoesService.insertInscricao(
        loteSelecionado,
        form.getValues(),
        "cupom",
        "confirmado",
        cupomInfo || undefined,
      );
      if (error) throw error;
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Erro ao salvar inscrição:", error);
      toast({
        title: "Erro ao processar inscrição",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handlePixPayment = async () => {
    if (!loteSelecionado || !comprovanteFile) {
      toast({
        title: "Comprovante necessário",
        description: "Selecione o comprovante de pagamento PIX.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      const { data: inscricaoData, error } =
        await InscricoesService.insertInscricao(
          loteSelecionado,
          form.getValues(),
          "pix",
          "confirmado",
          undefined,
          cupomServoCodigo,
        );
      if (error) throw error;

      setInscricaoId(inscricaoData.id);
      // Upload do arquivo retorna apenas o nome (sem URL completa nem metadata).
      const fileName = await uploadComprovanteFile(
        comprovanteFile,
        inscricaoData.id,
      );
      // Lote especial herda comprovante_url do cupom (compartilhado entre titulares
      // do mesmo cupom) e NÃO deve ser sobrescrito. Lote normal precisa persistir
      // o nome do próprio arquivo enviado, isolado por inscrição.
      if (!isLoteEspecialSelected()) {
        const { error: updateError } =
          await InscricoesService.updateComprovante(inscricaoData.id, fileName);
        if (updateError) throw updateError;
      }

      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
      toast({
        title: "Erro ao processar pagamento",
        description: getInscricaoErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyPixKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Chave copiada!",
      description: "A chave PIX foi copiada para a área de transferência.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem (PNG, JPG, etc).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O comprovante deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setComprovanteFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprovantePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearComprovante = () => {
    setComprovanteFile(null);
    setComprovantePreview(null);
  };

  const handleBackToForm = () => {
    setCurrentStep("form");
    setPaymentMethod(null);
    setComprovanteFile(null);
    setComprovantePreview(null);
    setCupomCode("");
    setCupomInfo(null);
    setCupomServoCode("");
    setCupomServoCodigo(null);
  };

  const handleBackFromPaymentToForm = () => {
    if (isLoteEspecialSelected()) {
      setCurrentStep("cupom_validation");
    } else {
      setCurrentStep("cupom_servo");
      setPaymentMethod(null);
      setComprovanteFile(null);
      setComprovantePreview(null);
    }
  };

  const handleCupomServoValidation = async () => {
    const sanitized = cupomServoCode.trim().toUpperCase();
    if (!sanitized) {
      toast({ title: "Insira o cupom do servo", variant: "destructive" });
      return;
    }

    setCupomServoValidating(true);
    try {
      const { data: result, error } =
        await CuponsServoService.validar(sanitized);
      if (error) throw error;

      const parsed = result as {
        valid: boolean;
        error?: string;
        codigo?: string;
        nome_servo?: string;
      };

      if (!parsed.valid) {
        toast({
          title: "Código inválido",
          description: parsed.error,
          variant: "destructive",
        });
        return;
      }

      setCupomServoCodigo(parsed.codigo ?? sanitized);
      toast({
        title: "Cupom validado!",
        description: parsed.nome_servo
          ? `Servo: ${parsed.nome_servo}`
          : "Prossiga para o pagamento.",
      });
      setCurrentStep("payment");
    } catch (error) {
      console.error("Erro ao validar o cupom do servo:", error);
      toast({
        title: "Erro ao validar código",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCupomServoValidating(false);
    }
  };

  const handleSkipCupomServo = () => {
    setCupomServoCode("");
    setCupomServoCodigo(null);
    setCurrentStep("payment");
  };

  return {
    currentStep,
    setCurrentStep,
    loteSelecionado,
    setLoteSelecionado,
    paymentMethod,
    inscricaoId,
    comprovanteFile,
    comprovantePreview,
    uploading,
    cupomCode,
    setCupomCode,
    cupomValidating,
    cupomInfo,
    cupomServoCode,
    setCupomServoCode,
    cupomServoValidating,
    cupomServoCodigo,
    form,
    lotes,
    lotesLoading,
    loteDisponivelId,
    isLoteEspecialSelected,
    handleFormSubmit,
    handlePaymentMethodSelect,
    handleCreditPayment,
    handleCupomValidation,
    handleCupomPayment,
    handlePixPayment,
    handleCopyPixKey,
    handleFileChange,
    clearComprovante,
    handleBackToForm,
    handleBackFromPaymentToForm,
    handleCupomServoValidation,
    handleSkipCupomServo,
  };
};
