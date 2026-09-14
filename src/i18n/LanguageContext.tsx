import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { LanguageMode } from '../types';
import { invitationFromHash } from '../lib/invitation';

const storageKey = 'baars-iv:display-language';
const LanguageContext = createContext<{ language: LanguageMode; setLanguage: (language: LanguageMode) => void }>({ language: 'en', setLanguage: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageMode>(() => {
    const invited = invitationFromHash()?.language;
    if (invited) return invited;
    return localStorage.getItem(storageKey) === 'lt' ? 'lt' : 'en';
  });

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
    document.title = language === 'en' ? 'BAARS-IV questionnaire' : 'BAARS-IV klausimynas';
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  return <label className="language-picker">
    <span className="sr-only">{language === 'en' ? 'Language' : 'Kalba'}</span>
    <select aria-label={language === 'en' ? 'Language' : 'Kalba'} value={language} onChange={event => setLanguage(event.target.value as LanguageMode)}>
      <option value="en">🇺🇸 English</option>
      <option value="lt">🇱🇹 Lietuvių</option>
    </select>
  </label>;
}
