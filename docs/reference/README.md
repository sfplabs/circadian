# Reference

Full config options, class API, CDN URLs, sun phases, and themes list.

## Configuration options

Pass any of these to `Circadian.init(config)`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `coordinates` | object `{ lat, lon }` | `{ lat: 44.5, lon: -123.2 }` | Latitude/longitude used to compute sun-phase times. |
| `transitionMode` | string | `'continuous'` | `'continuous'` (smooth fade between phases) or `'staged'` (hold, then transition). |
| `themeName` | string | `'original'` | One of the built-in themes (see below). |
| `bgColors` | object (optional) | from theme | Custom background colors; overrides the theme. Must include all 14 phase keys. |
| `textColors` | object (optional) | from theme | Custom text colors; overrides the theme. Must include all 14 phase keys. |

When `init()` runs, the selected theme's colors are copied into `config.bgColors`/`config.textColors`; passing your own color maps overrides those.

## Sun phase keys

Every `bgColors`/`textColors` object must define these 14 keys (from SunCalc):

`nadir`, `nightEnd`, `nauticalDawn`, `dawn`, `sunrise`, `sunriseEnd`, `goldenHourEnd`, `solarNoon`, `goldenHour`, `sunsetStart`, `sunset`, `dusk`, `nauticalDusk`, `night`.

## Class API

`Circadian` (in `circadian.js`):

- **`constructor()`** — sets defaults and copies the default theme's colors into `config`.
- **`init(config = {})`** — merges the provided config with defaults, loads the selected theme's colors, and runs `initCircadianAnimation()`. Call again to regenerate styles at runtime.
- **`fetchSunData(coords)`** — returns `{ sunSorted, secondsSinceDayStart }`; uses `SunCalc.getTimes(new Date(), coords.lat, coords.lon)` and sorts phases chronologically.
- **`generateCircadianCSS(sunData)`** — builds the `circadian-animation` and `circadian-animation-invert` keyframes and injects a `<style id="circadian-styles">` into `<head>` (removing any prior one).
- **`initCircadianAnimation()`** — calls `fetchSunData` then `generateCircadianCSS`.

Generated classes:

- `.circadian` — background/text animate through the palette across the 24-hour cycle.
- `.circadian-invert` — same, with background and text colors swapped.

Both are bound with `animation: ... 86400s linear -{secondsSinceDayStart}s infinite normal;`. Override `animation-duration` in your own CSS to change the cycle length.

## CDN URLs

```html
<!-- SunCalc (required dependency) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js"></script>
<!-- Circadian -->
<script src="https://cdn.jsdelivr.net/gh/shawnfromportland/circadian@main/circadian.js"></script>
```

Demo-only CDN assets: Chart.js (`https://cdn.jsdelivr.net/npm/chart.js`) and the Alfa Slab One Google Font.

## Themes list

`original`, `claude`, `chatgpt4o`, `grayscale`, `redscale`, `cyber`, `realistic`, `apple`.

## Links

- Live demo: [shawnfromportland.com/circadian](https://shawnfromportland.com/circadian)
- Repo: [github.com/shawnfromportland/circadian](https://github.com/shawnfromportland/circadian) (remote `https://github.com/sfplabs/circadian.git`)

## Related docs

- [overview](../overview/README.md)
- [getting-started](../getting-started/README.md)
- [architecture](../architecture/README.md)
- [usage](../usage/README.md)
- [development](../development/README.md)
- [Project README](../../README.md)
