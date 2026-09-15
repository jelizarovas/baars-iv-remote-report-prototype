import { useMemo, useState } from 'react';
import { invitationUrl, type Invitation } from '../lib/invitation';
import type { LanguageMode } from '../types';
import { relationshipSuggestions } from '../lib/relationship';
import { useLanguage } from '../i18n/LanguageContext';
import { IsometricIllustration, NeuralBackground } from './IsometricIllustration';

type IconName = 'person' | 'mail' | 'group' | 'heart' | 'language' | 'copy';

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    person: <><circle cx="12" cy="8" r="3.2"/><path d="M5.8 19c.5-4 2.6-6 6.2-6s5.7 2 6.2 6"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4.5 7 7.5 6 7.5-6"/></>,
    group: <><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.5-3.7 2.3-5.5 5.5-5.5s5 1.8 5.5 5.5M15 15c3.2-.3 5 1 5.5 4"/></>,
    heart: <path d="M12 20S4 15.4 4 9.4C4 6 8.2 4.6 12 8.3 15.8 4.6 20 6 20 9.4 20 15.4 12 20 12 20Z"/>,
    language: <><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3C9.5 5.5 8.2 8.5 8.2 12S9.5 18.5 12 21"/></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  };
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function Share({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const en = language === 'en';
  const copy = en ? {
    back:'Back', title:'Invite someone you trust', lede:'Set up their questionnaire. The link carries the details for them.',
    yourName:'Your name', email:'Your email', invitee:'Who are you inviting?', relationship:'Their relationship to you', choose:'Relationship (optional)', other:'Other', otherLabel:'Type the relationship', recipientLanguage:'Questionnaire language',
    link:'Invitation link', action:'Copy', missing:'Enter both names and a valid email.', copied:'Invitation link copied.',
  } : {
    back:'Grįžti', title:'Pakvieskite žmogų, kuriuo pasitikite', lede:'Paruoškite jam klausimyną. Visa reikalinga informacija bus nuorodoje.',
    yourName:'Jūsų vardas', email:'Jūsų el. paštas', invitee:'Ką kviečiate?', relationship:'Koks jo ryšys su jumis?', choose:'Ryšys (nebūtina)', other:'Kita', otherLabel:'Įrašykite ryšį', recipientLanguage:'Klausimyno kalba',
    link:'Kvietimo nuoroda', action:'Kopijuoti', missing:'Įrašykite abu vardus ir tinkamą el. paštą.', copied:'Kvietimo nuoroda nukopijuota.',
  };
  const [form, setForm] = useState<Invitation>({ version: 2, from: '', to: '', relationship: '', returnEmail: '', language });
  const [relationshipKind, setRelationshipKind] = useState('');
  const [status, setStatus] = useState('');
  const url = useMemo(() => invitationUrl(form), [form]);
  const update = <K extends keyof Invitation>(key: K, value: Invitation[K]) => { setStatus(''); setForm(current => ({ ...current, [key]: value })); };
  const valid = form.from.trim() && form.to.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.returnEmail);
  const copyLink = async () => {
    if (!valid) { setStatus(copy.missing); return; }
    try { await navigator.clipboard.writeText(url); setStatus(copy.copied); } catch { setStatus(en?'Select and copy the link manually.':'Pažymėkite ir nukopijuokite nuorodą rankiniu būdu.'); }
  };
  const chooseRelationship = (value: string) => { setRelationshipKind(value); update('relationship', value === '__other' ? '' : value); };

  return <main className="share-experience">
    <NeuralBackground/>
    <section className="share-panel">
      <aside className="share-visual">
        <div className="share-brand"><button className="text-button" onClick={onClose}>← {copy.back}</button><span className="brand-mark">BAARS-IV</span></div>
        <div><h1>{copy.title}</h1><p>{copy.lede}</p></div>
        <IsometricIllustration/>
      </aside>
      <form className="share-compact-form" onSubmit={event=>{event.preventDefault();void copyLink();}} noValidate>
        <div className="field-row">
          <label className="outlined-field"><Icon name="person"/><input aria-label={copy.yourName} placeholder=" " value={form.from} onChange={e=>update('from',e.target.value)}/><span>{copy.yourName}</span></label>
          <label className="outlined-field"><Icon name="mail"/><input aria-label={copy.email} placeholder=" " type="email" inputMode="email" autoComplete="email" value={form.returnEmail} onChange={e=>update('returnEmail',e.target.value)}/><span>{copy.email}</span></label>
        </div>
        <label className="outlined-field"><Icon name="group"/><input aria-label={copy.invitee} placeholder=" " value={form.to} onChange={e=>update('to',e.target.value)}/><span>{copy.invitee}</span></label>
        <div className="field-row relationship-row">
          <label className="outlined-field select-only"><Icon name="heart"/><select aria-label={copy.relationship} value={relationshipKind} onChange={e=>chooseRelationship(e.target.value)}><option value="">{copy.choose}</option>{relationshipSuggestions.map(option=><option key={option.value} value={option.value}>{option[language]}</option>)}<option value="__other">{copy.other}</option></select></label>
          <label className="outlined-field select-only"><Icon name="language"/><select aria-label={copy.recipientLanguage} value={form.language} onChange={e=>update('language',e.target.value as LanguageMode)}><option value="en">🇺🇸 English</option><option value="lt">🇱🇹 Lietuvių</option></select></label>
        </div>
        {relationshipKind==='__other'&&<label className="outlined-field custom-relationship"><Icon name="heart"/><input autoFocus aria-label={copy.otherLabel} placeholder=" " value={form.relationship} onChange={e=>update('relationship',e.target.value)}/><span>{copy.otherLabel}</span></label>}
        <label className="link-output"><span>{copy.link}</span><input aria-label={copy.link} readOnly value={valid?url:''} placeholder={valid?'':copy.missing} onFocus={event=>event.currentTarget.select()}/><button type="submit" aria-label={copy.action}><Icon name="copy"/><strong>{copy.action}</strong></button></label>
        <p className={`share-feedback ${status===copy.copied?'success':''}`} aria-live="polite">{status}</p>
      </form>
    </section>
  </main>;
}
