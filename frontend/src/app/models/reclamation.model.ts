export type StatutReclamation = 'EN_ATTENTE' | 'EN_COURS' | 'TRAITEE';

export interface Reclamation {
  id?: number;
  clientId: number;
  clientNom?: string;
  agentId?: number;
  agentNom?: string;
  produit: string;
  statut?: StatutReclamation;
  description: string;
  date?: string;
  note?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
