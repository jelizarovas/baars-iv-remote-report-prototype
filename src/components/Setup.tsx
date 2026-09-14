import { useMemo, useState } from 'react';
import type { Respondent, Session } from '../types';
import { listSessions, loadSession, makeSession } from '../lib/storage';
import { relationshipSuggestions } from '../lib/relationship';

const today=()=>new Date().toLocaleDateString('en-CA');
export function Setup({onStart,initial,onOpenShare,onBack}:{onStart:(s:Session)=>void;initial?:Respondent;onOpenShare:()=>void;onBack:()=>void}) {
 const [form,setForm]=useState<Respondent>(initial??{personName:'',respondentName:'',relationship:'',date:today(),sessionName:'',language:'lt-en'});
 const [error,setError]=useState(''); const saved=useMemo(()=>listSessions(),[]);
 const update=<K extends keyof Respondent>(key:K,value:Respondent[K])=>setForm(f=>({...f,[key]:value}));
 const valid=()=>{if(!form.personName.trim()||!form.respondentName.trim()||!form.relationship.trim()){setError('Įrašykite abu vardus ir ryšį su vertinamu asmeniu.');return false}return true};
 const start=(fresh:boolean)=>{if(!valid())return; const existing=loadSession(form); onStart(!fresh&&existing?existing:makeSession(form));};
 return <main className="setup-shell"><section className="setup-card">
  <div className="setup-heading"><button className="text-button" onClick={onBack}>← Apie</button><div className="brand-mark">BAARS-IV</div><button className="text-button" onClick={onOpenShare}>Sukurti kvietimą</button></div><h1>Pradėti klausimyną</h1><p className="lede">Įrašykite duomenis, kurie bus perkelti į užpildytą PDF.</p>
  {initial&&<div className="invite-banner"><strong>Kvietimas skirtas jums</strong><span>{initial.respondentName}, prašoma įvertinti: {initial.personName}.</span></div>}
  <div className="form-grid">
   <label>Vertinamo asmens vardas<span>Name of person being rated</span><input value={form.personName} onChange={e=>update('personName',e.target.value)} autoComplete="off" /></label>
   <label>Jūsų vardas ir pavardė<span>Your full name</span><input value={form.respondentName} onChange={e=>update('respondentName',e.target.value)} autoComplete="name" /></label>
   <label>Ryšys su vertinamu asmeniu<span>Relationship to the person</span><input list="relationship-options" value={form.relationship} onChange={e=>update('relationship',e.target.value)} placeholder="Pasirinkite arba įrašykite"/><datalist id="relationship-options">{relationshipSuggestions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</datalist></label>
   <label>Data<span>Date</span><input type="date" value={form.date} onChange={e=>update('date',e.target.value)} /></label>
   <label>Rodymo kalba<span>Display language</span><select value={form.language??'lt-en'} onChange={e=>update('language',e.target.value as Respondent['language'])}><option value="lt-en">LT + EN</option><option value="lt">Tik lietuvių</option><option value="en">English only</option></select></label>
   {initial?.returnEmail&&<label>Užpildytą formą grąžinti<span>Return completed form to</span><input type="email" value={form.returnEmail??''} onChange={e=>update('returnEmail',e.target.value)} /></label>}
   <label>Sesijos pavadinimas <small>(nebūtina)</small><span>Optional session name</span><input placeholder="Pavyzdžiui, pirmas pildymas" value={form.sessionName} onChange={e=>update('sessionName',e.target.value)} /></label>
  </div>{error&&<p className="error" role="alert">{error}</p>}
  <div className="setup-actions"><button className="primary" onClick={()=>start(true)}>Pradėti</button><button onClick={()=>start(false)}>Tęsti išsaugotą pildymą</button><button onClick={()=>{if(valid()&&confirm('Ar tikrai norite pradėti iš naujo?'))start(true)}}>Pradėti iš naujo</button></div>
  {!initial&&saved.length>0&&<div className="saved"><h2>Išsaugotos sesijos</h2>{saved.map(s=><button key={`${s.respondent.respondentName}-${s.respondent.relationship}-${s.lastUpdated}`} onClick={()=>onStart(s)}><strong>{s.respondent.sessionName||s.respondent.respondentName}</strong><span>{s.respondent.relationship} · {s.respondent.personName} · {new Date(s.lastUpdated).toLocaleString('lt-LT')}</span></button>)}</div>}
 </section></main>
}
