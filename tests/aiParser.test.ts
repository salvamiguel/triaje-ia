import { describe, expect, it } from 'vitest'
import { parseAiPriorityResponse, parseAiResponse } from '../src/adapters/ai/parser'

const validJson = {
  resumen_clinico: 'Resumen',
  sospecha_clinica: ['Proceso respiratorio agudo'],
  prioridad_sugerida: 3,
  motivo_prioridad: 'Constantes alteradas con disnea.',
  red_flags_presentes: ['Dificultad respiratoria'],
  red_flags_ausentes: ['Shock'],
  actuaciones_enfermeras: ['Monitorización'],
  actuaciones_priorizadas: ['0-5 min: monitorización'],
  objetivos_monitorizacion: ['SatO2 > 95%'],
  criterios_escalada: ['Deterioro respiratorio'],
  preguntas_clave: ['Inicio del cuadro'],
  datos_faltantes: [],
  evolutivo_triaje: 'Evolutivo de prueba',
}

describe('ai parser', () => {
  it('parsea JSON seguido de texto libre', () => {
    const raw = `${JSON.stringify(validJson)}\n\nEVOLUTIVO\nTexto libre de salida`
    const parsed = parseAiResponse(raw)
    expect(parsed.json.prioridad_sugerida).toBe(3)
    expect(parsed.json.motivo_prioridad).toContain('Constantes')
    expect(parsed.json.preguntas_clave[0]).toBe('¿Inicio del cuadro?')
  })

  it('parsea JSON cuando el texto posterior contiene llaves', () => {
    const raw = `${JSON.stringify(validJson)}\n\nEVOLUTIVO\nPaciente con nota {contexto adicional}`
    const parsed = parseAiResponse(raw)
    expect(parsed.json.sospecha_clinica[0]).toContain('respiratorio')
  })

  it('parsea respuesta rápida de prioridad', () => {
    const raw = '{"prioridad_sugerida":2,"motivo_prioridad":"Signos de compromiso hemodinámico inicial."}'
    const parsed = parseAiPriorityResponse(raw)
    expect(parsed.prioridad_sugerida).toBe(2)
    expect(parsed.motivo_prioridad).toContain('hemodinámico')
  })

  it('parsea prioridad en bloque markdown json', () => {
    const raw = '```json\n{"prioridad_sugerida":4,"motivo_prioridad":"Sin signos de alarma mayores."}\n```'
    const parsed = parseAiPriorityResponse(raw)
    expect(parsed.prioridad_sugerida).toBe(4)
  })

  it('parsea prioridad con aliases y formato string', () => {
    const raw = '{"priority":"P2","reason":"Compromiso respiratorio inicial."}'
    const parsed = parseAiPriorityResponse(raw)
    expect(parsed.prioridad_sugerida).toBe(2)
    expect(parsed.motivo_prioridad).toContain('respiratorio')
  })
})
