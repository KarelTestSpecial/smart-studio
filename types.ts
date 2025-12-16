export type LeadStatus = 'NEW' | 'CONTACTED' | 'WON';

export type ProblemType = 'no_website' | 'old_website' | 'error' | 'other';

export interface Lead {
  id: string;
  companyName: string;
  email: string;
  problemType: ProblemType;
  problemDescription?: string;
  dateAdded: string;
  status: LeadStatus;
  gdprConfirmed: boolean;
}

export interface UserProfile {
  name: string;
}

export interface AppState {
  leads: Lead[];
  userProfile: UserProfile;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface SmartRule {
  step: number;
  title: string;
  description: string;
  critical: boolean;
}

export const PROBLEM_LABELS: Record<ProblemType, string> = {
  no_website: 'Geen Website',
  old_website: 'Verouderde Website',
  error: 'Technische Fout',
  other: 'Anders',
};
