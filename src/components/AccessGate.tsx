import { type FormEvent, type ReactNode, useState } from 'react';
import { normalizedHash, sha256Hex } from '../lib/access';
import { useLanguage } from '../i18n/LanguageContext';
import { IsometricIllustration, NeuralBackground } from './IsometricIllustration';

const storageKey = 'baars-iv:review-access';

export function AccessGate({
  children,
  expectedHash = import.meta.env.VITE_REVIEW_PIN_HASH ?? '',
  development = import.meta.env.DEV,
}: {
  children: ReactNode;
  expectedHash?: string;
  development?: boolean;
}) {
  const { language } = useLanguage();
  const copy = language === 'en' ? {
    unavailable: 'Review access is not configured', unavailableBody: 'This review build is locked because no access hash was supplied.',
    error: 'Incorrect PIN or password.', kicker: 'Limited project review', title: 'Enter the review code',
    description: 'This demonstration is available for permission review.', password: 'PIN or password', open: 'Open review',
  } : {
    unavailable: 'Peržiūros prieiga nesukonfigūruota', unavailableBody: 'Ši peržiūros versija užrakinta, nes nepateikta prieigos maiša.',
    error: 'Neteisingas PIN arba slaptažodis.', kicker: 'Ribota projekto peržiūra', title: 'Įveskite peržiūros kodą',
    description: 'Ši demonstracinė versija skirta leidimo peržiūrai.', password: 'PIN arba slaptažodis', open: 'Atidaryti peržiūrą',
  };
  const configuredHash = normalizedHash(expectedHash);
  const [allowed, setAllowed] = useState(() => development && !configuredHash || sessionStorage.getItem(storageKey) === configuredHash);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const changeAccess = (update: () => void) => update();

  if (allowed) return <><button className="review-lock" type="button" onClick={()=>changeAccess(()=>{sessionStorage.removeItem(storageKey);setAllowed(false);setValue('')})} aria-label={language==='en'?'Lock review and return to password':'Užrakinti peržiūrą ir grįžti prie slaptažodžio'}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>{language==='en'?'Lock review':'Užrakinti'}</span></button><div className="page-stage">{children}</div></>;

  if (!configuredHash) return <main className="gate-shell"><NeuralBackground/><section className="gate-stage"><div className="gate-card">
    <div className="brand-mark">BAARS-IV</div><h1>{copy.unavailable}</h1><p>{copy.unavailableBody}</p>
  </div><aside className="gate-art"><IsometricIllustration variant="gate"/></aside></section></main>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await sha256Hex(value) !== configuredHash) {
      setMessage(copy.error);
      return;
    }
    changeAccess(()=>{sessionStorage.setItem(storageKey, configuredHash);setAllowed(true)});
  };

  return <main className="gate-shell"><NeuralBackground/><section className="gate-stage"><div className="gate-card">
    <div className="brand-mark">BAARS-IV</div><p className="gate-kicker">{copy.kicker}</p><h1>{copy.title}</h1><p>{copy.description}</p>
    <form onSubmit={submit}><label>{copy.password}<input autoFocus type="password" autoComplete="current-password" value={value} onChange={event => setValue(event.target.value)} /></label>{message && <p className="error" role="alert">{message}</p>}<button className="primary" type="submit">{copy.open}</button></form>
  </div><aside className="gate-art"><IsometricIllustration variant="gate"/></aside></section></main>;
}
