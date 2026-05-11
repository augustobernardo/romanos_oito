import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type RpcParams = Database["public"]["Functions"]["create_pentecoste_registration"]["Args"];

const ERROR_MAP: Record<string, string> = {
  DUPLICATE_REGISTRATION: "Você já possui uma inscrição existente.",
  INVALID_UNDERAGE_DATA:
    "Participantes menores de idade devem fornecer os dados de autorização.",
  INVALID_ARRIVAL_CONFIGURATION:
    "Por favor, revise sua seleção de horário de chegada.",
  INVALID_AGE: "Idade mínima não atingida.",
  READING_CONFIRMATION_REQUIRED: "Confirmação de leitura é obrigatória.",
  INVALID_DATA: "Dados obrigatórios não preenchidos.",
  INVALID_FILE_TYPE: "Formato de arquivo não permitido.",
  FILE_TOO_LARGE: "Arquivo excede o limite de 5MB.",
};

export interface SubmissionResult {
  success: boolean;
  id?: string;
  errorCode?: string;
  message?: string;
}

export async function submitRegistration(
  params: RpcParams,
): Promise<SubmissionResult> {
  const { data, error } = await supabase.rpc(
    "create_pentecoste_registration",
    params,
  );

  if (error) {
    return {
      success: false,
      message: error.message || "Erro ao enviar inscrição.",
    };
  }

  const result = data as Record<string, unknown>;

  if (result?.success === true) {
    return {
      success: true,
      id: result.id as string | undefined,
    };
  }

  const errorCode = (result?.error as string) || "INTERNAL_ERROR";
  return {
    success: false,
    errorCode,
    message: ERROR_MAP[errorCode] || "Erro inesperado. Tente novamente.",
  };
}
