import { getTimes } from 'suncalc'

export const SUN_PHASES = [
  'nadir',
  'nightEnd',
  'nauticalDawn',
  'dawn',
  'sunrise',
  'sunriseEnd',
  'goldenHourEnd',
  'solarNoon',
  'goldenHour',
  'sunsetStart',
  'sunset',
  'dusk',
  'nauticalDusk',
  'night',
] as const

export type SunPhase = (typeof SUN_PHASES)[number]
export type TransitionMode = 'continuous' | 'staged'
export type Coordinates = { lat: number; lon: number }
export type PhaseValues<T> = Record<SunPhase, T>
export type Gradient = readonly string[]

export type SolarPhasePoint = {
  phase: SunPhase
  time: Date
}

export type SolarState = {
  date: Date
  coordinates: Coordinates
  previousPhase: SunPhase
  nextPhase: SunPhase
  previousPhaseTime: Date
  nextPhaseTime: Date
  /** Raw position between the surrounding SunCalc phases. */
  phaseProgress: number
  /** Progress after the selected continuous/staged transition mode. */
  transitionProgress: number
}

export type CircadianOptions = {
  coordinates: Coordinates
  transitionMode?: TransitionMode
  /** Portion of each phase interval held before a staged transition. */
  stagedHoldRatio?: number
}

export type SampleOptions = CircadianOptions & {
  date?: Date
}

const DAY_MS = 86_400_000

/** Return chronologically sorted SunCalc phases around a date. */
export function getSolarTimeline(date: Date, coordinates: Coordinates): SolarPhasePoint[] {
  assertCoordinates(coordinates)
  const points: SolarPhasePoint[] = []

  // Adjacent days make midnight wrapping and cross-timezone locations reliable.
  for (const dayOffset of [-1, 0, 1]) {
    const sampleDate = new Date(date.getTime() + dayOffset * DAY_MS)
    const times = getTimes(sampleDate, coordinates.lat, coordinates.lon)
    for (const phase of SUN_PHASES) {
      const phaseDate = times[phase]
      if (phaseDate instanceof Date && Number.isFinite(phaseDate.getTime())) {
        points.push({ phase, time: phaseDate })
      }
    }
  }

  return points.sort((a, b) => a.time.getTime() - b.time.getTime())
}

/** Resolve the phases surrounding a date and the transition progress between them. */
export function getSolarState(options: SampleOptions): SolarState {
  const date = options.date ?? new Date()
  if (!Number.isFinite(date.getTime())) throw new TypeError('date must be valid')

  const timeline = getSolarTimeline(date, options.coordinates)
  const nextIndex = timeline.findIndex((point) => point.time.getTime() > date.getTime())
  if (nextIndex <= 0) {
    throw new Error('Unable to resolve surrounding solar phases for this date and location')
  }

  const previous = timeline[nextIndex - 1]!
  const next = timeline[nextIndex]!
  const interval = Math.max(1, next.time.getTime() - previous.time.getTime())
  const phaseProgress = clamp01((date.getTime() - previous.time.getTime()) / interval)
  const transitionMode = options.transitionMode ?? 'continuous'
  const transitionProgress =
    transitionMode === 'staged'
      ? stagedProgress(phaseProgress, options.stagedHoldRatio ?? 0.68)
      : phaseProgress

  return {
    date,
    coordinates: options.coordinates,
    previousPhase: previous.phase,
    nextPhase: next.phase,
    previousPhaseTime: previous.time,
    nextPhaseTime: next.time,
    phaseProgress,
    transitionProgress,
  }
}

/** Resolve any phase-keyed property using a caller-provided interpolator. */
export function resolveCircadianValue<T>(
  values: PhaseValues<T>,
  state: SolarState,
  interpolate: (from: T, to: T, progress: number) => T,
): T {
  return interpolate(
    values[state.previousPhase],
    values[state.nextPhase],
    state.transitionProgress,
  )
}

/** Interpolate #RGB, #RRGGBB, rgb(), and rgba() colors. */
export function interpolateColor(from: string, to: string, progress: number): string {
  const a = parseColor(from)
  const b = parseColor(to)
  const t = clamp01(progress)
  const mix = (start: number, end: number) => start + (end - start) * t
  const red = Math.round(mix(a[0], b[0]))
  const green = Math.round(mix(a[1], b[1]))
  const blue = Math.round(mix(a[2], b[2]))
  const alpha = Math.round(mix(a[3], b[3]) * 1000) / 1000
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

/** Interpolate matching CSS color-stop arrays. */
export function interpolateGradient(
  from: Gradient,
  to: Gradient,
  progress: number,
): string[] {
  if (from.length !== to.length || from.length === 0) {
    throw new TypeError('gradient palettes must have equal, non-zero lengths')
  }
  return from.map((color, index) => interpolateColor(color, to[index]!, progress))
}

/** Reusable configured sampler for UI, canvas, and game integrations. */
export class Circadian {
  private options: Required<CircadianOptions>

  constructor(options: CircadianOptions) {
    this.options = normalizeOptions(options)
  }

  configure(options: Partial<CircadianOptions>) {
    this.options = normalizeOptions({ ...this.options, ...options })
    return this
  }

  state(date = new Date()) {
    return getSolarState({ ...this.options, date })
  }

  value<T>(
    values: PhaseValues<T>,
    interpolate: (from: T, to: T, progress: number) => T,
    date = new Date(),
  ) {
    return resolveCircadianValue(values, this.state(date), interpolate)
  }

  color(values: PhaseValues<string>, date = new Date()) {
    return this.value(values, interpolateColor, date)
  }

  gradient(values: PhaseValues<Gradient>, date = new Date()) {
    return this.value(values, interpolateGradient, date)
  }
}

function normalizeOptions(options: CircadianOptions): Required<CircadianOptions> {
  assertCoordinates(options.coordinates)
  const stagedHoldRatio = options.stagedHoldRatio ?? 0.68
  if (stagedHoldRatio < 0 || stagedHoldRatio >= 1) {
    throw new RangeError('stagedHoldRatio must be at least 0 and less than 1')
  }
  return {
    coordinates: { ...options.coordinates },
    transitionMode: options.transitionMode ?? 'continuous',
    stagedHoldRatio,
  }
}

function stagedProgress(progress: number, holdRatio: number) {
  if (progress <= holdRatio) return 0
  const t = clamp01((progress - holdRatio) / (1 - holdRatio))
  return t * t * (3 - 2 * t)
}

function parseColor(color: string): [number, number, number, number] {
  const value = color.trim()
  const shortHex = /^#([\da-f])([\da-f])([\da-f])$/i.exec(value)
  if (shortHex) {
    return [
      Number.parseInt(shortHex[1]! + shortHex[1]!, 16),
      Number.parseInt(shortHex[2]! + shortHex[2]!, 16),
      Number.parseInt(shortHex[3]! + shortHex[3]!, 16),
      1,
    ]
  }

  const hex = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value)
  if (hex) {
    return [
      Number.parseInt(hex[1]!, 16),
      Number.parseInt(hex[2]!, 16),
      Number.parseInt(hex[3]!, 16),
      1,
    ]
  }

  const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
    value,
  )
  if (rgb) {
    return [
      clamp255(Number(rgb[1])),
      clamp255(Number(rgb[2])),
      clamp255(Number(rgb[3])),
      clamp01(rgb[4] === undefined ? 1 : Number(rgb[4])),
    ]
  }

  throw new TypeError(`Unsupported color format: ${color}`)
}

function assertCoordinates(coordinates: Coordinates) {
  if (
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lon) ||
    coordinates.lat < -90 ||
    coordinates.lat > 90 ||
    coordinates.lon < -180 ||
    coordinates.lon > 180
  ) {
    throw new RangeError('coordinates must contain valid latitude and longitude')
  }
}

function clamp255(value: number) {
  return Math.max(0, Math.min(255, value))
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}
