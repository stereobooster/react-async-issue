import React, { Suspense } from "react";
import ReactDom from "react-dom";
import "./index.css";
// import * as serviceWorker from "./serviceWorker";

const v = process.env.REACT_APP_GIT_SHA;
v && console.log(v);

const App = React.lazy(() => import("./App"));

const ConcurrentMode = React.unstable_ConcurrentMode;
const Root = (
  <ConcurrentMode>
    <Suspense fallback={null} maxDuration={5000}>
      <App />
    </Suspense>
  </ConcurrentMode>
);

const rootElement = document.getElementById("root");
const root = ReactDom.unstable_createRoot(rootElement, { hydrate: true });
root.render(Root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
