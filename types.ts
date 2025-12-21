
export interface PhenotypeRule {
  id: string;
  label: string;
  title: string;
  keyIdea: string;
  rules: string[];
  flowchart: string;
}

export interface Stratum {
  id: string;
  name: string;
  description: string;
  phenotypes: PhenotypeRule[];
}

export interface CIndexResult {
  stratum: string;
  model: string;
  meanCIndex: number;
  deltaC: number;
}
