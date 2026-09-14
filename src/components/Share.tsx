import { useMemo, useState } from 'react';
import { invitationUrl, type Invitation } from '../lib/invitation';
import type { LanguageMode } from '../types';
import { relationshipSuggestions } from '../lib/relationship';
import { useLanguage } from '../i18n/LanguageContext';

export function Share({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const copy = language === 'en' ? {
    back:'Back', title:'Create an invitation link', lede:'Create a separate link for each person. Their answers will stay in their browser.', privacy:'Names and the email address will be included in the link.',
    privacyBody:'The details are stored after the # symbol. GitHub Pages does not receive them, but anyone with the link can read them.', from:'From', fromHint:'name of person being rated', to:'To', toHint:"respondent's full name",
    relationship:'Relationship', choose:'Choose or type', recipientLanguage:'Recipient language', returnEmail:'Return completed form to', session:'Session name', optional:'optional', responses:(name:string)=>`${name||"Respondent"}'s responses`,
    link:'Invitation link', fill:'Complete the required fields', copy:'Copy link', share:'Share…', missing:'Enter both names, a relationship, and a valid return email address.', copied:'Link copied.', copyFailed:'Could not copy the link. Select it below.',
  } : {
    back:'Grįžti', title:'Sukurti kvietimo nuorodą', lede:'Sukurkite atskirą nuorodą kiekvienam žmogui. Atsakymai liks jo naršyklėje.', privacy:'Vardai ir el. paštas bus nuorodoje.',
    privacyBody:'Duomenys yra po # ženklu. GitHub Pages jų negauna, tačiau nuorodą turintis žmogus gali juos perskaityti.', from:'Nuo', fromHint:'vertinamo asmens vardas', to:'Kam', toHint:'respondento vardas ir pavardė',
    relationship:'Ryšys', choose:'Pasirinkite arba įrašykite', recipientLanguage:'Gavėjo kalba', returnEmail:'Užpildytą formą grąžinti', session:'Sesijos pavadinimas', optional:'nebūtina', responses:(name:string)=>`${name||'Respondento'} atsakymai`,
    link:'Kvietimo nuoroda', fill:'Užpildykite privalomus laukus', copy:'Kopijuoti nuorodą', share:'Bendrinti…', missing:'Įrašykite abu vardus, ryšį ir tinkamą grąžinimo el. paštą.', copied:'Nuoroda nukopijuota.', copyFailed:'Nepavyko nukopijuoti. Pažymėkite nuorodą žemiau.',
  };
  const [form, setForm] = useState<Invitation>({ version: 2, from: '', to: '', relationship: '', returnEmail: '', language, sessionName: '' });
  const [status, setStatus] = useState('');
  const url = useMemo(() => invitationUrl(form), [form]);
  const update = <K extends keyof Invitation>(key: K, value: Invitation[K]) => setForm(current => ({ ...current, [key]: value }));
  const valid = form.from.trim() && form.to.trim() && form.relationship.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.returnEmail);
  const copyLink = async () => { if (!valid) { setStatus(copy.missing); return; } try { await navigator.clipboard.writeText(url); setStatus(copy.copied); } catch { setStatus(copy.copyFailed); } };
  const share = async () => {
    if (!valid) { setStatus(copy.missing); return; }
    if (!navigator.share) { await copyLink(); return; }
    const text = form.language === 'en' ? `${form.to}, please complete this questionnaire about ${form.from}. Return the completed PDF to ${form.returnEmail}.` : `${form.to}, prašome užpildyti klausimyną apie ${form.from}. Užpildytą PDF grąžinkite adresu ${form.returnEmail}.`;
    try { await navigator.share({ title: 'BAARS-IV questionnaire', text, url }); } catch (error) { if ((error as DOMException).name !== 'AbortError') await copyLink(); }
  };
  return <main className="setup-shell"><section className="setup-card share-card">
    <button className="text-button" onClick={onClose}>← {copy.back}</button><div className="brand-mark">BAARS-IV</div><h1>{copy.title}</h1><p className="lede">{copy.lede}</p>
    <div className="privacy-note"><strong>{copy.privacy}</strong><span>{copy.privacyBody}</span></div>
    <div className="form-grid">
      <label>{copy.from}<span>{copy.fromHint}</span><input value={form.from} onChange={e => update('from', e.target.value)} /></label>
      <label>{copy.to}<span>{copy.toHint}</span><input value={form.to} onChange={e => update('to', e.target.value)} /></label>
      <label>{copy.relationship}<input list="share-relationship-options" value={form.relationship} onChange={e => update('relationship', e.target.value)} placeholder={copy.choose}/><datalist id="share-relationship-options">{relationshipSuggestions.map(option=><option key={option.value} value={option.value}>{option[language]}</option>)}</datalist></label>
      <label>{copy.recipientLanguage}<select value={form.language} onChange={e => update('language', e.target.value as LanguageMode)}><option value="en">🇺🇸 English</option><option value="lt">🇱🇹 Lietuvių</option></select></label>
      <label>{copy.returnEmail}<input type="email" inputMode="email" autoComplete="email" value={form.returnEmail} onChange={e => update('returnEmail', e.target.value)} placeholder="results@example.test" /></label>
      <label>{copy.session} <small>({copy.optional})</small><input value={form.sessionName} onChange={e => update('sessionName', e.target.value)} placeholder={copy.responses(form.to)} /></label>
    </div>
    <label className="share-url">{copy.link}<input readOnly value={valid ? url : ''} onFocus={e => e.currentTarget.select()} placeholder={copy.fill} /></label>
    {status && <p className={status===copy.copied ? 'success-message' : 'error'} role="status">{status}</p>}
    <div className="share-actions"><button className="primary" onClick={copyLink}>{copy.copy}</button><button onClick={share}>{copy.share}</button></div>
  </section></main>;
}
