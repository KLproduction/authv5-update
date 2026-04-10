"use client";

import { useEffect } from "react";

export function E2EReadyMarker() {
  useEffect(() => {
    document.documentElement.dataset.e2eReady = "true";

    return () => {
      delete document.documentElement.dataset.e2eReady;
    };
  }, []);

  return null;
}
