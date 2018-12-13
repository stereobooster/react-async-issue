# Experiment

Here is the classical issue with async components in React.

When React application boots (`ReactDOM.render`) and some components are not loaded, it will flush current available components, which can be some loader or empty screen (`null`). If there was some HTML before (SSR or prerendered with react-snap) user will see flash of white screen.

![filmstrip](public/filmstrip.png)

I created this filmstrip with the help of https://www.webpagetest.org/.

### Suspense

I expected that `Suspense` would solve this issue, because it suppose to pause rendering. So I hopped it will not flush placeholder while it waits for subcomponent to load.

On the other side - I know that Suspense and asynchronouse rendering is not finished yet, so I hope it will be fixed in the future.
