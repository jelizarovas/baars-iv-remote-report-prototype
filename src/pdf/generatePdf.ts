import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFPage, PDFFont, rgb } from 'pdf-lib';
import type { Session, Setting, SettingsAnswer } from '../types';
import { questions, questionnaireTitles, settingLabels } from '../data/questions';
import { fieldMap, type Box, type Point } from './fieldMap';
import { relationshipPdfSelection } from '../lib/relationship';

const black=rgb(0,0,0);
function circle(page:PDFPage,p:Point,xScale=9,yScale=8){page.drawEllipse({x:p.x,y:p.y,xScale,yScale,borderColor:black,borderWidth:1.25});}
function check(page:PDFPage,p:Point){page.drawLine({start:{x:p.x-3,y:p.y},end:{x:p.x,y:p.y-4},thickness:1.4,color:black});page.drawLine({start:{x:p.x,y:p.y-4},end:{x:p.x+7,y:p.y+5},thickness:1.4,color:black});}
function wrap(text:string,font:PDFFont,size:number,width:number):string[]{
 const paragraphs=text.replace(/\r/g,'').split('\n'); const lines:string[]=[];
 for(const para of paragraphs){if(!para){lines.push('');continue}let line='';for(const word of para.split(/\s+/)){const next=line?`${line} ${word}`:word;if(font.widthOfTextAtSize(next,size)<=width)line=next;else{if(line)lines.push(line);line=word;}}if(line)lines.push(line)}return lines;
}
function drawBox(page:PDFPage,text:string,box:Box,font:PDFFont,size=8):string{
 const lines=wrap(text,font,size,box.width); const max=Math.max(1,Math.floor(box.height/(size+2))); const visible=lines.slice(0,max); visible.forEach((line,i)=>page.drawText(line,{x:box.x,y:box.y+box.height-size-(i*(size+2)),font,size,color:black,maxWidth:box.width})); return lines.slice(max).join(' ');
}
function drawInfo(page:PDFPage,session:Session,font:PDFFont){
 const r=session.respondent; drawBox(page,r.personName,fieldMap.respondent.personName,font,8); drawBox(page,r.date,fieldMap.respondent.date,font,8); drawBox(page,r.respondentName,fieldMap.respondent.respondentName,font,8);
 const selection=relationshipPdfSelection(r.relationship);circle(page,fieldMap.respondent.relationships[selection.field],selection.field==='other'?18:20,8);if(selection.otherText)drawBox(page,selection.otherText,fieldMap.respondent.otherText,font,8);
}
export interface GenerateOptions {sourceBytes?:ArrayBuffer|Uint8Array;fontBytes?:ArrayBuffer|Uint8Array}
export async function generateCompletedPdf(session:Session,options:GenerateOptions={}):Promise<Uint8Array>{
 const base=import.meta.env.BASE_URL;
 const source=options.sourceBytes??await (await fetch(`${base}BAARS-IV-original.pdf`)).arrayBuffer();
 const fontData=options.fontBytes??await (await fetch(`${base}fonts/Arial.ttf`)).arrayBuffer();
 const pdf=await PDFDocument.load(source);pdf.registerFontkit(fontkit);const font=await pdf.embedFont(fontData,{subset:true});const pages=pdf.getPages();
 fieldMap.respondentPages.forEach(i=>drawInfo(pages[i],session,font));
 for(const q of questions){const answer=session.answers[q.id];if(answer===undefined||session.skipped.includes(q.id))continue;
  if(q.type==='frequency'&&typeof answer==='number'){const f=fieldMap.frequency[q.id];if(f)circle(pages[f.page],f.choices[answer as 1|2|3|4]);}
  if(q.type==='yesno'&&typeof answer==='boolean'){const f=fieldMap.yesno[q.id];circle(pages[f.page],answer?f.yes:f.no,18,8);}
 }
 const age=session.answers['current-29']; if(age&&typeof age==='object'&&'unknown' in age){if(age.unknown)check(pages[fieldMap.age.page],fieldMap.age.unknown);else drawBox(pages[fieldMap.age.page],age.age,fieldMap.age.box,font,9);}
 const language=session.respondent.language??'en';
 const overflow:Array<{qid:string;setting:Setting;text:string}>=[];
 for(const qid of ['current-30','childhood-20','sct-11']){const a=session.answers[qid] as SettingsAnswer|undefined;if(!a)continue;const map=fieldMap.settings[qid];for(const setting of a.selected){const pt=map.checks[setting];if(pt)check(pages[map.page],pt);const text=a.narratives[setting]?.[language]||'';const box=map.boxes[setting];if(text&&box){const rest=drawBox(pages[map.page],text,box,font,7.5);if(rest)overflow.push({qid,setting,text:rest});}}
 }
 if(overflow.length){let page=pdf.addPage([612,792]);let y=744;page.drawText(language==='en'?'Narrative appendix':'Tekstinių atsakymų priedas',{x:42,y,font,size:15,color:black});y-=30;
  for(const item of overflow){const q=questions.find(x=>x.id===item.qid)!;const labels=questionnaireTitles[q.questionnaire];const setting=settingLabels[item.setting];const head=language==='en'?`${labels.en} - Question ${q.number} - ${setting.en}`:`${labels.lt} - Klausimas ${q.number} - ${setting.lt}`;const lines=[head,...wrap(item.text,font,9,528)];if(y-lines.length*12<45){page=pdf.addPage([612,792]);y=744;}for(const line of lines){page.drawText(line,{x:42,y,font,size:9,color:black});y-=12;}y-=12;}
 }
 pdf.setTitle('Completed BAARS-IV questionnaire');pdf.setSubject('Respondent-entered answers; no scoring or diagnostic interpretation');return pdf.save();
}
