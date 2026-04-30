import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Tables } from "@/integrations/supabase/types";
import { STORAGE_BUCKET } from "@/lib/storage";
import { mapFormToInscricao } from "@/config/inscricaoMapper";

async function getAuthToken(): Promise<string> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error("Usuário não autenticado");
  }
  return session.access_token;
}

export const InscricoesService = {
  async findAll() {
    const token = await getAuthToken();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const allInscricoes: Tables<"inscricoes">[] = [];
    let page = 1;
    const limit = 100;

    while (true) {
      const url = `${apiBaseUrl}/api/subscriptions/?page=${page}&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { data: null, error: new Error(errorData.message || "Erro ao buscar inscrições") };
      }

      const result = await response.json();
      allInscricoes.push(...result.data);

      if (result.data.length < limit || allInscricoes.length >= result.total) {
        break;
      }
      page++;
    }

    return { data: allInscricoes, error: null };
  },

  async updateStatus(id: string, status: string) {
    const token = await getAuthToken();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/api/subscriptions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao atualizar status");
    }

    const data = await response.json();
    return { data, error: null };
  },

  async deleteByIds(ids: string[]) {
    const token = await getAuthToken();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    for (const id of ids) {
      const response = await fetch(`${apiBaseUrl}/api/subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao excluir inscrição");
      }
    }
  },

  async insert(data: TablesInsert<"inscricoes">) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Erro ao obter sessão:", sessionError);
      throw new Error("Usuário não autenticado");
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/api/subscriptions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar inscrição");
    }

    return await response.json();
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

  async getDashboardStats() {
    const token = await getAuthToken();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const [eventsRes, batchesRes, subsRes] = await Promise.all([
      fetch(`${apiBaseUrl}/api/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiBaseUrl}/api/batchs/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiBaseUrl}/api/subscriptions/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!eventsRes.ok || !batchesRes.ok || !subsRes.ok) {
      throw new Error("Erro ao buscar dados do dashboard");
    }

    const [events, batches, subsStats] = await Promise.all([
      eventsRes.json(),
      batchesRes.json(),
      subsRes.json(),
    ]);

    return {
      eventos: Array.isArray(events) ? events.length : 0,
      lotes: Array.isArray(batches) ? batches.length : 0,
      inscricoes: subsStats.total ?? 0,
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
