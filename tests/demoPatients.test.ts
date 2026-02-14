import { describe, expect, it } from 'vitest'
import { buildDemoPatients } from '../src/data/demoPatients'

describe('demo patients', () => {
  it('incluye variedad suficiente sin datos de triaje precargados', () => {
    const demos = buildDemoPatients()
    expect(demos.length).toBeGreaterThanOrEqual(10)
    expect(demos.every((patient) => !patient.assessment)).toBe(true)
    expect(demos.every((patient) => !patient.result)).toBe(true)
  })

  it('incluye datos clínicos completos en cada caso demo', () => {
    const demos = buildDemoPatients()
    demos.forEach((patient) => {
      expect(patient.clinical.antecedentes?.trim()).toBeTruthy()
      expect(patient.clinical.alergias?.trim()).toBeTruthy()
      expect(patient.clinical.medicacion?.trim()).toBeTruthy()
      expect(patient.clinical.vacunacion?.trim()).toBeTruthy()
      expect(patient.clinical.riesgosSociales?.trim()).toBeTruthy()
      expect(patient.assessment).toBeUndefined()
      expect(patient.result).toBeUndefined()
    })
  })
})
