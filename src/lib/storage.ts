import type { Respondent, Session } from '../types';

const PREFIX='baars-iv:session:';
const clean=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function sessionKey(r: Respondent): string { return `${PREFIX}${clean(r.personName)}:${r.relationship}:${clean(r.respondentName)}`; }
export function saveSession(session:Session):void { localStorage.setItem(sessionKey(session.respondent),JSON.stringify(session)); }
export function loadSession(r:Respondent):Session|undefined { const raw=localStorage.getItem(sessionKey(r)); if(!raw)return; try{return JSON.parse(raw) as Session}catch{return} }
export function listSessions():Session[] {
 const out:Session[]=[]; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(PREFIX)){try{out.push(JSON.parse(localStorage.getItem(k)!) as Session)}catch{/* ignore corrupt local data */}}}
 return out.sort((a,b)=>b.lastUpdated.localeCompare(a.lastUpdated));
}
export function clearSession(session:Session):void { localStorage.removeItem(sessionKey(session.respondent)); }
export function makeSession(respondent:Respondent):Session { return {version:1,respondent:{...respondent,language:respondent.language??'lt-en'},answers:{},skipped:[],currentQuestionId:'current-1',completed:false,lastUpdated:new Date().toISOString()}; }
