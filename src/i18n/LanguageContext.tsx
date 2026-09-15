import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const label = language === 'en' ? 'Language' : 'Kalba';
  const options: { value: LanguageMode; name: string }[] = [{ value: 'en', name: 'English' }, { value: 'lt', name: 'Lietuvių' }];
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (!pickerRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeWithEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', closeOutside); document.addEventListener('keydown', closeWithEscape);
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeWithEscape); };
  }, []);
  return <div className={`language-picker ${open?'open':''}`} ref={pickerRef}>
    <button className="language-trigger" type="button" aria-label={label} aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(value=>!value)}><span className={`language-flag flag-${language}`} aria-hidden="true"/><strong>{options.find(option=>option.value===language)?.name}</strong><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg></button>
    {open&&<div className="language-menu" role="listbox" aria-label={label}>{options.map(option=><button key={option.value} type="button" role="option" aria-selected={language===option.value} onClick={()=>{setLanguage(option.value);setOpen(false)}}><span className={`language-flag flag-${option.value}`} aria-hidden="true"/><span>{option.name}</span>{language===option.value&&<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3 3 7-7"/></svg>}</button>)}</div>}
  </div>;
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
