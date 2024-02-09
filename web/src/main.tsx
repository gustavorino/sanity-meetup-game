import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CardTester } from "./components/CardBackface.tsx";

const isCard = window.location.pathname.includes("/card/");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isCard ? <CardTester /> : <App />}</React.StrictMode>
);
