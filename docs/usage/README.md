# Usage

Features, classes, themes, and transition modes.

## Features

- Sun-phase times driven by real location/date data via SunCalc.
- Programmatic generation of pure-CSS keyframes for background and text colors.
- Two application classes: `.circadian` and `.circadian-invert`.
- 8 built-in themes plus custom `bgColors`/`textColors`.
- Two transition modes: `continuous` and `staged`.
- Overridable animation duration via CSS.
- Demo includes a sun-phase pie chart (Chart.js).

## Applying with classes

Add a class to any element:

```html
<div class="circadian">Animates with circadian colors.</div>
<div class="circadian-invert">Animates with inverted circadian colors.</div>
```

By default the animation runs a 24-hour cycle synced to the current date and time — showing night colors at night, dawn colors at dawn, and so on.

## Themes

Select a palette with `themeName`. Built-in themes:

`original`, `claude`, `chatgpt4o`, `grayscale`, `redscale`, `cyber`, `realistic`, `apple`.

```javascript
myCircadian.init({ themeName: 'cyber' });
```

You can also override colors entirely by passing `bgColors` and/or `textColors` (see [reference](../reference/README.md) for the required phase keys). Provided color objects take precedence over the selected `themeName`.

## Transition modes

- **`continuous`** (default): colors fade smoothly and continuously between every phase around the 24-hour cycle.
- **`staged`**: each phase holds its color, then shifts to the next phase's color — a more stepped look.

```javascript
myCircadian.init({ transitionMode: 'staged' });
```

## Overriding animation duration

To cycle faster than 24 hours, override `animation-duration` in your own CSS (the demo uses 40s):

```css
.circadian { animation-duration: 10s; }
.circadian-invert { animation-duration: 10s; }
```

## Example use cases

- Time-of-day color scheme for a whole site, centered on the visitor's or headquarters' location.
- A short (e.g. 10-minute or 40-second) day/night ambience loop for a browser game.
- A decorative HTML "snow globe" scene cycling day and night.

## Related docs

- [overview](../overview/README.md)
- [getting-started](../getting-started/README.md)
- [architecture](../architecture/README.md)
- [development](../development/README.md)
- [reference](../reference/README.md)
- [Project README](../../README.md)
