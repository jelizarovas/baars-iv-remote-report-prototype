import { questions, questionnaireTitles, settingLabels } from '../data/questions';
import { completion, isQuestionComplete } from '../lib/questionnaire';
import { downloadBytes, safeFilename } from '../lib/download';
import type { Session, SettingsAnswer } from '../types';
import { useState } from 'react';
import { localized, questionText } from '../i18n';
import { useLanguage } from '../i18n/LanguageContext';

export function returnEmailUrl(session:Session):string {
 const email=session.respondent.returnEmail;if(!email)return '';
 const subject=`Completed BAARS-IV questionnaire for ${session.respondent.personName}`;
 const body=`Attached is the completed BAARS-IV questionnaire from ${session.respondent.respondentName}.\n\nPlease attach the downloaded PDF before sending.`;
 return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Review({session,onJump,onBack}:{session:Session;onJump:(id:string)=>void;onBack:()=>void}){
 const {language}=useLanguage(); const en=language==='en';
 const progress=completion(session);const unanswered=questions.filter(q=>!isQuestionComplete(q,session.answers[q.id],session.skipped));const high=questions.filter(q=>q.type==='frequency'&&Number(session.answers[q.id])>=3);const narratives=questions.filter(q=>q.type==='settings').flatMap(q=>{const a=session.answers[q.id] as SettingsAnswer|undefined;return (a?.selected||[]).map(s=>({q,s,...a?.narratives[s]}));}).filter(x=>x.lt||x.en);
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const generate=async()=>{setBusy(true);setError('');try{const {generateCompletedPdf}=await import('../pdf/generatePdf');const bytes=await generateCompletedPdf(session);downloadBytes(bytes,safeFilename(session,'pdf'),'application/pdf')}catch(e){setError(e instanceof Error?e.message:(en?'Could not create the PDF.':'Nepavyko sukurti PDF.'))}finally{setBusy(false)}};
 const title=(q:typeof questions[number])=>localized(questionnaireTitles[q.questionnaire].lt,questionnaireTitles[q.questionnaire].en,language).primary;
 return <main className="review material-page"><header><button onClick={onBack}>← {en?'Back':'Grįžti'}</button><div><strong>{en?'Review':'Peržiūra'}</strong></div><div className="review-percent">{progress.percent}%</div></header><div className="review-body">
  <section className="review-hero"><p>{en?`${progress.count} of 61 questions completed`:`Užbaigta ${progress.count} iš 61 klausimų`}</p><div className="progress-track"><i style={{width:`${progress.percent}%`}} /></div><dl><div><dt>{en?'Person being rated':'Vertinamas asmuo'}</dt><dd>{session.respondent.personName}</dd></div><div><dt>{en?'Respondent':'Respondentas'}</dt><dd>{session.respondent.respondentName} · {session.respondent.relationship}</dd></div><div><dt>{en?'Date':'Data'}</dt><dd>{session.respondent.date}</dd></div>{session.respondent.returnEmail&&<div><dt>{en?'Return by email':'Grąžinti el. paštu'}</dt><dd>{session.respondent.returnEmail}</dd></div>}</dl></section>
  <section><h2>{en?'Unanswered questions':'Neatsakyti klausimai'} <span>{unanswered.length}</span></h2>{unanswered.length===0?<p className="success">{en?'Every question is answered or marked not applicable.':'Visi klausimai atsakyti arba pažymėti kaip netaikomi.'}</p>:<div className="review-list">{unanswered.map(q=><button key={q.id} onClick={()=>onJump(q.id)}><span>{title(q)} · {q.number}</span>{questionText(q,language)}</button>)}</div>}</section>
  <section><h2>{en?'Rated 3 or 4':'Įvertinta 3 arba 4'} <span>{high.length}</span></h2><div className="review-list compact">{high.map(q=><button key={q.id} onClick={()=>onJump(q.id)}><strong>{q.number}. {questionText(q,language)}</strong><span>{session.answers[q.id] as number}</span></button>)}</div></section>
  <section><h2>{en?'Written responses':'Tekstiniai atsakymai'} <span>{narratives.length}</span></h2>{narratives.map((n,i)=>{const body=n[language];return body?<article className="narrative-card" key={`${n.q.id}-${n.s}-${i}`}><strong>{title(n.q)} · {n.q.number} · {localized(settingLabels[n.s].lt,settingLabels[n.s].en,language).primary}</strong><p>{body}</p></article>:null})}</section>
  <div className="pdf-notice"><strong>{en?'The PDF does not provide clinical conclusions.':'PDF nepateikia klinikinių išvadų.'}</strong><span>{en?'Office Use Only fields, scores, and diagnoses remain blank.':'„Office Use Only“ laukai, balai ir diagnozės lieka tušti.'}</span></div>{error&&<p className="error">{error}</p>}<button className="generate" disabled={busy} onClick={generate}>{busy?(en?'Creating PDF…':'Kuriamas PDF…'):(en?'Generate completed PDF':'Generuoti užpildytą PDF')}</button>{session.respondent.returnEmail&&<a className="email-return" href={returnEmailUrl(session)}>{en?'Email':'Rašyti el. laišką'} {session.respondent.returnEmail}<small>{en?'Download the PDF and attach it to your email.':'Atsisiųskite PDF ir pridėkite jį prie laiško.'}</small></a>}
 </div></main>;
}
