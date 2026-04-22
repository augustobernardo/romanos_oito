import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const STORAGE_BUCKET = "Comprovantes_OIKOS";

/** Extract the file path from a URL or return as-is if already a path. */
export const extractFilePathFromUrl = (url: string): string => {
  if (url.startsWith("http")) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch {
      return url;
    }
  }
  return url;
};

/** Get a signed URL for a file in the Comprovantes_OIKOS bucket. */
export const getComprovanteSignedUrl = async (
  comprovanteUrl: string,
): Promise<string | null> => {
  const filePath = extractFilePathFromUrl(comprovanteUrl);
  if (!filePath) return null;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, 60 * 60); // 60 minutes

  if (error) throw error;
  return data?.signedUrl ?? null;
};

/** Open a dialog to preview the comprovante image. */
export const handleViewComprovante = async (
  comprovanteUrl: string,
  nome: string,
  setLoading: (loading: boolean) => void,
  onPreview: (url: string, nome: string) => void,
) => {
  setLoading(true);
  try {
    const signedUrl = await getComprovanteSignedUrl(comprovanteUrl);
    if (signedUrl) {
      onPreview(signedUrl, nome);
    } else {
      toast.error("Erro ao gerar link do comprovante");
    }
  } catch {
    toast.error("Erro ao acessar comprovante");
  } finally {
    setLoading(false);
  }
};

/** Trigger a download for the comprovante file. */
export const handleDownloadComprovante = async (
  comprovanteUrl: string,
  nome: string,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    const filePath = extractFilePathFromUrl(comprovanteUrl);
    if (!filePath) {
      toast.error("Caminho do arquivo inválido");
      return;
    }

    const signedUrl = await getComprovanteSignedUrl(comprovanteUrl);
    if (!signedUrl) {
      toast.error("Erro ao gerar link do comprovante");
      return;
    }

    const link = document.createElement("a");
    link.href = signedUrl;
    link.download = `comprovante_${nome}_${new Date().toISOString().split("T")[0]}.${filePath.split(".").pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download iniciado");
  } catch {
    toast.error("Erro ao baixar comprovante");
  } finally {
    setLoading(false);
  }
};

/** Upload a file to the comprovantes bucket and return its public URL. */
export const uploadComprovante = async (
  file: File,
  path: string,
): Promise<string> => {
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return urlData.publicUrl;
};
