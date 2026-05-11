import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pentecostesFormSchema,
  PentecostesFormData,
} from "./schema";
import { usePentecosteFormMachine } from "@/hooks/usePentecosteFormMachine";
import { FormContext } from "@/machines/pentecosteFormMachine";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const usePentecostesForm = () => {
  const machine = usePentecosteFormMachine();
  const {
    sendNext, sendBack, sendSubmit, sendUpdateField,
    sendUploadProof, sendRemoveProof, resetMachine,
    currentStep, canProceed, canSubmit, isFirstStep, isLastStep,
    isSubmitting, isSuccess, isError, state,
  } = machine;

  const form = useForm<PentecostesFormData>({
    resolver: zodResolver(pentecostesFormSchema),
    mode: "onChange",
    defaultValues: {
      read_descriptions_confirmation: false as unknown as true,
      nome: "",
      instagram: "",
      whatsapp: "",
      dataNascimento: "",
      contatoResponsavel: "",
      confirmAuthorizationUnderage: false,
      paroquia: "",
      participaMovimento: "",
      jaParticipouR8: undefined as unknown as "sim" | "nao",
      bringShare: [],
      bringShareOther: "",
      workshopGroup: undefined as unknown as
        | "turma_01"
        | "turma_02"
        | "turma_03"
        | "turma_04",
      arrivalTime: false,
      arrivalTimeRestriction: undefined,
      expectationsPentecoste: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name) {
        sendUpdateField(name, values[name as keyof PentecostesFormData]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, sendUpdateField]);

  const syncToMachine = useCallback(
    (field: string, value: unknown) => {
      sendUpdateField(field, value);
    },
    [sendUpdateField],
  );

  const next = useCallback(async () => {
    sendNext();
    return true;
  }, [sendNext]);

  const back = useCallback(() => {
    sendBack();
  }, [sendBack]);

  const reset = useCallback(() => {
    resetMachine();
    form.reset();
  }, [form, resetMachine]);

  const isStepValid = useCallback(() => {
    return canProceed();
  }, [canProceed]);

  const submit = useCallback(() => {
    sendSubmit();
  }, [sendSubmit]);

  const handleFileUpload = useCallback(
    (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return { error: "Formato não permitido. Use PNG, JPG ou PDF." };
      }
      if (file.size > MAX_FILE_SIZE) {
        return { error: "Arquivo excede 5MB." };
      }
      sendUploadProof(file);
      return { error: null };
    },
    [sendUploadProof],
  );

  const handleRemoveFile = useCallback(() => {
    sendRemoveProof();
  }, [sendRemoveProof]);

  const { paymentProofFile, paymentProofName, paymentProofSize, uploadState, uploadedProofUrl, submissionError } = state.context as FormContext;

  return {
    form,
    currentStep,
    totalSteps: 5,
    next,
    back,
    submit,
    reset,
    isStepValid,
    canSubmit,
    isFirstStep,
    isLastStep,
    isSubmitting,
    isSuccess,
    isError,
    syncToMachine,
    handleFileUpload,
    handleRemoveFile,
    paymentProofFile,
    paymentProofName,
    paymentProofSize,
    uploadState,
    uploadedProofUrl,
    submissionError,
    machineState: state,
  };
};
