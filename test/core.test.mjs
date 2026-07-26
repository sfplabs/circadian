import test from 'node:test'
import assert from 'node:assert/strict'
import {
  Circadian,
  SUN_PHASES,
  getSolarState,
  interpolateColor,
  interpolateGradient,
} from '../dist/index.js'

const portland = { lat: 45.5152, lon: -122.6784 }

test('resolves surrounding solar phases and bounded progress', () => {
  const state = getSolarState({
    coordinates: portland,
    date: new Date('2026-07-25T20:30:00-07:00'),
  })
  assert.ok(SUN_PHASES.includes(state.previousPhase))
  assert.ok(SUN_PHASES.includes(state.nextPhase))
  assert.ok(state.phaseProgress >= 0 && state.phaseProgress <= 1)
  assert.ok(state.nextPhaseTime > state.previousPhaseTime)
})

test('interpolates colors and gradient stops', () => {
  assert.equal(interpolateColor('#000', '#ffffff', 0.5), 'rgba(128, 128, 128, 1)')
  assert.deepEqual(interpolateGradient(['#000000', '#ff0000'], ['#ffffff', '#0000ff'], 0.5), [
    'rgba(128, 128, 128, 1)',
    'rgba(128, 0, 128, 1)',
  ])
})

test('Circadian resolves phase-keyed gradient properties', () => {
  const gradients = Object.fromEntries(
    SUN_PHASES.map((phase, index) => [
      phase,
      [`rgb(${index * 10}, 0, 0)`, `rgb(0, ${index * 10}, 0)`],
    ]),
  )
  const circadian = new Circadian({
    coordinates: portland,
    transitionMode: 'continuous',
  })
  const gradient = circadian.gradient(gradients, new Date('2026-07-25T20:30:00-07:00'))
  assert.equal(gradient.length, 2)
  assert.match(gradient[0], /^rgba\(/)
})
