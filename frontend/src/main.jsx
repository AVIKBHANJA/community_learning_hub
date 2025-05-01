import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./router.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { CreditProvider } from "./contexts/CreditContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CreditProvider>
        <AppRouter />
      </CreditProvider>
    </AuthProvider>
  </StrictMode>
);
