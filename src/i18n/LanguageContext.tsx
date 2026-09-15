import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { LanguageMode } from '../types';
import { invitationFromHash } from '../lib/invitation';

const storageKey = 'baars-iv:display-language';
const themeStorageKey = 'baars-iv:theme';
const LanguageContext = createContext<{ language: LanguageMode; setLanguage: (language: LanguageMode) => void }>({ language: 'en', setLanguage: () => {} });
type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: 'light', setTheme: () => {} });

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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    localStorage.setItem(themeStorageKey, theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>;
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

function ThemePicker() {
  const { language } = useLanguage();
  const { theme, setTheme } = useContext(ThemeContext);
  const label = language === 'en' ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : `Įjungti ${theme === 'light' ? 'tamsią' : 'šviesią'} temą`;
  return <button className="theme-toggle" type="button" aria-label={label} aria-pressed={theme==='dark'} onClick={()=>setTheme(theme==='light'?'dark':'light')}>
    <span className="theme-toggle-thumb">
      <svg className="sun-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg className="moon-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z"/></svg>
    </span>
  </button>;
}

export function DisplayControls() {
  return <div className="display-controls"><LanguagePicker/><ThemePicker/></div>;
}
