# Circadian

> Bind your web UI's colors to the real sun — pure-CSS color animations synced to a location's day/night cycle.

> Source & original author: [@shawnfromportland](https://github.com/shawnfromportland)

## What

Circadian is a tiny vanilla JavaScript library that animates the background and text colors of page elements according to a real-world time and place on Earth. It uses [SunCalc](https://github.com/mourner/suncalc) to compute today's actual sun-phase times (dawn, sunrise, solar noon, sunset, dusk, etc.) for a given latitude/longitude, then generates pure-CSS `@keyframes` that morph through a color palette across the 24-hour cycle. Because the animation is pure CSS, it runs efficiently with no per-frame JavaScript.

## Why

Bind UI colors to a location-aware day/night cycle. Use it for time-of-day theming of a whole site, ambience loops in browser games, or decorative day/night scenes — all without hand-authoring keyframes or running timers.

## Who

Created by Shawn K ([@shawnfromportland](https://github.com/shawnfromportland)). For front-end developers, hobbyists, and creative coders who want location-aware, time-of-day color animations with a drop-in script and a single CSS class.

## Where

- **Runs**: in the browser. No build step — include the script from CDN and add a class, or serve `index.html` from any static server for the interactive demo.
- **Live demo**: [shawnfromportland.com/circadian](https://shawnfromportland.com/circadian)
- **CDN**: `https://cdn.jsdelivr.net/gh/shawnfromportland/circadian@main/circadian.js`
- **Repo**: [github.com/shawnfromportland/circadian](https://github.com/shawnfromportland/circadian) (remote also configured as `https://github.com/sfplabs/circadian.git`)

## When

Stable and usable today. Distributed as a single `circadian.js` file with no package manifest or bundler. Use it whenever you want colors tied to real sun phases at a location; it is not suited to bundler-based imports or npm workflows as-is (include it via a `<script>` tag).

## Quick start

Include SunCalc and Circadian from CDN, add the `.circadian` class, then instantiate and initialize:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/shawnfromportland/circadian@main/circadian.js"></script>

<body class="circadian">
  <p class="circadian-invert">color-inverted circadian text</p>

  <script>
    const myCircadian = new Circadian();
    myCircadian.init({
      coordinates: { lat: 44.5, lon: -123.2 },
      transitionMode: 'continuous',
      themeName: 'original'
    });
  </script>
</body>
```

To run the demo locally, serve the project directory with any static server (e.g. `python -m http.server`) and open `index.html`.

## TypeScript package

The package API separates solar calculations from the legacy CSS integration,
so games and component libraries can bind any phase-keyed property:

```bash
npm install @sfplabs/circadian
```

```ts
import { Circadian, type PhaseValues } from '@sfplabs/circadian'

const sky = new Circadian({
  coordinates: { lat: 45.5152, lon: -122.6784 },
  transitionMode: 'continuous',
})

const gradients: PhaseValues<readonly string[]> = {
  // Define a color-stop array for all 14 exported SUN_PHASES.
}

const currentGradient = sky.gradient(gradients)
```

Core methods:

- `getSolarTimeline(date, coordinates)` — sorted SunCalc phase points.
- `getSolarState(options)` — surrounding phases and normalized progress.
- `resolveCircadianValue(values, state, interpolate)` — generic property binding.
- `interpolateColor()` / `interpolateGradient()` — ready-made CSS color helpers.
- `Circadian.color()` / `.gradient()` / `.value()` — configured reusable API.

The original CDN script and `.circadian` CSS classes remain supported.

## Documentation

- [docs/overview](docs/overview/README.md) — what Circadian is, why it exists, and core concepts (sun phases, keyframes).
- [docs/getting-started](docs/getting-started/README.md) — prerequisites, CDN install, running the demo, and first use.
- [docs/architecture](docs/architecture/README.md) — tech stack, file structure, and how CSS keyframes are generated from SunCalc data.
- [docs/usage](docs/usage/README.md) — features, classes, themes, and transition modes.
- [docs/development](docs/development/README.md) — dev environment and how to add or extend themes.
- [docs/reference](docs/reference/README.md) — full config options, class API, CDN URLs, and the themes list.

## Credits

Created and maintained by Shawn K — [@shawnfromportland](https://github.com/shawnfromportland). If this is useful, you can [buy him a coffee](https://www.buymeacoffee.com/shawnfromportland).
