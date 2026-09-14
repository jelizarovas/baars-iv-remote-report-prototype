import type { Session } from '../types';

export function safeFilename(session:Session,ext:'pdf'|'json') {
 const r=session.respondent;const clean=(value:string,fallback:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'')||fallback;return `BAARS-IV_${clean(r.personName,'Person')}_${clean(r.relationship,'Relationship')}_${r.date}.${ext}`;
}
export function downloadBytes(bytes:Uint8Array,filename:string,type:string){const blob=new Blob([bytes as BlobPart],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
