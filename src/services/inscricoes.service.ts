import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Tables } from "@/integrations/supabase/types";
import { STORAGE_BUCKET } from "@/lib/storage";
import { mapFormToInscricao } from "@/config/inscricaoMapper";

export const InscricoesService = {
  async findAll() {
    const { data, error } = await supabase
      .from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("inscricoes")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  async deleteByIds(ids: string[]) {
    const { error } = await supabase
      .from("inscricoes")
      .delete()
      .in("id", ids);

    if (error) throw error;
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
    method: "pix" | "cupom",
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
    return getUniqueRecentInscricoes(data as Tables<"inscricoes">[]).length;
  },

  async getDashboardStats() {
    const [inscricoesRes, lotesRes, eventosRes] = await Promise.all([
      supabase.from("inscricoes").select("nome, telefone, created_at"),
      supabase.from("lotes").select("id", { count: "exact", head: true }),
      supabase.from("eventos").select("id", { count: "exact", head: true }),
    ]);

    const { getUniqueRecentInscricoes } = await import("@/lib/utils");
    const inscricoesCount = inscricoesRes.data
      ? getUniqueRecentInscricoes(inscricoesRes.data as Tables<"inscricoes">[]).length
      : 0;

    return {
      eventos: eventosRes.count ?? 0,
      lotes: lotesRes.count ?? 0,
      inscricoes: inscricoesCount,
    };
  },

  async getOikosMetrics() {
    const { getUniqueRecentInscricoes } = await import("@/lib/utils");

    const [allRes, awaitingRes, paidRes] = await Promise.all([
      supabase.from("inscricoes").select("nome, telefone, created_at, status"),
      supabase
        .from("inscricoes")
        .select("nome, telefone, created_at, status")
        .eq("status", "processando"),
      supabase
        .from("inscricoes")
        .select("nome, telefone, created_at, status")
        .eq("status", "confirmado"),
    ]);

    return {
      total: allRes.data
        ? getUniqueRecentInscricoes(allRes.data as Tables<"inscricoes">[]).length
        : 0,
      awaiting_confirmation: awaitingRes.data
        ? getUniqueRecentInscricoes(awaitingRes.data as Tables<"inscricoes">[]).length
        : 0,
      paid: paidRes.data
        ? getUniqueRecentInscricoes(paidRes.data as Tables<"inscricoes">[]).length
        : 0,
    };
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
