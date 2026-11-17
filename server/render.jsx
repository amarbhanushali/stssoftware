import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../src/App.jsx";
// `boot` carries the visitor's consent cookie and which features are switched
// on, so the cookie banner and chat button are drawn in the HTML itself.
export function render(url, boot) {
  return renderToString(
    <StaticRouter location={url}>
      <App boot={boot} />
    </StaticRouter>,
  );
}
