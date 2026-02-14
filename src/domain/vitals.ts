import type { VitalSigns } from './types'

export type AgeBand =
  | 'recien_nacido'
  | 'lactante'
  | 'nino_pequeno'
  | 'preescolar'
  | 'escolar'
  | 'adolescente'
  | 'adulto'

export type Threshold = {
  criticalLow?: number
  urgentLow?: number
  warningLow?: number
  warningHigh?: number
  urgentHigh?: number
  criticalHigh?: number
}

export type VitalThresholds = {
  hr: Threshold
  rr: Threshold
  sbp: Threshold
  spo2: Threshold
  temp: Threshold
  gcs: Threshold
}

const adultThresholds: VitalThresholds = {
  // Adulto (alineado con criterios AHA/ACLS de inestabilidad):
  // FC normal 60-100; bradicardia sintomática relevante <50; taquicardia inestable >150.
  // TAS inestabilidad hemodinámica <90 mmHg.
  hr: { criticalLow: 40, urgentLow: 50, warningLow: 60, warningHigh: 100, urgentHigh: 130, criticalHigh: 150 },
  rr: { criticalLow: 8, urgentLow: 10, warningLow: 12, warningHigh: 20, urgentHigh: 28, criticalHigh: 35 },
  sbp: { criticalLow: 70, urgentLow: 80, warningLow: 90, warningHigh: 160, urgentHigh: 180, criticalHigh: 200 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: { criticalLow: 33, urgentLow: 34, warningLow: 35.5, warningHigh: 37.5, urgentHigh: 40, criticalHigh: 41 },
  gcs: { criticalLow: 8, urgentLow: 12, warningLow: 14 },
}

// Rangos pediátricos alineados con referencias PALS de la AHA:
// FC/FR por grupos de edad y límite de hipotensión sistólica
// (RN < 60; lactante < 70; 1-10 años < 70 + 2*edad; >10 años < 90).
const pediatricTempThresholds: Threshold = {
  criticalLow: 34.5,
  urgentLow: 35.5,
  warningLow: 36.4,
  warningHigh: 37.6,
  urgentHigh: 39,
  criticalHigh: 40,
}

const newbornThresholds: VitalThresholds = {
  hr: { criticalLow: 79, urgentLow: 89, warningLow: 99, warningHigh: 181, urgentHigh: 200, criticalHigh: 220 },
  rr: { criticalLow: 19, urgentLow: 24, warningLow: 29, warningHigh: 61, urgentHigh: 70, criticalHigh: 80 },
  sbp: { criticalLow: 50, urgentLow: 60, warningLow: 70, warningHigh: 85, urgentHigh: 100, criticalHigh: 115 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: pediatricTempThresholds,
  gcs: adultThresholds.gcs,
}

const infantThresholds: VitalThresholds = {
  hr: { criticalLow: 79, urgentLow: 89, warningLow: 99, warningHigh: 161, urgentHigh: 180, criticalHigh: 200 },
  rr: { criticalLow: 19, urgentLow: 24, warningLow: 29, warningHigh: 61, urgentHigh: 70, criticalHigh: 80 },
  sbp: { criticalLow: 60, urgentLow: 70, warningLow: 80, warningHigh: 101, urgentHigh: 115, criticalHigh: 130 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: pediatricTempThresholds,
  gcs: adultThresholds.gcs,
}

const toddlerThresholds: VitalThresholds = {
  hr: { criticalLow: 69, urgentLow: 79, warningLow: 89, warningHigh: 151, urgentHigh: 170, criticalHigh: 190 },
  rr: { criticalLow: 15, urgentLow: 19, warningLow: 23, warningHigh: 41, urgentHigh: 50, criticalHigh: 60 },
  sbp: { criticalLow: 62, urgentLow: 72, warningLow: 82, warningHigh: 107, urgentHigh: 122, criticalHigh: 136 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: pediatricTempThresholds,
  gcs: adultThresholds.gcs,
}

const preschoolThresholds: VitalThresholds = {
  hr: { criticalLow: 59, urgentLow: 69, warningLow: 79, warningHigh: 141, urgentHigh: 160, criticalHigh: 180 },
  rr: { criticalLow: 13, urgentLow: 17, warningLow: 21, warningHigh: 35, urgentHigh: 44, criticalHigh: 54 },
  sbp: { criticalLow: 68, urgentLow: 78, warningLow: 88, warningHigh: 113, urgentHigh: 128, criticalHigh: 142 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: pediatricTempThresholds,
  gcs: adultThresholds.gcs,
}

const schoolThresholds: VitalThresholds = {
  hr: { criticalLow: 49, urgentLow: 59, warningLow: 69, warningHigh: 121, urgentHigh: 140, criticalHigh: 160 },
  rr: { criticalLow: 10, urgentLow: 13, warningLow: 17, warningHigh: 31, urgentHigh: 38, criticalHigh: 46 },
  sbp: { criticalLow: 72, urgentLow: 82, warningLow: 92, warningHigh: 116, urgentHigh: 131, criticalHigh: 145 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: pediatricTempThresholds,
  gcs: adultThresholds.gcs,
}

const adolescentThresholds: VitalThresholds = {
  hr: { criticalLow: 39, urgentLow: 49, warningLow: 59, warningHigh: 101, urgentHigh: 120, criticalHigh: 140 },
  rr: { criticalLow: 7, urgentLow: 9, warningLow: 11, warningHigh: 17, urgentHigh: 22, criticalHigh: 28 },
  sbp: { criticalLow: 80, urgentLow: 90, warningLow: 100, warningHigh: 132, urgentHigh: 150, criticalHigh: 170 },
  spo2: { criticalLow: 90, urgentLow: 92, warningLow: 94 },
  temp: pediatricTempThresholds,
  gcs: adultThresholds.gcs,
}

export const getAgeBand = (ageYears: number): AgeBand => {
  if (ageYears < 28 / 365) return 'recien_nacido'
  if (ageYears < 1) return 'lactante'
  if (ageYears < 4) return 'nino_pequeno'
  if (ageYears < 6) return 'preescolar'
  if (ageYears < 13) return 'escolar'
  if (ageYears < 18) return 'adolescente'
  return 'adulto'
}

export const getThresholds = (ageYears: number): VitalThresholds => {
  const band = getAgeBand(ageYears)
  switch (band) {
    case 'recien_nacido':
      return newbornThresholds
    case 'lactante':
      return infantThresholds
    case 'nino_pequeno':
      return toddlerThresholds
    case 'preescolar':
      return preschoolThresholds
    case 'escolar':
      return schoolThresholds
    case 'adolescente':
      return adolescentThresholds
    default:
      return adultThresholds
  }
}

const evaluateValue = (value: number, threshold: Threshold, label: string) => {
  if (threshold.criticalLow !== undefined && value <= threshold.criticalLow) {
    return { severity: 1, flag: `${label} críticamente baja` }
  }
  if (threshold.criticalHigh !== undefined && value >= threshold.criticalHigh) {
    return { severity: 1, flag: `${label} críticamente alta` }
  }
  if (threshold.urgentLow !== undefined && value <= threshold.urgentLow) {
    return { severity: 2, flag: `${label} muy baja` }
  }
  if (threshold.urgentHigh !== undefined && value >= threshold.urgentHigh) {
    return { severity: 2, flag: `${label} muy alta` }
  }
  if (threshold.warningLow !== undefined && value <= threshold.warningLow) {
    return { severity: 3, flag: `${label} baja` }
  }
  if (threshold.warningHigh !== undefined && value >= threshold.warningHigh) {
    return { severity: 3, flag: `${label} alta` }
  }
  return { severity: 5, flag: '' }
}

export const evaluateVitals = (vitals: VitalSigns, ageYears: number) => {
  const thresholds = getThresholds(ageYears)
  const flags: string[] = []
  let severity = 5

  const check = (value: number | undefined, threshold: Threshold, label: string) => {
    if (value === undefined || Number.isNaN(value)) return
    const result = evaluateValue(value, threshold, label)
    if (result.flag) flags.push(result.flag)
    severity = Math.min(severity, result.severity)
  }

  check(vitals.hr, thresholds.hr, 'Frecuencia cardiaca')
  check(vitals.rr, thresholds.rr, 'Frecuencia respiratoria')
  check(vitals.sbp, thresholds.sbp, 'Tensión sistólica')
  check(vitals.spo2, thresholds.spo2, 'SatO2')
  check(vitals.temp, thresholds.temp, 'Temperatura')
  check(vitals.gcs, thresholds.gcs, 'GCS')

  return { severity, flags }
}
