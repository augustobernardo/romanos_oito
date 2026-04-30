import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const AuthService = {
  async getSession(): Promise<{ session: Session | null }> {
    return await supabase.auth.getSession();
  },

  async signIn(email: string, password: string) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: new Error(errorData.message || "Erro ao fazer login") };
    }

    const data = await response.json();

    const { error } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return { error };
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  onAuthStateChange(
    callback: (event: string, session: Session | null) => void,
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async checkAdmin(userId: string): Promise<boolean> {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return false;

    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) return false;

    const data = await response.json();
    return Array.isArray(data.roles) && data.roles.includes("admin");
  },
};
