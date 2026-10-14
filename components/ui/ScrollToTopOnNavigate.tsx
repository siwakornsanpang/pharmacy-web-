"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isAcademyPath } from "@/lib/academy/scroll-restoration";

/** Scroll to top when the route changes (nav tab / page switch). */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // Academy owns its return-position restoration inside its layout.
    if (isAcademyPath(pathname)) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
