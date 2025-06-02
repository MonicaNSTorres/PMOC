"use client";

import { useEffect, useState } from "react";
import SidebarPMOC from "./nav/navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("pmoc_auth");
    setIsAuthenticated(auth === "true");
  }, []);

  return (
    <div className="flex">
      {isAuthenticated && <SidebarPMOC />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
