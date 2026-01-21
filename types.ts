export interface SolutionStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface AIResponseSchema {
  subject: string;
  topic: string;
  difficulty: string;
  languageUsed: string; // e.g., "Hindi-English Mix"
  solutionSteps: SolutionStep[];
  simpleExplanation: string;
  importantFormulas: string[];
  commonMistakes: string[];
  summary: string;
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64
  name: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  attachment?: Attachment;
  structuredResponse?: AIResponseSchema;
  timestamp: number;
  isError?: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum StudyMode {
  SOLVE = 'SOLVE',
  ELI5 = 'ELI5',
  NOTES = 'NOTES',
  EXAM = 'EXAM',
  MCQ = 'MCQ'
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface HistoryItem {
  id: string;
  query: string;
  summary: string; // From AI response
  timestamp: any; // Firestore timestamp
  subject: string;
  data: AIResponseSchema; // Full response
}