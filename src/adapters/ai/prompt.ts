import type { Patient, TriageAssessment } from '../../domain/types'
import { resolveGlasgowScore } from '../../domain/glasgow'

const shortText = (value: string | undefined, max = 140) => {
  const normalized = (value || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return 'ND'
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max).trim()}...`
}

const compactList = (values: string[], maxItems = 4, maxChars = 120) => {
  const joined = values.map((item) => item.trim()).filter(Boolean).slice(0, maxItems).join(', ')
  if (!joined) return 'ND'
  if (joined.length <= maxChars) return joined
  return `${joined.slice(0, maxChars).trim()}...`
}

const buildClinicalContext = (assessment: TriageAssessment, patient: Patient) => {
  const gcs = resolveGlasgowScore(assessment)
  const gcsDetalle = assessment.glasgow
    ? `O${assessment.glasgow.ocular ?? 'ND'} V${assessment.glasgow.verbal ?? 'ND'} M${assessment.glasgow.motor ?? 'ND'}`
    : 'ND'

  return `Datos del paciente:
- Edad: ${patient.demographics.edad} años
- Sexo: ${patient.demographics.sexo || 'no especificado'}
- Peso: ${patient.demographics.pesoKg ?? 'ND'} kg
- Antecedentes: ${patient.clinical.antecedentes || 'ND'}
- Alergias: ${patient.clinical.alergias || 'ND'}
- Medicación: ${patient.clinical.medicacion || 'ND'}
- Embarazo: ${patient.clinical.embarazo || 'ND'} ${patient.clinical.semanasEmbarazo ? `(${patient.clinical.semanasEmbarazo} semanas)` : ''}
- Vacunación: ${patient.clinical.vacunacion || 'ND'}
- Riesgos sociales: ${patient.clinical.riesgosSociales || 'ND'}

Datos de triaje:
- Motivo consulta: ${assessment.motivoConsulta || 'ND'}
- Categoría clínica: ${assessment.categoriaClinica}
- Síntomas: ${assessment.sintomas.length ? assessment.sintomas.join(', ') : 'ND'}
- Signos de alarma declarados: ${assessment.redFlags.length ? assessment.redFlags.join(', ') : 'ND'}
- Constantes: FC ${assessment.constantes.hr ?? 'ND'}, FR ${assessment.constantes.rr ?? 'ND'}, TA ${assessment.constantes.sbp ?? 'ND'}/${assessment.constantes.dbp ?? 'ND'}, SatO2 ${assessment.constantes.spo2 ?? 'ND'}, Temp ${assessment.constantes.temp ?? 'ND'}, GCS ${gcs ?? 'ND'} (${gcsDetalle}), Glucemia ${assessment.constantes.glucose ?? 'ND'}
- Dolor EVA (1-10): ${assessment.dolor}/10
- Observaciones: ${assessment.observaciones || 'ND'}
- Sospecha infecciosa: ${assessment.sospechaInfecciosa ? 'sí' : 'no'}`
}

export const buildPrompt = (assessment: TriageAssessment, patient: Patient) => {
  return `Actúa como un asistente de TRIAJE para enfermería en Urgencias. Tu función es proponer una PRIORIDAD ORIENTATIVA y generar documentación de triaje de forma estructurada, basándote SOLO en los datos aportados.

Reglas:
- Si faltan datos clave, NO inventes: indícalos en “Datos faltantes”.
- No des indicaciones médicas (tratamientos farmacológicos). Limítate a ACTUACIONES ENFERMERAS iniciales habituales y seguras.
- Incluye una SOSPECHA CLÍNICA orientativa (pre-diagnóstico diferencial corto), sin afirmar diagnósticos definitivos.
- La prioridad debe basarse en SET como referencia principal: 1 Reanimación, 2 Emergencia, 3 Urgencia, 4 Prioritario, 5 No urgente.
- En actuaciones de enfermería, prioriza por tiempo y operatividad (0-5 min, 5-15 min, 15-30 min).
- Añade recomendaciones de monitorización y criterios de escalada clínicos claros.
- Limita la longitud: texto breve y operativo.
- "resumen_clinico": entre 45 y 90 palabras.
- Resto de strings: máximo 18 palabras.
- Máximo 4 elementos por array.
- "preguntas_clave" deben ser preguntas clínicas reales, redactadas en formato interrogativo (¿...?).
- Sé breve, claro y operativo.

Salida obligatoria:
Devuelve SOLO un JSON válido (sin markdown ni texto adicional) con el siguiente esquema exacto:
{
  "resumen_clinico": "",
  "sospecha_clinica": [""],
  "prioridad_sugerida": 1,
  "motivo_prioridad": "",
  "red_flags_presentes": [""],
  "red_flags_ausentes": [""],
  "actuaciones_enfermeras": [""],
  "actuaciones_priorizadas": [""],
  "objetivos_monitorizacion": [""],
  "criterios_escalada": [""],
  "preguntas_clave": [""],
  "datos_faltantes": [""],
  "evolutivo_triaje": ""
}
No añadas texto fuera del JSON.

${buildClinicalContext(assessment, patient)}`
}

export const buildPriorityPrompt = (assessment: TriageAssessment, patient: Patient) => {
  const gcs = resolveGlasgowScore(assessment)
  const antecedentes = shortText(patient.clinical.antecedentes, 80)
  const motivo = shortText(assessment.motivoConsulta, 110)
  const observaciones = shortText(assessment.observaciones, 110)
  const sintomas = compactList(assessment.sintomas, 4, 90)
  const redFlags = compactList(assessment.redFlags, 4, 90)
  const embarazo =
    patient.clinical.embarazo === 'si'
      ? `si${patient.clinical.semanasEmbarazo ? ` (${patient.clinical.semanasEmbarazo} semanas)` : ''}`
      : patient.clinical.embarazo || 'desconocido'

  return `Actúa como un asistente de TRIAJE para enfermería en Urgencias. Devuelve SOLO la prioridad orientativa inicial según SET.

Reglas:
- Usa como referencia principal SET: 1 Reanimación, 2 Emergencia, 3 Urgencia, 4 Prioritario, 5 No urgente.
- No inventes datos ausentes.
- "motivo_prioridad" máximo 12 palabras y muy operativo.

Salida obligatoria:
Devuelve SOLO un JSON válido (sin markdown ni texto adicional) con este esquema exacto:
{
  "prioridad_sugerida": 1,
  "motivo_prioridad": ""
}

Datos (resumidos):
- Edad: ${patient.demographics.edad}
- Sexo: ${patient.demographics.sexo || 'no especificado'}
- Embarazo: ${embarazo}
- Antecedentes clave: ${antecedentes}
- Motivo: ${motivo}
- Categoría: ${assessment.categoriaClinica}
- Síntomas clave: ${sintomas}
- Signos de alarma declarados: ${redFlags}
- Constantes: FC ${assessment.constantes.hr ?? 'ND'}, FR ${assessment.constantes.rr ?? 'ND'}, TA ${assessment.constantes.sbp ?? 'ND'}/${assessment.constantes.dbp ?? 'ND'}, SatO2 ${assessment.constantes.spo2 ?? 'ND'}, Temp ${assessment.constantes.temp ?? 'ND'}, GCS ${gcs ?? 'ND'}, Glucosa ${assessment.constantes.glucose ?? 'ND'}
- Dolor EVA: ${assessment.dolor}/10
- Sospecha infecciosa: ${assessment.sospechaInfecciosa ? 'si' : 'no'}
- Observaciones: ${observaciones}`
}
