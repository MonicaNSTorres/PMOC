"use client";

import { useEffect, useState } from "react";
import SidebarPMOC from "./nav/navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("pmoc_auth");
    setIsAuthenticated(auth === "true");
    setLoading(false); //renderiza apos verificar
  }, []);

  if (loading) return null;

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {isAuthenticated && <SidebarPMOC />}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
