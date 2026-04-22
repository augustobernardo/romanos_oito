import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export const LotesService = {
  async findAll() {
    return await supabase
      .from("lotes")
      .select("*")
      .order("ordem", { ascending: true });
  },

  async insert(data: TablesInsert<"lotes">) {
    return await supabase.from("lotes").insert(data);
  },

  async update(id: number, data: TablesInsert<"lotes">) {
    return await supabase.from("lotes").update(data).eq("id", id);
  },

  async deleteById(id: number) {
    return await supabase.from("lotes").delete().eq("id", id);
  },

  async count() {
    return await supabase
      .from("lotes")
      .select("id", { count: "exact", head: true });
  },
};
