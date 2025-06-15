// hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setAuthenticated(true);
        setEmail(data.email);
      } catch {
        setAuthenticated(false);
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { loading, authenticated, email };
}
