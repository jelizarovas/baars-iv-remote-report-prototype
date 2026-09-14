import { type FormEvent, type ReactNode, useState } from 'react';
import { normalizedHash, sha256Hex } from '../lib/access';

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
  const configuredHash = normalizedHash(expectedHash);
  const [allowed, setAllowed] = useState(() => development && !configuredHash || sessionStorage.getItem(storageKey) === configuredHash);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  if (allowed) return children;

  if (!configuredHash) return <main className="gate-shell"><section className="gate-card">
    <div className="brand-mark">BAARS-IV</div>
    <h1>Peržiūros prieiga nesukonfigūruota</h1>
    <p>This review build is locked because no access hash was supplied.</p>
  </section></main>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await sha256Hex(value) !== configuredHash) {
      setMessage('Neteisingas PIN arba slaptažodis. / Incorrect PIN or password.');
      return;
    }
    sessionStorage.setItem(storageKey, configuredHash);
    setAllowed(true);
  };

  return <main className="gate-shell"><section className="gate-card">
    <div className="brand-mark">BAARS-IV</div>
    <p className="gate-kicker">Ribota projekto peržiūra / Limited project review</p>
    <h1>Įveskite peržiūros kodą</h1>
    <p>Ši demonstracinė versija skirta leidimo peržiūrai. / This demonstration is available for permission review.</p>
    <form onSubmit={submit}>
      <label>PIN arba slaptažodis<span>PIN or password</span><input autoFocus type="password" autoComplete="current-password" value={value} onChange={event => setValue(event.target.value)} /></label>
      {message && <p className="error" role="alert">{message}</p>}
      <button className="primary" type="submit">Atidaryti peržiūrą / Open review</button>
    </form>
  </section></main>;
}
