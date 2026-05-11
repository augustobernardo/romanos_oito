import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export const AuthService = {
  async getSession(): Promise<{ session: Session | null }> {
    return await supabase.auth.getSession();
  },

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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

  checkAdmin(user: User | null): boolean {
    if (!user) return false;
    return true;
  },
};
