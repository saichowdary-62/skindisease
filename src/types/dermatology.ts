export type SeverityLevel = 'Low' | 'Moderate' | 'Urgent' | 'Emergency';

export interface AbcdeCriterion {
  status: string;
  details: string;
}

export interface AbcdeMelanomaCheck {
  applicable: boolean;
  asymmetry: AbcdeCriterion;
  border: AbcdeCriterion;
  color: AbcdeCriterion;
  diameter: AbcdeCriterion;
  evolving: AbcdeCriterion;
  overallRisk: 'Low' | 'Moderate' | 'High';
}

export interface VisualAssessment {
  morphology: string;
  color: string;
  distribution: string;
  texture: string;
}

export interface DifferentialDiagnosis {
  name: string;
  confidence: number;
  distinguishingFeature: string;
}

export interface PrimaryDiagnosis {
  name: string;
  scientificName: string;
  category: 'Inflammatory' | 'Infectious (Fungal/Bacterial/Viral)' | 'Neoplastic / Pre-malignant' | 'Allergic / Contact' | 'Benign Lesion' | 'Pigmentary';
  confidence: number;
  severity: SeverityLevel;
  summary: string;
}

export interface ClinicalDetails {
  overview: string;
  hallmarkSymptoms: string[];
  rootCauses: string[];
  triggers: string[];
  preventiveMeasures: string[];
  homeCareAndNonRx: string[];
  whenToSeeDoctor: string[];
  recommendedSpecialist: string;
  potentialClinicalTreatments: string[];
}

export interface AnalysisResponse {
  isSkinLesion?: boolean;
  analysisSource?: 'local-ham10000-research';
  modelNotes?: string;
  rejectionReason?: string;
  detectedSubject?: string;
  guidance?: string;
  primaryDiagnosis?: PrimaryDiagnosis;
  visualAssessment?: VisualAssessment;
  abcdeMelanomaCheck?: AbcdeMelanomaCheck;
  differentialDiagnoses?: DifferentialDiagnosis[];
  clinicalDetails?: ClinicalDetails;
  questionsForDoctor?: string[];
  disclaimer?: string;
}

export interface ClinicalNotes {
  bodyLocation: string;
  duration: string;
  symptoms: string[];
  itchLevel: string;
  evolution: string;
  notes?: string;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  imageUrl: string;
  clinicalNotes: ClinicalNotes;
  result: AnalysisResponse;
  patientTag?: string;
}

export interface SampleCase {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  description: string;
  imageUrl: string;
  notes: ClinicalNotes;
}

export interface DiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  severity: SeverityLevel;
  summary: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  imagePlaceholderColor: string;
  treatmentOverview: string;
  contagious: boolean;
}
