import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.mount = (containerId, props) => {
  ReactDOM.render(<App {...props} />, document.getElementById(containerId));
};

window.unmount = (containerId) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
};
