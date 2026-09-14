import type { LanguageMode, Question } from '../types';
import lt from './locales/lt.json';
import en from './locales/en.json';

export type UiKey = keyof typeof lt;

const ui = { lt, en } as const;

export function primaryLanguage(mode: LanguageMode): 'lt' | 'en' { return mode === 'en' ? 'en' : 'lt'; }
export function t(mode: LanguageMode, key: UiKey): string { return ui[primaryLanguage(mode)][key]; }
export function questionText(question: Question, mode: LanguageMode): string {
  const locale = primaryLanguage(mode);
  return question.translations?.[locale] ?? question[locale];
}
export function localized(lt: string, en: string, mode: LanguageMode): { primary: string; secondary?: string } {
  return { primary: mode === 'en' ? en : lt };
}
