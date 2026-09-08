import { useState, useEffect, useCallback } from "react";

export type AppRoute = "/" | "/quiz" | "/dashboard";

function getRouteFromHash(): AppRoute {
  const hash = window.location.hash.replace("#", "") || "/";
  if (hash === "/quiz") return "/quiz";
  if (hash === "/dashboard") return "/dashboard";
  return "/";
}

export function useRoute() {
  const [path, setPath] = useState<AppRoute>(getRouteFromHash);

  useEffect(() => {
    function onHashChange() {
      setPath(getRouteFromHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((route: AppRoute) => {
    window.location.hash = route;
  }, []);

  return { path, navigate };
}
