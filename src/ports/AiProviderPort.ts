import type { AiConfig, AiPriorityResponse, AiTriageResponse, Patient, TriageAssessment } from '../domain/types'

export interface AiProviderPort {
  generate(assessment: TriageAssessment, patient: Patient, config: AiConfig): Promise<AiTriageResponse>
  generatePriority(assessment: TriageAssessment, patient: Patient, config: AiConfig): Promise<AiPriorityResponse>
}
