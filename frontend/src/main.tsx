import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useAuthStore } from "./store/authStore";
import "./index.css";
import "./i18n";

import { t } from "i18next";

const AppWrapper = () => {
  const { initializeAuth, initialLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {t("loading")}
      </div>
    );
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense>
      <AppWrapper />
    </Suspense>
  </React.StrictMode>
);
