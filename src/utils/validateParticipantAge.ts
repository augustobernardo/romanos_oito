import { calculateAgeAtReferenceDate } from "./dateUtils";
import { AGE_RULES, AGE_ERROR_MESSAGES } from "@/config/ageRules";

export type AgeValidationResult = {
  valid: boolean;
  message?: string;
};

export const validateParticipantAge = (
  birthDate: string,
  loteId?: number | null,
): AgeValidationResult => {
  if (!birthDate) {
    return { valid: false, message: "Data de nascimento é obrigatória" };
  }

  if (loteId === AGE_RULES.SPECIAL_LOTE_ID) {
    const ageAtReference = calculateAgeAtReferenceDate(
      birthDate,
      AGE_RULES.SPECIAL_REFERENCE_DATE,
    );
    if (ageAtReference === AGE_RULES.SPECIAL_MIN_AGE) {
      return { valid: true };
    }
    return { valid: false, message: AGE_ERROR_MESSAGES.SPECIAL };
  }

  const ageAtReference = calculateAgeAtReferenceDate(
    birthDate,
    AGE_RULES.DEFAULT_REFERENCE_DATE,
  );
  if (ageAtReference >= AGE_RULES.DEFAULT_MIN_AGE) {
    return { valid: true };
  }
  return { valid: false, message: AGE_ERROR_MESSAGES.DEFAULT };
};

export const getMaxBirthDateForLote = (loteId?: number | null): string | null => {
  if (loteId == null) return null;

  if (loteId === AGE_RULES.SPECIAL_LOTE_ID) {
    const ref = new Date(AGE_RULES.SPECIAL_REFERENCE_DATE + "T00:00:00");
    ref.setFullYear(ref.getFullYear() - AGE_RULES.SPECIAL_MIN_AGE);
    return ref.toISOString().split("T")[0];
  }

  const ref = new Date(AGE_RULES.DEFAULT_REFERENCE_DATE + "T00:00:00");
  ref.setFullYear(ref.getFullYear() - AGE_RULES.DEFAULT_MIN_AGE);
  return ref.toISOString().split("T")[0];
};

export const getMinBirthDateForLote = (loteId?: number | null): string | null => {
  if (loteId !== AGE_RULES.SPECIAL_LOTE_ID) return null;

  const ref = new Date(AGE_RULES.SPECIAL_REFERENCE_DATE + "T00:00:00");
  ref.setFullYear(ref.getFullYear() - AGE_RULES.SPECIAL_MIN_AGE - 1);
  ref.setDate(ref.getDate() + 1);
  return ref.toISOString().split("T")[0];
};
