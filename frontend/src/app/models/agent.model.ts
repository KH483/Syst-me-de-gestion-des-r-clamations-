export interface AgentSAV {
  id?: number;
  nom: string;
  competence?: string;
}

export interface AgentStatistiques {
  totalAssignees: number;
  traitees: number;
  enCours: number;
  enAttente: number;
  moyenneNote: number | null;
}
