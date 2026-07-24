# Overview

What Circadian is, why it exists, and the concepts behind it.

## What & why

Circadian is a small vanilla JavaScript library that animates the background and text colors of HTML elements to match the real day/night cycle at a chosen location. Instead of a timer running color changes in JavaScript, Circadian reads the current date and a latitude/longitude, computes the day's sun-phase times, and writes a pure-CSS `@keyframes` animation that browsers run efficiently on their own.

The goal is to make location-aware, time-of-day color theming trivial: drop in a script, add a class, pick a palette. If it is night at the given coordinates, elements show night colors; at dawn they show dawn colors, and so on across a 24-hour loop.

## Core concepts

- **Sun phases**: SunCalc returns named moments in a day — `nadir`, `nightEnd`, `nauticalDawn`, `dawn`, `sunrise`, `sunriseEnd`, `goldenHourEnd`, `solarNoon`, `goldenHour`, `sunsetStart`, `sunset`, `dusk`, `nauticalDusk`, `night`. Each palette defines a background and text color per phase.
- **Location & date**: The `coordinates` config ({ lat, lon }) plus today's date determine when each phase occurs. Sun-phase times vary by place and season, so the animation reflects the real world.
- **Pure-CSS keyframes**: Circadian maps each phase's time to a percentage of the 24-hour cycle and emits an `@keyframes` rule. The animation is negatively offset so its position matches the current time of day.
- **Themes**: 8 built-in color palettes, plus the ability to supply custom `bgColors`/`textColors`.
- **Transition modes**: `continuous` (smooth fade between phases) or `staged` (hold each phase, then transition).
- **Classes**: `.circadian` applies the animation; `.circadian-invert` swaps background and text colors.

## Related docs

- [getting-started](../getting-started/README.md)
- [architecture](../architecture/README.md)
- [usage](../usage/README.md)
- [development](../development/README.md)
- [reference](../reference/README.md)
- [Project README](../../README.md)
