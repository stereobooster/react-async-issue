# Experiment

Here is the classical issue with async components in React.

When React application boots (`ReactDOM.render`) and some components are not loaded, it will flush current available components, which can be some loader or empty screen (`null`). If there was some HTML before (SSR or prerendered with react-snap) user will see flash of white screen.

![filmstrip](public/filmstrip.png)

I created this filmstrip with the help of https://www.webpagetest.org/.

### Suspense

I expected that `Suspense` would solve this issue, because it suppose to pause rendering. So I hopped it will not flush placeholder while it waits for subcomponent to load.

On the other side - I know that Suspense and asynchronous rendering is not finished yet, so I hope it will be fixed in the future.

### Unstable ConcurrentMode

After poking around, it seems I found solution (which is marked as `unstable`).

```js
const ConcurrentMode = React.unstable_ConcurrentMode;
const Root = (
  <ConcurrentMode>
    <Suspense fallback={null} maxDuration={5000}>
      <App />
    </Suspense>
  </ConcurrentMode>
);

const rootElement = document.getElementById("root");
const root = ReactDom.unstable_createRoot(rootElement);
root.render(Root);
```

The problem was, that before I tried separately `React.unstable_ConcurrentMode` and `unstable_createRoot`, but not together.

![filmstrip](public/filmstrip-concurent.png)
