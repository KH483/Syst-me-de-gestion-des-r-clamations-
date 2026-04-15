export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface Statistiques {
  reclamationsParStatut: { [key: string]: number };
  tauxSatisfaction: number;
  totalReclamations: number;
  reclamationsAvecNote: number;
}
