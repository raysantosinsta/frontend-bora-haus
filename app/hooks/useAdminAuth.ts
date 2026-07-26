// app/hooks/useAdminAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth(redirectToLogin: boolean = true) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica se o cookie existe
    const hasCookie = document.cookie
      .split("; ")
      .some((row) => row.startsWith("admin-auth=true"));

    const auth = localStorage.getItem("adminAuthenticated");
    const authTime = localStorage.getItem("adminAuthTime");
    const isExpired = authTime && (Date.now() - parseInt(authTime) > 24 * 60 * 60 * 1000);

    if ((auth === "true" && !isExpired) || hasCookie) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (redirectToLogin) {
        router.push("/admin/login");
      }
    }
  }, [router, redirectToLogin]);

  return { isAuthenticated };
}