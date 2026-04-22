/**
 * Tests for getNextCouponCode from cupons.service.ts.
 * Tests the real production code, not a re-implementation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNextCouponCode, CuponsService } from "@/services/cupons.service";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        like: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({ data: null })),
          })),
        })),
      })),
    })),
  },
}));

import { supabase } from "@/integrations/supabase/client";

describe("getNextCouponCode", () => {
  beforeEach(() => {
    vi.mocked(supabase.from).mockClear();
  });

  it("gera VCMAISDOIS#0001 quando não há cupons", async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        like: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [] }),
          }),
        }),
      }),
    }));
    const code = await getNextCouponCode();
    expect(code).toBe("VCMAISDOIS#0001");
  });

  it("incrementa corretamente a partir do último código", async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        like: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ codigo: "VCMAISDOIS#0005" }],
            }),
          }),
        }),
      }),
    }));
    const code = await getNextCouponCode();
    expect(code).toBe("VCMAISDOIS#0006");
  });

  it("funciona com código alto (9999 → 10000)", async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        like: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ codigo: "VCMAISDOIS#9999" }],
            }),
          }),
        }),
      }),
    }));
    const code = await getNextCouponCode();
    expect(code).toBe("VCMAISDOIS#10000");
  });
});

describe("CuponsService", () => {
  it("findHighestByPrefix constroi a query correta", async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [] }),
    };
    vi.mocked(supabase.from).mockReturnValue(mockChain as any);

    await CuponsService.findHighestByPrefix("TEST#");

    expect(supabase.from).toHaveBeenCalledWith("cupons");
    expect(mockChain.select).toHaveBeenCalledWith("codigo");
    expect(mockChain.like).toHaveBeenCalledWith("codigo", "TEST#%");
    expect(mockChain.limit).toHaveBeenCalledWith(1);
  });
});
