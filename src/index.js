import React from "react";
import ReactDOM from "react-dom";
// import indexStyle from "./index.module.css";
// import Header from "./component/Header";
import Dashboard from "./component/Dashboard";

ReactDOM.render(
  <React.StrictMode>
    {/* <Welcome/>
    <Header className={indexStyle.header} /> */}
    <Dashboard/>
  </React.StrictMode>,
  document.getElementById("root")
);
