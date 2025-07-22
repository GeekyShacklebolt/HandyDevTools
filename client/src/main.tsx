import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

createRoot(document.getElementById("root")!).render(
  <Router hook={useHashLocation}>
    <App />
  </Router>
);
