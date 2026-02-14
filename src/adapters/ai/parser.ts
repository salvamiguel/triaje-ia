import { aiPrioritySchema, aiTriageSchema } from './schema'
import type { AiPriorityResponse, AiTriageResponse } from '../../domain/types'

const normalizeClinicalQuestion = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  let core = trimmed.replace(/^[¿?]+/, '').replace(/[?]+$/, '').trim()
  core = core.replace(/[.!;,:\s]+$/, '').trim()
  if (!core) return ''

  return `¿${core}?`
}

const extractFirstJsonObject = (text: string) => {
  const start = text.indexOf('{')
  if (start === -1) return ''

  let depth = 0
  let inString = false
  let escaped = false

  for (let index = start; index < text.length; index += 1) {
    const char = text[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === '{') {
      depth += 1
      continue
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return text.slice(start, index + 1)
      }
    }
  }

  return ''
}

const extractJson = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1]
  return extractFirstJsonObject(text)
}

export const parseAiResponse = (text: string): AiTriageResponse => {
  const jsonText = extractJson(text)
  if (!jsonText) {
    const preview = text.replace(/\s+/g, ' ').slice(0, 180)
    throw new Error(`No se encontró JSON en la respuesta. Muestra recibida: "${preview || 'vacía'}"`)
  }
  const parsed = JSON.parse(jsonText)
  const json = aiTriageSchema.parse(parsed)
  json.preguntas_clave = json.preguntas_clave.map(normalizeClinicalQuestion).filter(Boolean)
  return { json, rawText: text }
}

export const parseAiPriorityResponse = (text: string): AiPriorityResponse => {
  const jsonText = extractJson(text)
  if (!jsonText) {
    const preview = text.replace(/\s+/g, ' ').slice(0, 180)
    throw new Error(`No se encontró JSON en la respuesta. Muestra recibida: "${preview || 'vacía'}"`)
  }

  const parsed = JSON.parse(jsonText) as Record<string, unknown>
  const nested = parsed?.json && typeof parsed.json === 'object' ? (parsed.json as Record<string, unknown>) : undefined
  const rawPriority =
    parsed.prioridad_sugerida ??
    parsed.prioridad ??
    parsed.priority ??
    nested?.prioridad_sugerida ??
    nested?.prioridad ??
    nested?.priority

  const rawReason =
    parsed.motivo_prioridad ??
    parsed.motivo ??
    parsed.justificacion ??
    parsed.reason ??
    nested?.motivo_prioridad ??
    nested?.motivo ??
    nested?.justificacion ??
    nested?.reason

  const normalizedPriority =
    typeof rawPriority === 'string'
      ? Number.parseInt(rawPriority.replace(/[^\d]/g, ''), 10)
      : rawPriority

  const normalizedReason =
    typeof rawReason === 'string' && rawReason.trim()
      ? rawReason.trim()
      : 'Prioridad sugerida por IA según datos disponibles.'

  const json = aiPrioritySchema.parse({
    prioridad_sugerida: normalizedPriority,
    motivo_prioridad: normalizedReason,
  })
  return {
    prioridad_sugerida: json.prioridad_sugerida as 1 | 2 | 3 | 4 | 5,
    motivo_prioridad: json.motivo_prioridad.trim(),
    rawText: text,
  }
}
