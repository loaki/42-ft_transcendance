import React from "react";
import ReactDOM from "react-dom/client"; //渲染器
import App from "./pages/common/route";

//app渲染到html
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);
