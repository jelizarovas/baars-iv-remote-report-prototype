import { useMemo, useState } from 'react';
import type { Respondent, Session } from '../types';
import { listSessions, loadSession, makeSession } from '../lib/storage';
import { relationshipSuggestions } from '../lib/relationship';
import { useLanguage } from '../i18n/LanguageContext';

const today = () => new Date().toLocaleDateString('en-CA');

export function Setup({onStart,initial,onOpenShare,onBack}:{onStart:(s:Session)=>void;initial?:Respondent;onOpenShare:()=>void;onBack:()=>void}) {
 const { language } = useLanguage();
 const copy = language === 'en' ? {
  about:'About', invite:'Create invitation', title:'Start questionnaire', lede:'Enter the details that will be added to the completed PDF.', invited:'This invitation is for you',
  asked:(name:string,person:string)=>`${name}, you have been asked to rate ${person}.`, person:'Name of person being rated', respondent:'Your full name', relationship:'Relationship to the person',
  relationshipPlaceholder:'Choose or type', date:'Date', returnTo:'Return completed form to', session:'Session name', optional:'optional', sessionPlaceholder:'For example, first response',
  missing:'Enter both names.', start:'Start', resume:'Continue saved questionnaire', restart:'Start over', restartConfirm:'Are you sure you want to start over?', saved:'Saved sessions',
 } : {
  about:'Apie', invite:'Sukurti kvietimą', title:'Pradėti klausimyną', lede:'Įrašykite duomenis, kurie bus perkelti į užpildytą PDF.', invited:'Kvietimas skirtas jums',
  asked:(name:string,person:string)=>`${name}, prašoma įvertinti: ${person}.`, person:'Vertinamo asmens vardas', respondent:'Jūsų vardas ir pavardė', relationship:'Ryšys su vertinamu asmeniu',
  relationshipPlaceholder:'Pasirinkite arba įrašykite', date:'Data', returnTo:'Užpildytą formą grąžinti', session:'Sesijos pavadinimas', optional:'nebūtina', sessionPlaceholder:'Pavyzdžiui, pirmas pildymas',
  missing:'Įrašykite abu vardus.', start:'Pradėti', resume:'Tęsti išsaugotą pildymą', restart:'Pradėti iš naujo', restartConfirm:'Ar tikrai norite pradėti iš naujo?', saved:'Išsaugotos sesijos',
 };
 const [form,setForm]=useState<Respondent>(initial??{personName:'',respondentName:'',relationship:'',date:today(),sessionName:'',language});
 const [error,setError]=useState(''); const saved=useMemo(()=>listSessions(),[]);
 const currentForm = form.language === language ? form : {...form, language};
 const update=<K extends keyof Respondent>(key:K,value:Respondent[K])=>setForm(f=>({...f,[key]:value}));
 const valid=()=>{if(!currentForm.personName.trim()||!currentForm.respondentName.trim()){setError(copy.missing);return false}return true};
 const start=(fresh:boolean)=>{if(!valid())return; const existing=loadSession(currentForm); onStart(!fresh&&existing?existing:makeSession(currentForm));};
 return <main className="setup-shell material-page"><div className="mobile-route-toolbar"><button className="text-button" onClick={onBack}>← {copy.about}</button><div className="brand-mark">BAARS-IV</div></div><section className="setup-card">
  <div className="setup-heading desktop-route-toolbar"><button className="text-button" onClick={onBack}>← {copy.about}</button><div className="brand-mark">BAARS-IV</div><button className="text-button" onClick={onOpenShare}>{copy.invite}</button></div><h1>{copy.title}</h1><p className="lede">{copy.lede}</p>
  {initial&&<div className="invite-banner"><strong>{copy.invited}</strong><span>{copy.asked(currentForm.respondentName,currentForm.personName)}</span></div>}
  <div className="form-grid">
   <label>{copy.person}<input value={currentForm.personName} onChange={e=>update('personName',e.target.value)} autoComplete="off" /></label>
   <label>{copy.respondent}<input value={currentForm.respondentName} onChange={e=>update('respondentName',e.target.value)} autoComplete="name" /></label>
   <label>{copy.relationship}<input list="relationship-options" value={currentForm.relationship} onChange={e=>update('relationship',e.target.value)} placeholder={copy.relationshipPlaceholder}/><datalist id="relationship-options">{relationshipSuggestions.map(option=><option key={option.value} value={option.value}>{option[language]}</option>)}</datalist></label>
   <label>{copy.date}<input type="date" value={currentForm.date} onChange={e=>update('date',e.target.value)} /></label>
   {initial?.returnEmail&&<label>{copy.returnTo}<input type="email" value={currentForm.returnEmail??''} onChange={e=>update('returnEmail',e.target.value)} /></label>}
   <label>{copy.session} <small>({copy.optional})</small><input placeholder={copy.sessionPlaceholder} value={currentForm.sessionName} onChange={e=>update('sessionName',e.target.value)} /></label>
  </div>{error&&<p className="error" role="alert">{error}</p>}
  <div className="setup-actions"><button className="primary" onClick={()=>start(true)}>{copy.start}</button><button onClick={()=>start(false)}>{copy.resume}</button><button onClick={()=>{if(valid()&&confirm(copy.restartConfirm))start(true)}}>{copy.restart}</button></div>
  {!initial&&saved.length>0&&<div className="saved"><h2>{copy.saved}</h2>{saved.map(s=><button key={`${s.respondent.respondentName}-${s.respondent.relationship}-${s.lastUpdated}`} onClick={()=>onStart(s)}><strong>{s.respondent.sessionName||s.respondent.respondentName}</strong><span>{s.respondent.relationship} · {s.respondent.personName} · {new Date(s.lastUpdated).toLocaleString(language==='en'?'en-US':'lt-LT')}</span></button>)}</div>}
 </section></main>
}
