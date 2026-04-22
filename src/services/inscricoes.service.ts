import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { STORAGE_BUCKET } from "@/lib/storage";
import { mapFormToInscricao } from "@/config/inscricaoMapper";

export const InscricoesService = {
  async findAll() {
    return await supabase
      .from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false });
  },

  async updateStatus(id: string, status: string) {
    return await supabase.from("inscricoes").update({ status }).eq("id", id);
  },

  async deleteByIds(ids: string[]) {
    return await supabase.from("inscricoes").delete().in("id", ids);
  },

  async insert(data: TablesInsert<"inscricoes">) {
    return await supabase.from("inscricoes").insert(data).select().single();
  },

  async updateComprovante(id: string, comprovanteUrl: string) {
    return await supabase
      .from("inscricoes")
      .update({ comprovante_url: comprovanteUrl })
      .eq("id", id);
  },

  async insertInscricao(
    loteId: number,
    formData: {
      nome: string;
      dataNascimento: string;
      telefone: string;
      instagram: string;
      comunidade: string;
      cidadeEstado: string;
      enderecoCompleto: string;
      comoConheceu: string;
      comoConheceuOutro: string;
      nomeMae: string;
      numeroMae: string;
      nomePai: string;
      numeroPai: string;
      numeroResponsavelProximo: string;
      isCatolico: string;
      isCatolicoOutro: string;
      participaMovimento: string;
      fezRetiro: string;
      fezRetiroOutro: string;
      nomePessoaEmergencia: string;
      grauParentescoEmergencia: string;
      numeroEmergencia: string;
      tamanhoCamisa: string;
      expectativaOikos: string;
    },
    method: "credit" | "pix" | "cupom",
    status: string,
    cupomInfo?: { nomeTitular: string | null; comprovanteUrl: string | null },
    codigoServo?: string | null,
  ) {
    return await supabase
      .from("inscricoes")
      .insert(
        mapFormToInscricao(loteId, formData, method, status, cupomInfo, codigoServo),
      )
      .select()
      .single();
  },

  async validarCupom(codigo: string) {
    return await supabase.rpc("validar_cupom", { _codigo: codigo });
  },

  async countUnique() {
    const { data } = await supabase.from("inscricoes").select("nome, telefone, created_at");
    if (!data || data.length === 0) return 0;
    const { getUniqueRecentInscricoes } = await import("@/lib/utils");
    return getUniqueRecentInscricoes(data as any).length;
  },
};

export const uploadComprovanteFile = async (
  file: File,
  inscricaoId: number,
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `comprovante_${inscricaoId}_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  return fileName;
};
