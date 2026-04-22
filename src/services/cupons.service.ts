import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Cupom = Tables<"cupons">;

export const CuponsService = {
  async findAll() {
    return await supabase
      .from("cupons")
      .select("*")
      .order("created_at", { ascending: false });
  },

  async insert(data: TablesInsert<"cupons">) {
    return await supabase.from("cupons").insert(data);
  },

  async deleteById(id: string) {
    return await supabase.from("cupons").delete().eq("id", id);
  },

  async update(id: string, data: { nome_titular?: string | null; comprovante_url?: string | null }) {
    return await supabase.from("cupons").update(data).eq("id", id);
  },

  async findHighestByPrefix(prefix: string) {
    return await supabase
      .from("cupons")
      .select("codigo")
      .like("codigo", `${prefix}%`)
      .order("codigo", { ascending: false })
      .limit(1);
  },
};

export const getNextCouponCode = async (prefix = "VCMAISDOIS#"): Promise<string> => {
  const { data } = await CuponsService.findHighestByPrefix(prefix);

  let nextNum = 1;
  if (data && data.length > 0) {
    const numPart = parseInt(data[0].codigo.replace(prefix, ""), 10);
    if (!isNaN(numPart)) nextNum = numPart + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, "0")}`;
};
