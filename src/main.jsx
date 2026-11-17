import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { readBoot } from "./boot.js";
import "./styles.css";
const root = document.getElementById("root");
// The same values the server used to render the page (cookie and meta tags).
const application = (
  <React.StrictMode>
    <BrowserRouter>
      <App boot={readBoot()} />
    </BrowserRouter>
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, application);
else createRoot(root).render(application);
