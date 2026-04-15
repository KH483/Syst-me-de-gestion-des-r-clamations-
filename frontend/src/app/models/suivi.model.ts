export interface SuiviReclamation {
  id?: number;
  message: string;
  reclamationId: number;
  employeId?: number;
  employeNom?: string;
  action: string;
  date?: string;
}
