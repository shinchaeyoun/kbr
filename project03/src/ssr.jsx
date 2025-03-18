import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export default function render() {
  const html = renderToString(<App />);

  return { html }; // 변환된 HTML을 반환
}
