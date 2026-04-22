import { supabase } from "@/integrations/supabase/client";

export type CupomServo = {
  id: string;
  codigo: string;
  nome_servo: string;
  ativo: boolean;
  created_at: string;
};

const TABLE = "cupons_servo" as const;

// We bypass the generated types here because cupons_servo was added in a
// recent migration and the typed client may not yet reflect it.
// All inputs are validated/sanitized at the call sites.
const client = supabase as unknown as {
  from: (table: string) => {
    select: (cols: string) => {
      order: (col: string, opts: { ascending: boolean }) => Promise<{
        data: CupomServo[] | null;
        error: { message: string } | null;
      }>;
      like: (col: string, pattern: string) => {
        order: (col: string, opts: { ascending: boolean }) => {
          limit: (n: number) => Promise<{
            data: Array<{ codigo: string }> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
    insert: (data: Partial<CupomServo>) => Promise<{ error: { message: string } | null }>;
    update: (data: Partial<CupomServo>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
    };
    delete: () => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
    };
  };
  rpc: (
    name: string,
    params: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const SERVO_PREFIX = "SERVOAMIGO#";

export const CuponsServoService = {
  async findAll() {
    return await client.from(TABLE).select("*").order("created_at", { ascending: false });
  },

  async insert(data: { codigo: string; nome_servo: string; ativo?: boolean }) {
    return await client.from(TABLE).insert(data);
  },

  async update(
    id: string,
    data: { nome_servo?: string; ativo?: boolean },
  ) {
    return await client.from(TABLE).update(data).eq("id", id);
  },

  async deleteById(id: string) {
    return await client.from(TABLE).delete().eq("id", id);
  },

  async findHighestCode() {
    return await client
      .from(TABLE)
      .select("codigo")
      .like("codigo", `${SERVO_PREFIX}%`)
      .order("codigo", { ascending: false })
      .limit(1);
  },

  async validar(codigo: string) {
    return await client.rpc("validar_cupom_servo", { _codigo: codigo });
  },

  async desativar(codigo: string) {
    return await client.rpc("desativar_cupom_servo", { _codigo: codigo });
  },
};

export const getNextServoCouponCode = async (): Promise<string> => {
  const { data } = await CuponsServoService.findHighestCode();

  let nextNum = 1;
  if (data && data.length > 0) {
    const numPart = parseInt(data[0].codigo.replace(SERVO_PREFIX, ""), 10);
    if (!isNaN(numPart)) nextNum = numPart + 1;
  }

  return `${SERVO_PREFIX}${String(nextNum).padStart(3, "0")}`;
};