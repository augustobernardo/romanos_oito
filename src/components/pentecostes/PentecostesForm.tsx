import { useCallback } from "react";
import { toast } from "sonner";
import { Loader2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePentecostesForm } from "./usePentecostesForm";
import Step0Leitura from "./steps/Step0Leitura";
import Step1DadosPessoais from "./steps/Step1DadosPessoais";
import Step2Detalhes from "./steps/Step2Detalhes";
import Step3Payment from "./steps/Step3Payment";

const PentecostesForm = () => {
  const {
    form,
    currentStep,
    totalSteps,
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
    paymentProofFile,
    paymentProofName,
    paymentProofSize,
    handleFileUpload,
    handleRemoveFile,
    submissionError,
  } = usePentecostesForm();
  useWatch({ control: form.control });

  const handlePrimary = async () => {
    if (isLastStep) {
      if (!canSubmit()) return;
      submit();
    } else {
      await next();
    }
  };

  const handleConfirmationChange = useCallback(
    (checked: boolean) => {
      syncToMachine("read_descriptions_confirmation", checked);
    },
    [syncToMachine],
  );

  const isButtonDisabled = isSubmitting || (isLastStep ? !canSubmit() : !isStepValid());

  const buttonLabel = isSubmitting
    ? "Enviando..."
    : isLastStep
      ? "Enviar"
      : "Próximo";

  if (isSuccess) {
    return (
      <div className="py-10 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-pentecoste-red" />
        <h2 className="mt-4 font-display text-3xl font-black uppercase text-pentecoste-navy">
          Inscrição recebida!
        </h2>
        <Button
          type="button"
          onClick={() => {
            reset();
            toast.success("Formulário reiniciado.");
          }}
          className="mt-6 rounded-full border-2 border-pentecoste-navy bg-pentecoste-red px-8 font-display uppercase tracking-wide text-pentecoste-paper hover:bg-pentecoste-red-dark"
        >
          Nova inscrição
        </Button>
      </div>
    );
  }

  return (
    <div data-pentecoste-form className="pentecoste-form">
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-pentecoste-navy/70">
            Passo {currentStep + 1} de {totalSteps}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-pentecoste-red">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </p>
        </div>
        <Progress
          value={((currentStep + 1) / totalSteps) * 100}
          aria-label={`Progresso: passo ${currentStep + 1} de ${totalSteps}`}
          className="h-2 rounded-none border-2 border-pentecoste-navy bg-pentecoste-paper [&>div]:bg-pentecoste-red [&>div]:transition-transform [&>div]:duration-500"
        />
      </div>

      {isError && (
        <div className="mb-6 flex flex-col gap-3 border-2 border-pentecoste-red bg-pentecoste-red/10 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-pentecoste-red" />
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.1em] text-pentecoste-red">
                Erro ao enviar inscrição
              </p>
              {submissionError && (
                <p className="mt-1 font-mono text-xs text-pentecoste-navy/80">
                  {submissionError}
                </p>
              )}
            </div>
          </div>
          <Button
            type="button"
            onClick={back}
            className="self-start rounded-full border-2 border-pentecoste-red bg-pentecoste-red px-6 font-mono text-xs uppercase tracking-wide text-pentecoste-paper hover:bg-pentecoste-red-dark"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePrimary();
          }}
          className="space-y-6"
          noValidate
        >
          {currentStep === 0 && (
            <Step0Leitura form={form} onConfirmationChange={handleConfirmationChange} />
          )}
          {currentStep === 1 && <Step1DadosPessoais form={form} />}
          {currentStep === 2 && <Step2Detalhes form={form} />}
          {currentStep === 3 && (
            <Step3Payment
              paymentProofFile={paymentProofFile}
              paymentProofName={paymentProofName}
              paymentProofSize={paymentProofSize}
              onFileUpload={handleFileUpload}
              onRemoveFile={handleRemoveFile}
            />
          )}

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={back}
              disabled={isFirstStep || isSubmitting}
              className="rounded-full border-2 border-pentecoste-navy bg-transparent px-8 font-display uppercase tracking-wide text-pentecoste-navy hover:bg-pentecoste-navy hover:text-pentecoste-paper"
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={handlePrimary}
              disabled={isButtonDisabled}
              aria-label={isLastStep ? "Enviar inscrição" : "Próximo passo"}
              className="rounded-full border-2 border-pentecoste-navy bg-pentecoste-red px-10 font-display uppercase tracking-wide text-pentecoste-paper shadow-[3px_3px_0_0_rgba(27,37,65,1)] transition-transform hover:bg-pentecoste-red-dark hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(27,37,65,1)]"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PentecostesForm;
