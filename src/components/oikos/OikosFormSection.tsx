import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import LoteCard from "@/components/form/LoteCard";
import DadosPessoaisSection from "@/components/form/DadosPessoaisSection";
import PaisResponsaveisSection from "@/components/form/PaisResponsaveisSection";
import VidaIgrejaSection from "@/components/form/VidaIgrejaSection";
import EmergenciaSection from "@/components/form/EmergenciaSection";
import CamisaSection from "@/components/form/CamisaSection";
import ExpectativaSection from "@/components/form/ExpectativaSection";
import { useOikosForm } from "./useOikosForm";
import { ConfirmationScreen } from "./ConfirmationScreen";
import { CupomValidationStep } from "./CupomValidationStep";
import { CupomServoStep } from "./CupomServoStep";
import { PaymentStep } from "./PaymentStep";

const OikosFormSection = () => {
  const {
    currentStep,
    loteSelecionado,
    setLoteSelecionado,
    paymentMethod,
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
  } = useOikosForm();

  if (currentStep === "confirmation") {
    return <ConfirmationScreen paymentMethod={paymentMethod} />;
  }

  if (currentStep === "cupom_validation") {
    return (
      <CupomValidationStep
        cupomCode={cupomCode}
        setCupomCode={setCupomCode}
        cupomValidating={cupomValidating}
        onValidate={handleCupomValidation}
        onBack={handleBackToForm}
      />
    );
  }

  if (currentStep === "cupom_servo") {
    return (
      <CupomServoStep
        cupomCode={cupomServoCode}
        setCupomCode={setCupomServoCode}
        cupomValidating={cupomServoValidating}
        onValidate={handleCupomServoValidation}
        onSkip={handleSkipCupomServo}
        onBack={handleBackToForm}
      />
    );
  }

  if (currentStep === "payment") {
    return (
      <PaymentStep
        isEspecial={isLoteEspecialSelected()}
        paymentMethod={paymentMethod}
        comprovantePreview={comprovantePreview}
        comprovanteFile={comprovanteFile}
        uploading={uploading}
        cupomInfo={cupomInfo}
        onSelectMethod={handlePaymentMethodSelect}
        onCreditPayment={handleCreditPayment}
        onCupomPayment={handleCupomPayment}
        onPixPayment={handlePixPayment}
        onCopyPixKey={handleCopyPixKey}
        onFileChange={handleFileChange}
        onClearComprovante={clearComprovante}
        onBack={handleBackFromPaymentToForm}
      />
    );
  }

  return (
    <section
      id="inscricao"
      className="w-full"
      style={{ backgroundColor: "#fff9e1" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-16 md:py-20 lg:py-24">
        <h2
          className="font-display text-2xl md:text-3xl font-bold uppercase text-center mb-2"
          style={{ color: "#393939" }}
        >
          SELECIONE O LOTE
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: "#393939" }}>
          Escolha a melhor opção para você
        </p>

        {lotesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border-2 p-5 h-32 bg-gray-200 animate-pulse"
                style={{
                  borderColor: "hsl(195 40% 82%)",
                  backgroundColor: "#e0e0e0",
                }}
              >
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-4xl mx-auto mb-12">
              {lotes
                .map((lote) => (
                  <LoteCard
                    key={lote.id}
                    lote={lote}
                    isActive={loteSelecionado === lote.id}
                    isEnabled={lote.status === "disponivel"}
                    onSelect={() => setLoteSelecionado(lote.id)}
                    isLoading={lotesLoading}
                  />
                ))}
            </div>

            {!lotesLoading && !loteDisponivelId && lotes.length > 0 && (
              <p
                className="text-center text-sm font-medium mb-8"
                style={{ color: "#e53e3e" }}
              >
                Todos os lotes estão esgotados. As inscrições foram encerradas.
              </p>
            )}

            {!lotesLoading && lotes.length === 0 && (
              <p
                className="text-center text-sm font-medium mb-8"
                style={{ color: "#e53e3e" }}
              >
                Nenhum lote disponível no momento.
              </p>
            )}
          </>
        )}

        {!lotesLoading && loteSelecionado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="oikos-form mx-auto max-w-3xl rounded-lg p-1"
          >
            <h3
              className="mb-8 text-center font-display text-xl md:text-3xl uppercase"
              style={{ color: "#393939" }}
            >
              Formulário de Inscrição
            </h3>

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(handleFormSubmit)}
              >
                <DadosPessoaisSection form={form} />
                <PaisResponsaveisSection form={form} />
                <VidaIgrejaSection form={form} />
                <EmergenciaSection form={form} />
                <CamisaSection form={form} />
                <ExpectativaSection form={form} />

                <Button
                  size="lg"
                  className="w-full font-semibold text-white"
                  style={{ backgroundColor: "hsl(195 100% 45%)" }}
                >
                  Ir para pagamento
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OikosFormSection;
