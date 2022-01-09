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
      主应用
      <Router>
        <Switch>
          <Route exact path="/" component={App500px}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
