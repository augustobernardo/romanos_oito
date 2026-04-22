import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export const EventosService = {
  async findAll() {
    return await supabase
      .from("eventos")
      .select("*")
      .order("created_at", { ascending: false });
  },

  async insert(data: TablesInsert<"eventos">) {
    return await supabase.from("eventos").insert(data);
  },

  async update(id: string, data: TablesInsert<"eventos">) {
    return await supabase.from("eventos").update(data).eq("id", id);
  },

  async deleteById(id: string) {
    return await supabase.from("eventos").delete().eq("id", id);
  },

  async count() {
    return await supabase
      .from("eventos")
      .select("id", { count: "exact", head: true });
  },
};
