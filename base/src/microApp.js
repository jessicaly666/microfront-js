import { useEffect } from "react";

function MicroApp(props) {
  useEffect(() => {
    const { name, host } = props;
    let script = document.createElement("script");
    script.id = `micro-frontend-script-${name}`;
    script.src = `${host}/static/js/bundle.js`;
    document.head.appendChild(script);
    setTimeout(() => {
      window.mount(`${name}-container`, props.props);
    }, 500);
    return () => {
      window.unmount(`${name}-container`);
    };
  }, []);
  return <div id={`${props.name}-container`}></div>;
}

export default MicroApp;
