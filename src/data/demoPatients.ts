import type { Patient } from '../domain/types'

type DemoSeed = {
  demographics: Patient['demographics']
  clinical: Patient['clinical']
}

const basePatient = (partial: Partial<Patient>): Patient => {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'en_espera',
    demographics: {
      nombre: '',
      apellidos: '',
      sexo: '',
      edad: 30,
      pesoKg: undefined,
    },
    clinical: {
      antecedentes: '',
      alergias: '',
      medicacion: '',
      embarazo: 'desconocido',
      semanasEmbarazo: undefined,
      vacunacion: '',
      riesgosSociales: '',
    },
    assessment: undefined,
    result: undefined,
    followUps: [],
    ...partial,
  }
}

const seedToPatient = (seed: DemoSeed, index: number): Patient => {
  const createdAt = new Date(Date.now() - (index + 1) * 11 * 60_000).toISOString()
  return basePatient({
    createdAt,
    updatedAt: createdAt,
    demographics: seed.demographics,
    clinical: seed.clinical,
  })
}

const demoSeeds: DemoSeed[] = [
  {
    demographics: { nombre: 'Carlos', apellidos: 'Molina', sexo: 'M', edad: 58, pesoKg: 82 },
    clinical: {
      antecedentes: 'HTA, dislipemia y tabaquismo activo',
      alergias: 'Penicilina (rash cutáneo)',
      medicacion: 'Ramipril 5 mg/24h, atorvastatina 20 mg/24h',
      embarazo: 'no',
      vacunacion: 'Gripe 2025 y COVID pauta completa',
      riesgosSociales: 'Alta carga laboral y estrés mantenido',
    },
  },
  {
    demographics: { nombre: 'Lucía', apellidos: 'García', sexo: 'F', edad: 3, pesoKg: 14 },
    clinical: {
      antecedentes: 'Sin antecedentes relevantes',
      alergias: 'Amoxicilina',
      medicacion: 'Ibuprofeno ocasional',
      embarazo: 'no',
      vacunacion: 'Calendario vacunal completo',
      riesgosSociales: 'Acude con madre, buen soporte familiar',
    },
  },
  {
    demographics: { nombre: 'Manuel', apellidos: 'Ruiz', sexo: 'M', edad: 72, pesoKg: 76 },
    clinical: {
      antecedentes: 'DM2, FA paroxística',
      alergias: 'No presenta',
      medicacion: 'Metformina, apixabán',
      embarazo: 'no',
      vacunacion: 'Gripe anual al día',
      riesgosSociales: 'Vive solo, apoyo vecinal puntual',
    },
  },
  {
    demographics: { nombre: 'Ana', apellidos: 'López', sexo: 'F', edad: 29, pesoKg: 60 },
    clinical: {
      antecedentes: 'Gestación de 20 semanas sin incidencias previas',
      alergias: 'Látex',
      medicacion: 'Suplemento prenatal',
      embarazo: 'si',
      semanasEmbarazo: 20,
      vacunacion: 'Vacuna antigripal administrada',
      riesgosSociales: 'Sin riesgos sociales identificados',
    },
  },
  {
    demographics: { nombre: 'Jorge', apellidos: 'Vidal', sexo: 'M', edad: 67, pesoKg: 84 },
    clinical: {
      antecedentes: 'EPOC grave y cardiopatía isquémica previa',
      alergias: 'Metamizol (hipotensión)',
      medicacion: 'Broncodilatador inhalado, AAS',
      embarazo: 'no',
      vacunacion: 'Gripe y neumococo actualizadas',
      riesgosSociales: 'Dependencia parcial para ABVD',
    },
  },
  {
    demographics: { nombre: 'Elena', apellidos: 'Santos', sexo: 'F', edad: 24, pesoKg: 55 },
    clinical: {
      antecedentes: 'Sin antecedentes de interés',
      alergias: 'No presenta',
      medicacion: 'Ninguna habitual',
      embarazo: 'no',
      vacunacion: 'Calendario vacunal completo',
      riesgosSociales: 'Estudiante universitaria',
    },
  },
  {
    demographics: { nombre: 'Pedro', apellidos: 'Ortega', sexo: 'M', edad: 41, pesoKg: 89 },
    clinical: {
      antecedentes: 'Faringitis de repetición',
      alergias: 'Claritromicina (urticaria)',
      medicacion: 'Paracetamol a demanda',
      embarazo: 'no',
      vacunacion: 'Vacuna tétanos al día',
      riesgosSociales: 'Trabajador por turnos',
    },
  },
  {
    demographics: { nombre: 'Nuria', apellidos: 'Pérez', sexo: 'F', edad: 32, pesoKg: 63 },
    clinical: {
      antecedentes: 'Infecciones urinarias recurrentes',
      alergias: 'Ciprofloxacino (náuseas intensas)',
      medicacion: 'Ninguna habitual',
      embarazo: 'no',
      vacunacion: 'Gripe 2025',
      riesgosSociales: 'Cuidadora principal de familiar dependiente',
    },
  },
  {
    demographics: { nombre: 'David', apellidos: 'Navarro', sexo: 'M', edad: 27, pesoKg: 73 },
    clinical: {
      antecedentes: 'Sin antecedentes relevantes',
      alergias: 'No presenta',
      medicacion: 'Ninguna',
      embarazo: 'no',
      vacunacion: 'Tétanos actualizado',
      riesgosSociales: 'Deportista aficionado',
    },
  },
  {
    demographics: { nombre: 'Marta', apellidos: 'Iglesias', sexo: 'F', edad: 15, pesoKg: 52 },
    clinical: {
      antecedentes: 'Dermatitis atópica',
      alergias: 'Ibuprofeno (angioedema previo leve)',
      medicacion: 'Antihistamínico oral puntual',
      embarazo: 'no',
      vacunacion: 'Calendario vacunal completo',
      riesgosSociales: 'Acompañada por madre, buen apoyo',
    },
  },
  {
    demographics: { nombre: 'Sergio', apellidos: 'Herrera', sexo: 'M', edad: 52, pesoKg: 80 },
    clinical: {
      antecedentes: 'TCE previo y epilepsia en seguimiento',
      alergias: 'No presenta',
      medicacion: 'Levetiracetam',
      embarazo: 'no',
      vacunacion: 'ND',
      riesgosSociales: 'Sin acompañante al ingreso',
    },
  },
  {
    demographics: { nombre: 'Irene', apellidos: 'Campos', sexo: 'F', edad: 46, pesoKg: 68 },
    clinical: {
      antecedentes: 'Cólico renal previo',
      alergias: 'Tramadol (náuseas severas)',
      medicacion: 'Ninguna habitual',
      embarazo: 'no',
      vacunacion: 'Gripe 2024',
      riesgosSociales: 'Sin riesgos sociales detectados',
    },
  },
]

export const buildDemoPatients = (): Patient[] => demoSeeds.map(seedToPatient)

export const demoPatients: Patient[] = buildDemoPatients()
