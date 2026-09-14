import { useMemo, useState } from 'react';
import { invitationUrl, type Invitation } from '../lib/invitation';
import type { LanguageMode } from '../types';
import { relationshipSuggestions } from '../lib/relationship';

const empty: Invitation = { version: 2, from: '', to: '', relationship: '', returnEmail: '', language: 'lt-en', sessionName: '' };

export function Share({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('');
  const url = useMemo(() => invitationUrl(form), [form]);
  const update = <K extends keyof Invitation>(key: K, value: Invitation[K]) => setForm(current => ({ ...current, [key]: value }));
  const valid = form.from.trim() && form.to.trim() && form.relationship.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.returnEmail);
  const copy = async () => {
    if (!valid) { setStatus('Įrašykite abu vardus, ryšį ir tinkamą grąžinimo el. paštą.'); return; }
    try { await navigator.clipboard.writeText(url); setStatus('Nuoroda nukopijuota.'); }
    catch { setStatus('Nepavyko nukopijuoti. Pažymėkite nuorodą žemiau.'); }
  };
  const share = async () => {
    if (!valid) { setStatus('Įrašykite abu vardus, ryšį ir tinkamą grąžinimo el. paštą.'); return; }
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title: 'BAARS-IV klausimynas', text: `${form.to}, prašau užpildyti ${form.from} vertinimą. Užpildytą PDF grąžinkite adresu ${form.returnEmail}.`, url }); }
    catch (error) { if ((error as DOMException).name !== 'AbortError') await copy(); }
  };
  return <main className="setup-shell"><section className="setup-card share-card">
    <button className="text-button" onClick={onClose}>← Grįžti</button>
    <div className="brand-mark">BAARS-IV</div>
    <h1>Sukurti kvietimo nuorodą</h1>
    <p className="lede">Sukurkite atskirą nuorodą kiekvienam žmogui. Atsakymai liks jo naršyklėje.</p>
    <div className="privacy-note"><strong>Vardai ir el. paštas bus nuorodoje.</strong><span>Duomenys yra po # ženklu. GitHub Pages jų negauna, tačiau nuorodą turintis žmogus gali juos perskaityti.</span></div>
    <div className="form-grid">
      <label>Nuo<span>From · name of person being rated</span><input value={form.from} onChange={e => update('from', e.target.value)} /></label>
      <label>Kam<span>To · respondent's full name</span><input value={form.to} onChange={e => update('to', e.target.value)} /></label>
      <label>Ryšys su vertinamu asmeniu<span>Relationship</span><input list="share-relationship-options" value={form.relationship} onChange={e => update('relationship', e.target.value)} placeholder="Pasirinkite arba įrašykite"/><datalist id="share-relationship-options">{relationshipSuggestions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</datalist></label>
      <label>Rodymo kalba<span>Display language</span><select value={form.language} onChange={e => update('language', e.target.value as LanguageMode)}><option value="lt-en">LT + EN</option><option value="lt">Tik lietuvių</option><option value="en">English only</option></select></label>
      <label>Grąžinti el. paštu<span>Return completed form to</span><input type="email" inputMode="email" autoComplete="email" value={form.returnEmail} onChange={e => update('returnEmail', e.target.value)} placeholder="results@example.test" /></label>
      <label>Sesijos pavadinimas <small>(nebūtina)</small><span>Optional session name</span><input value={form.sessionName} onChange={e => update('sessionName', e.target.value)} placeholder={`${form.to || 'Respondento'} atsakymai`} /></label>
    </div>
    <label className="share-url">Kvietimo nuoroda<input readOnly value={valid ? url : ''} onFocus={e => e.currentTarget.select()} placeholder="Užpildykite vardus" /></label>
    {status && <p className={status.includes('nukopijuota') ? 'success-message' : 'error'} role="status">{status}</p>}
    <div className="share-actions"><button className="primary" onClick={copy}>Kopijuoti nuorodą</button><button onClick={share}>Bendrinti…</button></div>
  </section></main>;
}
