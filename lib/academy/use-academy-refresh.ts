"use client";

import {useEffect, useRef, useState} from 'react';

// Refresh on returning from another tab or a browser back/forward cache.
export function useAcademyRefresh() {
  const [version, setVersion] = useState(0);
  const lastRefresh = useRef(0);
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'hidden' || Date.now() - lastRefresh.current < 250) return;
      lastRefresh.current = Date.now();
      setVersion(value => value + 1);
    };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) refresh(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pageshow', restore);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('pageshow', restore);
    };
  }, []);
  return version;
}
