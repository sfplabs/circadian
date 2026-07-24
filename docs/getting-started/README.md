# Getting started

Prerequisites, installation, running the demo, and your first animation.

## Prerequisites

- A modern web browser.
- [SunCalc](https://github.com/mourner/suncalc) 1.8.0 available on the page (Circadian depends on the global `SunCalc`).
- For the demo only: a static file server, plus internet access for the CDN-loaded [Chart.js](https://www.chartjs.org/) and Google Fonts.

There is no build step, package manager, or bundler. Circadian is a single file (`circadian.js`).

## Install via CDN

Add SunCalc first, then Circadian:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/shawnfromportland/circadian@main/circadian.js"></script>
```

## Run the demo

The interactive demo lives in `index.html` (coordinate input, theme buttons, transition-mode buttons, and a sun-phase pie chart). Serve the project directory from any static server and open the page:

```bash
python -m http.server
# then visit http://localhost:8000/index.html
```

The hosted demo is at [shawnfromportland.com/circadian](https://shawnfromportland.com/circadian).

## First use

1. Add the `.circadian` class to any element you want animated (e.g. `<body class="circadian">`). Use `.circadian-invert` for the inverted color scheme.
2. Instantiate the class: `const myCircadian = new Circadian();`
3. Initialize with your options:

```javascript
myCircadian.init({
  coordinates: { lat: 44.5, lon: -123.2 },
  transitionMode: 'staged',
  themeName: 'realistic'
});
```

Calling `init()` computes sun data, generates the CSS keyframes, and injects a `<style id="circadian-styles">` element into the page. Re-calling `init()` regenerates and replaces the styles (useful for switching themes or coordinates at runtime).

## Related docs

- [overview](../overview/README.md)
- [architecture](../architecture/README.md)
- [usage](../usage/README.md)
- [development](../development/README.md)
- [reference](../reference/README.md)
- [Project README](../../README.md)
