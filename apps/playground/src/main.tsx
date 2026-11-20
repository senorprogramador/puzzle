import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@puzzle-ui/theme";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme theme="light">
      <App />
    </Theme>
  </React.StrictMode>,
);
