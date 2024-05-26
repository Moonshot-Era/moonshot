"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/progressier.js").catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;
