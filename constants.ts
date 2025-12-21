
import { Stratum, CIndexResult } from './types';

export const C_INDEX_RESULTS: CIndexResult[] = [
  { stratum: 'Low', model: 'Base clinical model', meanCIndex: 0.721, deltaC: 0.0 },
  { stratum: 'Low', model: 'Base + MMSP phenotypes', meanCIndex: 0.733, deltaC: 0.012 },
  { stratum: 'Low', model: 'Base + SNF-lite phenotypes', meanCIndex: 0.746, deltaC: 0.025 },
  { stratum: 'Mid', model: 'Base clinical model', meanCIndex: 0.684, deltaC: 0.0 },
  { stratum: 'Mid', model: 'Base + MMSP phenotypes', meanCIndex: 0.699, deltaC: 0.015 },
  { stratum: 'Mid', model: 'Base + SNF-lite phenotypes', meanCIndex: 0.715, deltaC: 0.031 },
  { stratum: 'High', model: 'Base clinical model', meanCIndex: 0.652, deltaC: 0.0 },
  { stratum: 'High', model: 'Base + MMSP phenotypes', meanCIndex: 0.674, deltaC: 0.022 },
  { stratum: 'High', model: 'Base + SNF-lite phenotypes', meanCIndex: 0.694, deltaC: 0.042 },
];

export const MAX_DELTA_C = 0.042;

/**
 * EDIT GUIDE: FIXTURE CONTENT
 * To modify demo phenotypes, update the STRATA_DATA array below.
 * Each phenotype must have 2-3 rules with >= 4 logical nodes.
 */
export const STRATA_DATA: Stratum[] = [
  {
    id: 'low',
    name: 'Low Multimorbidity',
    description: '0-1 Pre-existing chronic conditions',
    phenotypes: [
      {
        id: 'L0',
        label: 'Phenotype L0',
        title: 'Acute Oncology Crisis',
        keyIdea: 'Acute physiological deterioration in patients with limited baseline disease, primarily malignancy-driven.',
        rules: [
          'IF (comorbidity_count <= 1) AND (cancer == TRUE) AND (aps > 45) AND (creatinine > 1.8) THEN L0',
          'IF (dzgroup_cancer == TRUE) AND (meanbp < 65) AND (pafi < 200) AND (urine_output < 0.5) THEN L0'
        ],
        flowchart: '[Cancer?]\n |-- Yes --> [APS > 45?]\n |            |-- Yes --> [Creatinine > 1.8?]\n |            |            |-- Yes --> [L0]\n |            |            |-- No  --> [Other]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      },
      {
        id: 'L1',
        label: 'Phenotype L1',
        title: 'Post-Op Respiratory/Neurologic',
        keyIdea: 'Low comorbidity baseline with acute neurological or respiratory failure post-intervention.',
        rules: [
          'IF (comorbidity_count <= 1) AND (neuro_coma == TRUE) AND (ventilation == TRUE) AND (age < 65) THEN L1',
          'IF (dzgroup_neuro == TRUE) AND (pafi < 150) AND (hr > 120) AND (aps > 30) THEN L1'
        ],
        flowchart: '[Coma?]\n |-- Yes --> [Ventilated?]\n |            |-- Yes --> [Age < 65?]\n |            |            |-- Yes --> [L1]\n |            |            |-- No  --> [Other]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      },
      {
        id: 'L2',
        label: 'Phenotype L2',
        title: 'Early Sepsis / Low Burden',
        keyIdea: 'Younger patients with single-organ acute failure and low background chronic illness.',
        rules: [
          'IF (comorbidity_count <= 1) AND (aps > 25) AND (temp > 38.5) AND (wbc > 15) THEN L2',
          'IF (dzgroup_sepsis == TRUE) AND (lactate > 2.0) AND (age < 50) AND (multi_organ_failure == FALSE) THEN L2'
        ],
        flowchart: '[Temp > 38.5?]\n |-- Yes --> [WBC > 15?]\n |            |-- Yes --> [APS > 25?]\n |            |            |-- Yes --> [L2]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      }
    ]
  },
  {
    id: 'mid',
    name: 'Mid Multimorbidity',
    description: '2-3 Pre-existing chronic conditions',
    phenotypes: [
      {
        id: 'M0',
        label: 'Phenotype M0',
        title: 'Cardiometabolic Syndrome',
        keyIdea: 'Moderate morbidity focused on hypertension and diabetes with stable acute renal markers.',
        rules: [
          'IF (comorbidity_count BETWEEN 2 AND 3) AND (hypertension == TRUE) AND (diabetes == TRUE) AND (bmi > 30) THEN M0',
          'IF (dzgroup_chf == TRUE) AND (creatinine < 1.2) AND (glucose > 180) AND (age > 60) THEN M0'
        ],
        flowchart: '[Hypertension?]\n |-- Yes --> [Diabetes?]\n |            |-- Yes --> [BMI > 30?]\n |            |            |-- Yes --> [M0]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      },
      {
        id: 'M1',
        label: 'Phenotype M1',
        title: 'COPD/Renal Interactions',
        keyIdea: 'Patients with obstructive lung disease background showing acute azotemia.',
        rules: [
          'IF (dzgroup_copd == TRUE) AND (creatinine > 2.0) AND (paco2 > 45) AND (ph < 7.35) THEN M1',
          'IF (comorbidity_count == 3) AND (renal_failure == TRUE) AND (ventilation == TRUE) AND (age > 70) THEN M1'
        ],
        flowchart: '[COPD?]\n |-- Yes --> [Creat > 2.0?]\n |            |-- Yes --> [PaCO2 > 45?]\n |            |            |-- Yes --> [M1]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      },
      {
        id: 'M2',
        label: 'Phenotype M2',
        title: 'Vascular / Mild Comorbidity',
        keyIdea: 'Patients with atherosclerosis background and acute peripheral or central vascular issues.',
        rules: [
          'IF (dzgroup_vascular == TRUE) AND (age > 65) AND (smoking_history == TRUE) AND (meanbp < 80) THEN M2',
          'IF (comorbidity_count == 2) AND (cvd == TRUE) AND (aps > 15) AND (creatinine < 1.5) THEN M2'
        ],
        flowchart: '[Vascular?]\n |-- Yes --> [Age > 65?]\n |            |-- Yes --> [CVD?]\n |            |            |-- Yes --> [M2]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      }
    ]
  },
  {
    id: 'high',
    name: 'High Multimorbidity',
    description: '4+ Pre-existing chronic conditions',
    phenotypes: [
      {
        id: 'H0',
        label: 'Phenotype H0',
        title: 'Complex Multi-System Frailty',
        keyIdea: 'High burden of chronic disease with stable acute markers; typically palliative or high-care-need.',
        rules: [
          'IF (comorbidity_count >= 5) AND (aps < 30) AND (albumin < 2.5) AND (adl_impairment == TRUE) THEN H0',
          'IF (dzgroup_cirrhosis == TRUE) AND (cancer == TRUE) AND (age > 75) AND (platelets < 100) THEN H0'
        ],
        flowchart: '[Count >= 5?]\n |-- Yes --> [APS < 30?]\n |            |-- Yes --> [Albumin < 2.5?]\n |            |            |-- Yes --> [H0]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      },
      {
        id: 'H1',
        label: 'Phenotype H1',
        title: 'Severe Diabetic Organ Failure',
        keyIdea: 'Extensive chronic illness with severe acute renal and hemodynamic instability.',
        rules: [
          'IF (comorbidity_count >= 4) AND (diabetes == TRUE) AND (creatinine > 3.0) AND (meanbp < 60) THEN H1',
          'IF (dzgroup_diabetes == TRUE) AND (renal_failure == TRUE) AND (ph < 7.2) AND (aps > 50) THEN H1'
        ],
        flowchart: '[Count >= 4?]\n |-- Yes --> [Diabetes?]\n |            |-- Yes --> [Creat > 3.0?]\n |            |            |-- Yes --> [H1]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      },
      {
        id: 'H2',
        label: 'Phenotype H2',
        title: 'Chronic Pulmonary Exacerbation',
        keyIdea: 'End-stage COPD or CHF with acute respiratory failure and high multimorbidity baseline.',
        rules: [
          'IF (comorbidity_count >= 4) AND (dzgroup_copd == TRUE) AND (ventilation == TRUE) AND (pafi < 100) THEN H2',
          'IF (dzgroup_chf == TRUE) AND (edema == TRUE) AND (paco2 > 50) AND (age > 80) THEN H2'
        ],
        flowchart: '[Count >= 4?]\n |-- Yes --> [COPD?]\n |            |-- Yes --> [Ventilated?]\n |            |            |-- Yes --> [H2]\n |            |-- No  --> [Other]\n |-- No  --> [Other]'
      }
    ]
  }
];
