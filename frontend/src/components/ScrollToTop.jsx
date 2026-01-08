import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // Hash yoksa en üste git
      window.scrollTo(0, 0);
    }
    // Hash varsa (örn: #contact) - scroll davranışı zaten çalışacak
  }, [pathname, hash]);

  return null;
}
