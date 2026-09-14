import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { questions } from '../src/data/questions';
import { makeSession } from '../src/lib/storage';
import { generateCompletedPdf } from '../src/pdf/generatePdf';

const session=makeSession({personName:'Rated Person',respondentName:'Test Respondent',relationship:'Friend',date:'2026-07-18',sessionName:'Visual calibration'});
for(const q of questions){if(q.type==='frequency')session.answers[q.id]=((q.number-1)%4)+1;}
session.answers['current-28']=true;session.answers['current-29']={age:'7',unknown:false};session.answers['current-30']={selected:['school','home'],narratives:{school:{lt:'Sunku užbaigti užduotis klasėje.',en:'Has difficulty completing tasks in class.'},home:{lt:'Dažnai pameta daiktus namuose.',en:'Often loses items at home.'}}};
session.answers['childhood-19']=true;session.answers['childhood-20']={selected:['school'],narratives:{school:{lt:'Reikėjo daug priminimų.',en:'Needed frequent reminders.'}}};
session.answers['sct-10']=true;session.answers['sct-11']={selected:['home'],narratives:{home:{lt:'Atrodydavo užsisvajojęs.',en:'Often appeared to be daydreaming.'}}};
await mkdir('tmp/pdfs',{recursive:true});
const bytes=await generateCompletedPdf(session,{sourceBytes:await readFile('public/BAARS-IV-original.pdf'),fontBytes:await readFile('public/fonts/Arial.ttf')});
await writeFile('tmp/pdfs/completed-sample.pdf',bytes);
console.log(`Wrote tmp/pdfs/completed-sample.pdf (${bytes.length} bytes)`);
