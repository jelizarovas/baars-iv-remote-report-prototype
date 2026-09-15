import { useEffect, useMemo, useRef, useState } from 'react';
import { Setup } from './components/Setup';
import { QuestionControl } from './components/QuestionControl';
import { Drawer } from './components/Drawer';
import { Review } from './components/Review';
import { Calibration } from './components/Calibration';
import { Share } from './components/Share';
import { Welcome } from './components/Welcome';
import { AppLayout } from './components/AppLayout';
import { questions, questionnaireTitles } from './data/questions';
import { clearSession, saveSession } from './lib/storage';
import { completion, isQuestionComplete, isTypingTarget, nextQuestionId, suggestedGateAnswer, withBranching } from './lib/questionnaire';
import type { Answer, Session } from './types';
import { downloadBytes, safeFilename } from './lib/download';
import { invitationFromPath, respondentFromInvitation } from './lib/invitation';
import { localized, questionText, t } from './i18n';
import { useLanguage } from './i18n/LanguageContext';

type View = 'welcome'|'setup'|'share'|'questions'|'review';

const routePath: Record<View,string> = {welcome:'/',setup:'/start',share:'/invite',questions:'/questionnaire',review:'/review'};
const viewFromPath=(pathname:string):View=>invitationFromPath(pathname)?'setup':pathname.endsWith('/invite')?'share':pathname.endsWith('/start')?'setup':pathname.endsWith('/questionnaire')?'questions':pathname.endsWith('/review')?'review':'welcome';
type RouteState={baarsRoute?:View;from?:View};

export default function App({routePath:activePath,navigateRoute}:{routePath?:string;navigateRoute?:(to:string,replace:boolean)=>void}={}){
 const {language,setLanguage}=useLanguage();
 const pathname=activePath??location.pathname;
 const calibration=import.meta.env.DEV&&import.meta.env.VITE_ENABLE_PDF_CALIBRATION==='true'&&pathname.endsWith('/calibrate');
 const invitation=useMemo(()=>invitationFromPath(pathname),[pathname]);
 const [session,setSession]=useState<Session|null>(null);const [view,setView]=useState<View>(()=>viewFromPath(pathname));const [drawer,setDrawer]=useState(false);const [invalid,setInvalid]=useState(false);const [message,setMessage]=useState('');const [saveState,setSaveState]=useState<'saved'|'saving'>('saved');const saveTimer=useRef<number|undefined>(undefined);
 const navigate=(next:View,url=routePath[next],replace=false)=>{if(navigateRoute)navigateRoute(url,replace);else{const state:RouteState={baarsRoute:next,from:view};history[replace?'replaceState':'pushState'](state,'',url)}setView(next);setDrawer(false);setInvalid(false);window.scrollTo(0,0)};
 const backTo=(fallback:View)=>navigate(fallback,routePath[fallback],true);
 useEffect(()=>{const syncRoute=()=>{setView(viewFromPath(activePath??location.pathname));setDrawer(false);setInvalid(false);window.scrollTo(0,0)};syncRoute();if(activePath)return;window.addEventListener('popstate',syncRoute);return()=>window.removeEventListener('popstate',syncRoute)},[activePath]);
 useEffect(()=>{setSession(current=>current&&current.respondent.language!==language?{...current,respondent:{...current.respondent,language}}:current)},[language]);
 useEffect(()=>{if(!session)return;setSaveState('saving');window.clearTimeout(saveTimer.current);saveTimer.current=window.setTimeout(()=>{saveSession({...session,lastUpdated:new Date().toISOString()});setSaveState('saved')},180);return()=>window.clearTimeout(saveTimer.current)},[session]);
 const q=questions.find(x=>x.id===session?.currentQuestionId)??questions[0];const answer=session?.answers[q.id];const progress=session?completion(session):{count:0,percent:0};const position=questions.findIndex(x=>x.id===q.id)+1;
 const setAnswer=(value:Answer)=>{if(!session)return;let next={...session,answers:{...session.answers,[q.id]:value},lastUpdated:new Date().toISOString()};next=withBranching(next,q.id);setSession(next);setInvalid(false);setMessage('')};
 const jump=(id:string)=>{if(!session)return;setSession({...session,currentQuestionId:id});if(view==='questions'){setDrawer(false);setInvalid(false);window.scrollTo(0,0)}else navigate('questions')};
 const go=(direction:1|-1)=>{if(!session)return;if(direction===1&&!isQuestionComplete(q,answer,session.skipped)){setInvalid(true);setMessage(t(language,'chooseAnswer'));return}const next=nextQuestionId(session,q.id,direction);if(direction===1&&next===q.id){navigate('review');return}jump(next)};
 useEffect(()=>{if(!session||view!=='questions')return;const handler=(e:KeyboardEvent)=>{if(drawer&&e.key==='Escape'){setDrawer(false);return}if(isTypingTarget(e.target))return;if(q.type==='frequency'&&['1','2','3','4'].includes(e.key)){e.preventDefault();setAnswer(Number(e.key));return}if(e.key==='Enter'||e.key==='ArrowRight'||e.key===' '){e.preventDefault();go(e.shiftKey&&e.key===' '?-1:1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[session,view,drawer,q.id,answer]);
 const exportJson=()=>{if(!session)return;downloadBytes(new TextEncoder().encode(JSON.stringify(session,null,2)),safeFilename(session,'json'),'application/json')};
 const importJson=async(file:File)=>{try{const data=JSON.parse(await file.text()) as Session;if(data.version!==1||!data.respondent||!data.answers)throw new Error();setSession(data);setLanguage(data.respondent.language??language);setDrawer(false)}catch{alert(language==='en'?'Import failed: invalid BAARS-IV JSON file.':'Nepavyko importuoti: netinkamas BAARS-IV JSON failas.')}};
 if(calibration)return <Calibration/>;
 let content;
 if(view==='share')content=<Share onClose={()=>backTo('welcome')}/>;
 else if(!session&&view==='welcome')content=<Welcome onStart={()=>navigate('setup')} onInvite={()=>navigate('share')}/>;
 else if(!session)content=<Setup initial={invitation?respondentFromInvitation(invitation):undefined} onStart={value=>{setLanguage(value.respondent.language??language);setSession(value);navigate('questions')}} onBack={()=>backTo('welcome')} onOpenShare={()=>navigate('share')}/>;
 else if(view==='review')content=<Review session={session} onJump={jump} onBack={()=>backTo('questions')}/>;
 if(content)return <AppLayout route={view}>{content}</AppLayout>;
 if(!session)return null;
 const suggestion=q.type==='yesno'&&answer===undefined?suggestedGateAnswer(q.id,session.answers):undefined;
 const title=localized(questionnaireTitles[q.questionnaire].lt,questionnaireTitles[q.questionnaire].en,language);const section=localized(q.sectionLt,q.section,language);const timeframe=q.timeframe?localized(q.timeframe.lt,q.timeframe.en,language):undefined;
 return <AppLayout route={view}><div className="app-shell material-page"><header className="topbar"><div className="top-row"><button className="menu" aria-label={t(language,'menu')} onClick={()=>setDrawer(true)}>☰</button><div className="title"><strong>{title.primary}</strong>{title.secondary&&<span>{title.secondary}</span>}</div><div className="progress-number"><strong>{progress.percent}%</strong><span>{progress.count} {t(language,'of')} 61</span></div></div><div className="progress-track"><i style={{width:`${progress.percent}%`}} /></div><div className="save-state" aria-live="polite">{saveState==='saved'?`✓ ${t(language,'saved')}`:t(language,'saving')}</div></header>
 <main className="question-area"><article className="question-card"><div className="eyebrow"><span>{section.primary}</span><b>{t(language,'question')} {q.number}<small>{position} / 61</small></b></div>{timeframe&&<div className="timeframe">◷ <span>{timeframe.primary}</span></div>}<h1>{questionText(q,language)}</h1>{suggestion!==undefined&&<button className="suggestion" onClick={()=>setAnswer(suggestion)}>{t(language,'suggestion')}: <strong>{suggestion?t(language,'yes'):t(language,'no')}</strong><span>{t(language,'confirmSuggestion')}</span></button>}<QuestionControl question={q} answer={answer} onChange={setAnswer} invalid={invalid} language={language}/>{message&&<p className="blocked" role="alert">{message}</p>}</article></main>
 <nav className="bottom-nav" aria-label={language==='en'?'Questionnaire navigation':'Klausimyno navigacija'}><button onClick={()=>go(-1)} disabled={position===1}>← <span>{t(language,'back')}</span></button>{q.type==='frequency'&&<div className="nav-scores">{[1,2,3,4].map(n=><button key={n} className={answer===n?'selected':''} aria-label={`${language==='en'?'Select':'Pasirinkti'} ${n}`} onClick={()=>setAnswer(n)}>{n}</button>)}</div>}<button className="next" onClick={()=>go(1)}><span>{t(language,'next')}</span> →</button></nav>
 {drawer&&<Drawer session={session} current={q.id} onJump={jump} onClose={()=>setDrawer(false)} onReview={()=>navigate('review')} onExport={exportJson} onImport={importJson} onClear={()=>{if(confirm(language==='en'?'Are you sure you want to clear every answer in this session?':'Ar tikrai norite išvalyti visus šios sesijos atsakymus?')){clearSession(session);setSession(null);navigate('welcome',routePath.welcome,true)}}}/>}</div></AppLayout>;
}
