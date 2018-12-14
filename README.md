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
const root = ReactDom.unstable_createRoot(rootElement, { hydrate: true });
root.render(Root);
```

The problem was, that before I tried separately `React.unstable_ConcurrentMode` and `unstable_createRoot`, but not together.

![filmstrip](public/filmstrip-concurent.png)

### Hydrate vs re-render

If you use prerendering instead of SSR, there is a chance that client side rendered HTML can be slightly different than prerendered one (which, I guess, bad practice).

The simplest example, can look like this:

```js
<div style={{ background: prerendering ? green : darkBlue }} />
```

![filmstrip](public/filmstrip-hydrate.png)

As the result `ReactDom.unstable_createRoot(rootElement, { hydrate: true })` will produce `green` div. The only way to avoid this is to "re-render" (which is less performant than hydrate).

```js
const root = ReactDom.unstable_createRoot(rootElement);
// this is hacky to fix double copy of <div class="App">
const callback = rootElement.hasChildNodes()
  ? () => rootElement.removeChild(rootElement.firstChild)
  : () => {};
root.render(Root, callback);
```

If you will not use the hack it will result in two copies of `<div class="App">` one green (from pre-rendering) and one blue (from re-rendering).

![filmstrip](public/filmstrip-rerender.png)
