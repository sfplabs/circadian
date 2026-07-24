# Development

Dev environment and how to extend themes.

## Dev environment

There is no build step, package manifest, or test suite. Development is direct editing of the source files:

- `circadian.js` — the library.
- `index.html` / `css.css` — the demo used to exercise changes.

To work locally, serve the project directory with any static server and open `index.html`:

```bash
python -m http.server
# visit http://localhost:8000/index.html
```

Edit `circadian.js`, reload the page, and use the demo's theme, transition, and coordinate controls to verify behavior. The class logs config and sun data to the console (`console.log` calls in `constructor`, `init`, `fetchSunData`, and `generateCircadianCSS`) to aid debugging.

## How to add or extend a theme

Themes live in the `themes` object inside the `Circadian` class in `circadian.js`. Each theme has a `bgColors` map and a `textColors` map, and both must include an entry for every sun phase:

`nadir`, `nightEnd`, `nauticalDawn`, `dawn`, `sunrise`, `sunriseEnd`, `goldenHourEnd`, `solarNoon`, `goldenHour`, `sunsetStart`, `sunset`, `dusk`, `nauticalDusk`, `night`.

To add a theme:

1. Add a new keyed entry to `themes`, e.g.:

   ```javascript
   myTheme: {
     bgColors: { nadir: "rgba(0,0,0,1)", /* ...all 14 phases... */ },
     textColors: { nadir: "#ffffff", /* ...all 14 phases... */ }
   }
   ```

2. Reference it via config: `myCircadian.init({ themeName: 'myTheme' })`.
3. (Demo) To surface it in `index.html`, add a `<button onclick="setTheme('myTheme')" data-theme="myTheme">My Theme</button>` in the `.theme-buttons` container.

Missing any of the 14 phase keys will produce `undefined` colors in the generated keyframes for those phases, so keep both maps complete. For one-off palettes you can skip editing `themes` and instead pass `bgColors`/`textColors` directly to `init()`.

## Related docs

- [overview](../overview/README.md)
- [getting-started](../getting-started/README.md)
- [architecture](../architecture/README.md)
- [usage](../usage/README.md)
- [reference](../reference/README.md)
- [Project README](../../README.md)
