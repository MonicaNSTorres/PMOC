"use client";

import { useEffect, useState } from "react";
import SidebarPMOC from "./nav/navbar";
import MobileMenuPMOC from "./nav/mobileNavbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("pmoc_auth");
    setIsAuthenticated(auth === "true");
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {isAuthenticated && (
        <>
          {/*sidebar web*/}
          <div className="hidden md:flex">
            <SidebarPMOC />
          </div>

          {/*sidebar mobile*/}
          <div className="flex md:hidden">
            <MobileMenuPMOC />
          </div>
        </>
      )}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
