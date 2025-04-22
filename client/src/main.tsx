import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SimulationProvider } from "./context/SimulationContext";

createRoot(document.getElementById("root")!).render(
  <SimulationProvider>
    <App />
  </SimulationProvider>
);
