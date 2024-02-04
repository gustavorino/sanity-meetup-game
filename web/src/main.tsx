import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CardBackface } from "./components/CardBackface.tsx";
import "./index.css";

const isCard = window.location.pathname.includes("/card/");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isCard ? <CardBackface /> : <App />}</React.StrictMode>
);
