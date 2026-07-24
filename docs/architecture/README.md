# Architecture

The tech stack, file layout, and how CSS keyframes are generated from SunCalc data.

## Tech stack

- **Vanilla JavaScript** — the library is a single `Circadian` class in `circadian.js`. No framework, bundler, or package manifest.
- **[SunCalc](https://github.com/mourner/suncalc) 1.8.0** — loaded from CDN, used to compute sun-phase times for a location and date.
- **Pure CSS `@keyframes`** — Circadian writes an inline `<style>` element; the browser runs the animation with no per-frame JS.
- **Demo-only dependencies** — `index.html` additionally loads [Chart.js](https://www.chartjs.org/) (sun-phase pie chart) and a Google Font (Alfa Slab One).

## File structure

- `circadian.js` — the `Circadian` class: default `config`, the `themes` object (8 palettes), and methods `constructor()`, `init()`, `fetchSunData()`, `generateCircadianCSS()`, and `initCircadianAnimation()`.
- `index.html` — interactive demo: coordinate input, theme/transition buttons, sun-phase pie chart, and glue code (`setTheme`, `setFade`, `initCircadian`, `renderSunPieChart`).
- `css.css` — demo page styles.
- `README.md` — project overview (standardized).
- `.github/funding.yml` — funding config.
- `.idea/` — JetBrains IDE project files.

## How keyframes are generated from SunCalc data

The pipeline runs inside `init()` → `initCircadianAnimation()`:

1. **`fetchSunData(coords)`** — takes `new Date()`, computes seconds elapsed since local midnight (`secondsSinceDayStart`), and calls `SunCalc.getTimes(now, lat, lon)`. The returned phase times are sorted chronologically into `sunSorted`.

2. **`generateCircadianCSS(sunData)`** — builds two `@keyframes` blocks, `circadian-animation` and `circadian-animation-invert`, both anchored at `0%, 100%` with the `nadir` colors. For each sorted phase it computes a day percentage:

   ```
   secondsSinceMidnight = (phaseTime - firstPhaseTime) / 1000
   dayPercent = round(secondsSinceMidnight / 86400 * 100)
   ```

   - In **`continuous`** mode, each phase emits a single keyframe at its `dayPercent` with that phase's background/text color, so the browser fades smoothly between phases.
   - In **`staged`** mode, each phase emits three keyframes — hold at `dayPercent`, hold again at `dayPercent + 1`, then transition to the next phase's colors at `nextDayPercent - 1` — producing a hold-then-shift effect.

   The invert block swaps the background and text colors for every keyframe.

3. **Applying the animation** — the generated CSS appends rules binding the keyframes to the classes:

   ```css
   .circadian { animation: circadian-animation 86400s linear -{secondsSinceDayStart}s infinite normal; }
   .circadian-invert { animation: circadian-animation-invert 86400s linear -{secondsSinceDayStart}s infinite normal; }
   ```

   The 86400s (24h) duration with a negative delay of `secondsSinceDayStart` starts the animation partway through, so the on-screen colors match the current time of day. Any existing `#circadian-styles` element is removed and the new `<style>` is prepended to `<head>`, which lets callers override `animation-duration` in later CSS (e.g. the demo runs a 40s cycle).

## Related docs

- [overview](../overview/README.md)
- [getting-started](../getting-started/README.md)
- [usage](../usage/README.md)
- [development](../development/README.md)
- [reference](../reference/README.md)
- [Project README](../../README.md)
