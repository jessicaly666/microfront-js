# package 集成

每个微前端发布成一个 node 包，主应用将子应用作为依赖项

> 缺点：不灵活。必须重新编译和发布，才能看出子应用的更改

# iframe 集成

基于路由，不同路由，iframe 引入不同的 html

> 缺点：不灵活。iframe 的隔离机制，让路由、历史记录、深层链接、传参等更加复杂，很难做成响应式页面。

```html
<html>
  <head>
    <title>Feed me!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

    <iframe id="micro-frontend-container"></iframe>

    <script type="text/javascript">
      const microFrontendsByRoute = {
        "/": "https://browse.example.com/index.html",
        "/order-food": "https://order.example.com/index.html",
        "/user-profile": "https://profile.example.com/index.html",
      };

      const iframe = document.getElementById("micro-frontend-container");
      iframe.src = microFrontendsByRoute[window.location.pathname];
    </script>
  </body>
</html>
```

# js 集成

- 每个微应用导出一个全局方法变量
- 主应用根据路由，不同的路由，加载不同的 bundle.js，并调用对应的全局方法（在指定的位置，渲染出微应用）

> 优点：1.独立性。每个微应用独立打包成 bundle.js，独立部署。2.灵活性。可以控制何时下载微应用，何地渲染微应用，以及控制微应用的传参。

```js
<html>
  <head>
    <title>Feed me!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

    <!-- 这些脚本不会马上渲染应用 -->
    <!-- 而是分别暴露全局变量 -->
    <script src="https://browse.example.com/bundle.js"></script>
    <script src="https://order.example.com/bundle.js"></script>
    <script src="https://profile.example.com/bundle.js"></script>

    <div id="micro-frontend-root"></div>

    <script type="text/javascript">
      // 这些全局函数是上面脚本暴露的
      const microFrontendsByRoute = {
        '/': window.renderBrowseRestaurants,
        '/order-food': window.renderOrderFood,
        '/user-profile': window.renderUserProfile,
      };
      const renderFunction = microFrontendsByRoute[window.location.pathname];

      // 渲染第一个微应用
      renderFunction('micro-frontend-root');
    </script>
  </body>
</html>
```

# Web Component 集成

- 每个微应用导出一个 html 自定义元素
- 主应用根据路由，不同的路由，加载不同的 bundle.js，并渲染对应的自定义标签

```js
<html>
  <head>
    <title>Feed me!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

     <!-- 这些脚本不会马上渲染应用 -->
    <!-- 而是分别提供自定义标签 -->
    <script src="https://browse.example.com/bundle.js"></script>
    <script src="https://order.example.com/bundle.js"></script>
    <script src="https://profile.example.com/bundle.js"></script>

    <div id="micro-frontend-root"></div>

    <script type="text/javascript">
      // 这些标签名是上面代码定义的
      const webComponentsByRoute = {
        '/': 'micro-frontend-browse-restaurants',
        '/order-food': 'micro-frontend-order-food',
        '/user-profile': 'micro-frontend-user-profile',
      };
      const webComponentType = webComponentsByRoute[window.location.pathname];

      // 渲染第一个微应用（自定义标签）
      const root = document.getElementById('micro-frontend-root');
      const webComponent = document.createElement(webComponentType);
      root.appendChild(webComponent);
    </script>
  </body>
</html>
```

# 项目实践（基于 js 集成）

## 主应用

```
npx create-react-app base
yarn start
```

子应用模板组件

> 定义子应用下载和渲染逻辑。引入对应的 bundle.js，并调用暴露的 window.mount 方法

```js
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
```

装载子应用

```js
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MicroApp from "./microApp";

function App500px() {
  return (
    <MicroApp
      name="500px"
      host="http://localhost:3001"
      props={{ username: "jessica" }}
    />
  );
}

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={App500px}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
```

## 子应用

```
npx create-react-app 500px
yarn start
```

> 运行在 http://localhost:3001

子应用暴露生命周期函数

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.mount = (containerId, props) => {
  ReactDOM.render(<App {...props} />, document.getElementById(containerId));
};

window.unmount = (containerId) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
};
```

子应用接收参数

```js
export default function App(props) {
  return <div>500px首页 {props.username}</div>;
}
```

本地开发时，更改子应用 public/index.html

```js
<script>
  window.onload = () => {
    window.mount('root');
  };
</script>
```
