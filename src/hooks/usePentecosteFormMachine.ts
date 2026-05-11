import { useMachine } from "@xstate/react";
import { useCallback } from "react";
import { pentecosteFormMachine, type FormEvent } from "@/machines/pentecosteFormMachine";

export type MachineStep = "step1_reading" | "step2_personal_info" | "step3_event_info" | "step4_payment" | "completed";

const STEP_MAP: Record<string, number> = {
  step1_reading: 0,
  step2_personal_info: 1,
  step3_event_info: 2,
  step4_payment: 3,
  uploading_proof: 3,
  submitting_registration: 3,
  submission_error: 3,
  submission_success: 4,
  completed: 4,
};

export const usePentecosteFormMachine = () => {
  const [state, send] = useMachine(pentecosteFormMachine);

  const currentStep = STEP_MAP[state.value as string] ?? 0;

  const isFirstStep = state.matches("step1_reading");
  const isLastStep = state.matches("step4_payment");
  const isSubmitting = state.matches("uploading_proof") || state.matches("submitting_registration");
  const isSuccess = state.matches("submission_success");
  const isError = state.matches("submission_error");

  const canProceed = useCallback(() => {
    return state.can({ type: "NEXT" } as FormEvent);
  }, [state]);

  const canSubmit = useCallback(() => {
    return state.can({ type: "SUBMIT" } as FormEvent);
  }, [state]);

  const sendNext = useCallback(() => {
    send({ type: "NEXT" });
  }, [send]);

  const sendBack = useCallback(() => {
    send({ type: "BACK" });
  }, [send]);

  const sendUpdateField = useCallback(
    (field: string, value: unknown) => {
      send({ type: "UPDATE_FIELD", field, value });
    },
    [send],
  );

  const resetMachine = useCallback(() => {
    send({ type: "RESET" });
  }, [send]);

  const sendSubmit = useCallback(() => {
    send({ type: "SUBMIT" });
  }, [send]);

  const sendUploadProof = useCallback(
    (file: File) => {
      send({ type: "UPLOAD_PROOF", file });
    },
    [send],
  );

  const sendRemoveProof = useCallback(() => {
    send({ type: "REMOVE_PROOF" });
  }, [send]);

  return {
    state,
    send,
    sendNext,
    sendBack,
    sendSubmit,
    sendUpdateField,
    sendUploadProof,
    sendRemoveProof,
    resetMachine,
    currentStep,
    canProceed,
    canSubmit,
    isFirstStep,
    isLastStep,
    isSubmitting,
    isSuccess,
    isError,
  };
};
