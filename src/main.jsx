import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./theme.jsx";
import ParkwayHub from "./ParkwayHub.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ParkwayHub />
    </ThemeProvider>
  </React.StrictMode>
);
