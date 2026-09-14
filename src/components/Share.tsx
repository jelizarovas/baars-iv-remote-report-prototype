import { useMemo, useState } from 'react';
import { invitationUrl, type Invitation } from '../lib/invitation';
import type { LanguageMode } from '../types';
import { relationshipSuggestions } from '../lib/relationship';
import { useLanguage } from '../i18n/LanguageContext';
import { IsometricIllustration } from './IsometricIllustration';

type IconName = 'person' | 'mail' | 'group' | 'heart' | 'language' | 'share';

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    person: <><circle cx="12" cy="8" r="3.2"/><path d="M5.8 19c.5-4 2.6-6 6.2-6s5.7 2 6.2 6"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4.5 7 7.5 6 7.5-6"/></>,
    group: <><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.5-3.7 2.3-5.5 5.5-5.5s5 1.8 5.5 5.5M15 15c3.2-.3 5 1 5.5 4"/></>,
    heart: <path d="M12 20S4 15.4 4 9.4C4 6 8.2 4.6 12 8.3 15.8 4.6 20 6 20 9.4 20 15.4 12 20 12 20Z"/>,
    language: <><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3C9.5 5.5 8.2 8.5 8.2 12S9.5 18.5 12 21"/></>,
    share: <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/></>,
  };
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function Share({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const en = language === 'en';
  const copy = en ? {
    back:'Back', eyebrow:'Remote report', title:'Invite someone you trust', lede:'Set up their questionnaire. The link carries the details for them.',
    yourName:'Your name', email:'Your email', invitee:'Who are you inviting?', relationship:'Their relationship to you', choose:'Choose relationship', other:'Other', otherLabel:'Type the relationship', recipientLanguage:'Questionnaire language',
    action:'Copy or share invitation', missing:'Complete each field and enter a valid email.', copied:'Invitation link copied.', shareTitle:'Questionnaire invitation',
  } : {
    back:'Grįžti', eyebrow:'Nuotolinis vertinimas', title:'Pakvieskite žmogų, kuriuo pasitikite', lede:'Paruoškite jam klausimyną. Visa reikalinga informacija bus nuorodoje.',
    yourName:'Jūsų vardas', email:'Jūsų el. paštas', invitee:'Ką kviečiate?', relationship:'Koks jo ryšys su jumis?', choose:'Pasirinkite ryšį', other:'Kita', otherLabel:'Įrašykite ryšį', recipientLanguage:'Klausimyno kalba',
    action:'Kopijuoti arba bendrinti kvietimą', missing:'Užpildykite visus laukus ir įrašykite tinkamą el. paštą.', copied:'Kvietimo nuoroda nukopijuota.', shareTitle:'Kvietimas užpildyti klausimyną',
  };
  const [form, setForm] = useState<Invitation>({ version: 2, from: '', to: '', relationship: '', returnEmail: '', language });
  const [relationshipKind, setRelationshipKind] = useState('');
  const [status, setStatus] = useState('');
  const url = useMemo(() => invitationUrl(form), [form]);
  const update = <K extends keyof Invitation>(key: K, value: Invitation[K]) => { setStatus(''); setForm(current => ({ ...current, [key]: value })); };
  const valid = form.from.trim() && form.to.trim() && form.relationship.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.returnEmail);
  const copyLink = async () => { await navigator.clipboard.writeText(url); setStatus(copy.copied); };
  const act = async () => {
    if (!valid) { setStatus(copy.missing); return; }
    const text = form.language === 'en' ? `${form.to}, please complete this questionnaire about ${form.from}. Return the PDF to ${form.returnEmail}.` : `${form.to}, prašome užpildyti klausimyną apie ${form.from}. Užpildytą PDF grąžinkite adresu ${form.returnEmail}.`;
    if (navigator.share) { try { await navigator.share({ title: copy.shareTitle, text, url }); return; } catch (error) { if ((error as DOMException).name === 'AbortError') return; } }
    try { await copyLink(); } catch { setStatus(en?'Select and copy the generated link.':'Pažymėkite ir nukopijuokite sugeneruotą nuorodą.'); }
  };
  const chooseRelationship = (value: string) => { setRelationshipKind(value); update('relationship', value === '__other' ? '' : value); };

  return <main className="share-experience">
    <div className="ambient-shapes" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <section className="share-panel">
      <aside className="share-visual">
        <div className="share-brand"><button className="text-button" onClick={onClose}>← {copy.back}</button><span className="brand-mark">BAARS-IV</span></div>
        <div><p className="share-eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.lede}</p></div>
        <IsometricIllustration/>
      </aside>
      <form className="share-compact-form" onSubmit={event=>{event.preventDefault();void act();}} noValidate>
        <div className="field-row">
          <label className="outlined-field"><Icon name="person"/><input aria-label={copy.yourName} placeholder=" " value={form.from} onChange={e=>update('from',e.target.value)}/><span>{copy.yourName}</span></label>
          <label className="outlined-field"><Icon name="mail"/><input aria-label={copy.email} placeholder=" " type="email" inputMode="email" autoComplete="email" value={form.returnEmail} onChange={e=>update('returnEmail',e.target.value)}/><span>{copy.email}</span></label>
        </div>
        <label className="outlined-field"><Icon name="group"/><input aria-label={copy.invitee} placeholder=" " value={form.to} onChange={e=>update('to',e.target.value)}/><span>{copy.invitee}</span></label>
        <div className="field-row relationship-row">
          <label className="outlined-field"><Icon name="heart"/><select aria-label={copy.relationship} value={relationshipKind} onChange={e=>chooseRelationship(e.target.value)}><option value="" disabled>{copy.choose}</option>{relationshipSuggestions.map(option=><option key={option.value} value={option.value}>{option[language]}</option>)}<option value="__other">{copy.other}</option></select><span>{copy.relationship}</span></label>
          <label className="outlined-field"><Icon name="language"/><select aria-label={copy.recipientLanguage} value={form.language} onChange={e=>update('language',e.target.value as LanguageMode)}><option value="en">English</option><option value="lt">Lietuvių</option></select><span>{copy.recipientLanguage}</span></label>
        </div>
        {relationshipKind==='__other'&&<label className="outlined-field custom-relationship"><Icon name="heart"/><input autoFocus aria-label={copy.otherLabel} placeholder=" " value={form.relationship} onChange={e=>update('relationship',e.target.value)}/><span>{copy.otherLabel}</span></label>}
        <p className={`share-feedback ${status===copy.copied?'success':''}`} aria-live="polite">{status}</p>
        <button className="share-cta" type="submit"><span className="cta-icon"><Icon name="share"/></span><strong>{copy.action}</strong><span className="cta-arrow">→</span></button>
      </form>
    </section>
  </main>;
}
