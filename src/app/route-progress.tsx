"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const appRoutes = ["/", "/invoices", "/clients", "/reports"];

function isInternalNavigation(target: HTMLElement) {
  const anchor = target.closest("a");

  if (!anchor) {
    return false;
  }

  const href = anchor.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    anchor.target === "_blank"
  ) {
    return false;
  }

  const url = new URL(href, window.location.href);

  return url.origin === window.location.origin && url.pathname !== window.location.pathname;
}

export function RouteProgress() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    appRoutes.forEach((route) => router.prefetch(route));
  }, [router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof HTMLElement)
      ) {
        return;
      }

      if (isInternalNavigation(event.target)) {
        setIsLoading(true);
      }
    }

    window.addEventListener("click", handleClick, true);

    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`route-progress ${isLoading ? "route-progress-active" : ""}`}
    />
  );
}
