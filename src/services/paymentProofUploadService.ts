import { supabase } from "@/integrations/supabase/client";

const BUCKET = "pentecoste-payment-proofs";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadPaymentProof(file: File): Promise<UploadResult> {
  const ext = file.name.split(".").pop() || "png";
  const filename = `proof_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message || "Falha ao enviar comprovante");
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return {
    url: urlData.publicUrl,
    filename,
    size: file.size,
  };
}
