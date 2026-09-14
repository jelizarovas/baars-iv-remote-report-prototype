export type Relationship = string;
export type LanguageMode = 'lt' | 'en';
export type QuestionnaireId = 'current' | 'childhood' | 'sct';
export type Setting = 'school' | 'home' | 'work' | 'social';
export type QuestionType = 'frequency' | 'yesno' | 'age' | 'settings';

export interface Question {
  id: string; questionnaire: QuestionnaireId; number: number; section: string; sectionLt: string;
  type: QuestionType; en: string; lt: string; timeframe?: { lt: string; en: string };
  warning?: { lt: string; en: string }; settings?: Setting[];
  /** Extra languages can be added without changing question components. */
  translations?: Record<string, string>;
}
export interface SettingsAnswer { selected: Setting[]; narratives: Partial<Record<Setting, { lt: string; en: string }>> }
export type Answer = number | boolean | { age: string; unknown: boolean } | SettingsAnswer;
export interface Respondent {
  personName: string; respondentName: string; relationship: Relationship; date: string; sessionName: string;
  language?: LanguageMode;
  returnEmail?: string;
}
export interface Session {
  version: 1; respondent: Respondent; answers: Record<string, Answer>; skipped: string[];
  currentQuestionId: string; completed: boolean; lastUpdated: string;
}
