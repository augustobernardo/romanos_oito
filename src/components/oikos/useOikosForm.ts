import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { formSchema, type FormData } from "@/components/form/schema";
import {
  useLotes,
  getLoteDisponivel,
} from "@/hooks/useLotes";
import {
  InscricoesService,
  uploadComprovanteFile,
} from "@/services/inscricoes.service";
import { CuponsServoService } from "@/services/cuponsServo.service";
import { validateParticipantAge } from "@/utils/validateParticipantAge";
import { AGE_RULES } from "@/config/ageRules";

type PaymentStep =
  | "form"
  | "cupom_validation"
  | "cupom_servo"
  | "payment"
  | "confirmation";

type PaymentMethodUsed = "pix" | "cupom" | null;

export const useOikosForm = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("form");
  const [loteSelecionado, setLoteSelecionado] = useState<number | null>(null);
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
  const [paymentMethodUsed, setPaymentMethodUsed] = useState<PaymentMethodUsed>(null);

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

  useEffect(() => {
    const dataNascimento = form.getValues("dataNascimento");
    if (dataNascimento) {
      const result = validateParticipantAge(dataNascimento, loteSelecionado);
      if (!result.valid) {
        form.setError("dataNascimento", { message: result.message });
      } else {
        form.clearErrors("dataNascimento");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loteSelecionado]);

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "dataNascimento") {
        const result = validateParticipantAge(
          values.dataNascimento || "",
          loteSelecionado,
        );
        if (!result.valid) {
          form.setError("dataNascimento", { message: result.message });
        } else {
          form.clearErrors("dataNascimento");
        }
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loteSelecionado, form]);

  const handleFormSubmit = async (data: FormData) => {
    const result = validateParticipantAge(data.dataNascimento, loteSelecionado);
    if (!result.valid) {
      form.setError("dataNascimento", { message: result.message });
      return;
    }

    if (loteSelecionado === AGE_RULES.SPECIAL_LOTE_ID) {
      setCurrentStep("payment");
    } else if (isLoteEspecialSelected()) {
      setCurrentStep("cupom_validation");
    } else {
      setCurrentStep("cupom_servo");
    }
  };

  const getInscricaoErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("cupom servo amigo")) {
      return "Este cupom Servo Amigo já foi utilizado ou está inativo.";
    }

    return "Tente novamente mais tarde.";
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
        undefined,
      );
      if (error) throw error;
      setPaymentMethodUsed("cupom");
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
      const fileName = await uploadComprovanteFile(
        comprovanteFile,
        inscricaoData.id,
      );
      if (!isLoteEspecialSelected()) {
        const { error: updateError } =
          await InscricoesService.updateComprovante(inscricaoData.id, fileName);
        if (updateError) throw updateError;
      }

      setPaymentMethodUsed("pix");
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
    setComprovanteFile(null);
    setComprovantePreview(null);
    setCupomCode("");
    setCupomInfo(null);
    setCupomServoCode("");
    setCupomServoCodigo(null);
  };

  const handleBackFromPaymentToForm = () => {
    if (loteSelecionado === AGE_RULES.SPECIAL_LOTE_ID) {
      setCurrentStep("form");
      setComprovanteFile(null);
      setComprovantePreview(null);
    } else if (isLoteEspecialSelected()) {
      setCurrentStep("cupom_validation");
    } else {
      setCurrentStep("cupom_servo");
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
    paymentMethodUsed,
    form,
    lotes,
    lotesLoading,
    loteDisponivelId,
    isLoteEspecialSelected,
    handleFormSubmit,
    handleCupomValidation,
    handleCupomPayment,
    handlePixPayment,
    handleFileChange,
    clearComprovante,
    handleBackToForm,
    handleBackFromPaymentToForm,
    handleCupomServoValidation,
    handleSkipCupomServo,
  };
};
