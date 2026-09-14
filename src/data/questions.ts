import type { Question, QuestionnaireId, Setting } from '../types';

const currentTf = { lt: 'Per pastaruosius 6 mėnesius', en: 'During the past 6 months' };
const childhoodTf = { lt: 'Kai vertinamam asmeniui buvo nuo 5 iki 12 metų', en: 'Between 5 and 12 years of age' };
type Pair = [string, string];

const current: Array<Pair & { section?: never }> = [
 ['Nesugeba skirti pakankamai dėmesio detalėms arba darbe ar kitoje veikloje daro neatsargumo klaidų','Fails to give close attention to details or makes careless mistakes in his/her work or other activities'],
 ['Sunkiai išlaiko dėmesį atlikdamas užduotis ar užsiimdamas malonia veikla','Has difficulty sustaining his/her attention in tasks or fun activities'],
 ['Atrodo, kad nesiklauso, kai į jį ar ją kreipiamasi tiesiogiai','Doesn’t listen when spoken to directly'],
 ['Nevykdo nurodymų iki galo ir nebaigia darbo ar namų ruošos darbų','Doesn’t follow through on instructions and fails to finish work or chores'],
 ['Sunkiai organizuoja užduotis ir veiklą','Has difficulty organizing tasks and activities'],
 ['Vengia, nemėgsta arba nenoriai imasi užduočių, kurioms reikia ilgalaikių protinių pastangų','Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort'],
 ['Pameta užduotims ar veiklai reikalingus daiktus','Loses things necessary for tasks or activities'],
 ['Jį ar ją lengvai išblaško pašaliniai dirgikliai arba nesusijusios mintys','Is easily distracted by extraneous stimuli or irrelevant thoughts'],
 ['Yra užmaršus ar užmarši kasdienėje veikloje','Is forgetful in daily activities'],
 ['Judina rankas ar kojas arba muistosi sėdėdamas ar sėdėdama','Fidgets with hands or feet or squirms in seat'],
 ['Pakelia iš savo vietos klasėje ar kitose situacijose, kuriose tikimasi likti sėdėti','Leaves his/her seat in classrooms or in other situations in which remaining seated is expected'],
 ['Pernelyg dažnai keičia padėtį arba jaučiasi neramus ar suvaržytas','Shifts around excessively or feels restless or hemmed in'],
 ['Sunkiai ramiai užsiima laisvalaikio veikla (jaučiasi nepatogiai arba elgiasi garsiai ar triukšmingai)','Has difficulty engaging in leisure activities quietly (feels uncomfortable, or is loud or noisy)'],
 ['Nuolat juda arba elgiasi tarsi būtų „varomas variklio“ (arba jaučiasi turįs būti užsiėmęs ar nuolat ką nors veikti)','Is “on the go” or act as if “driven by a motor” (or he/she feels like he/she has to be busy or always doing something)'],
 ['Pernelyg daug kalba (socialinėse situacijose)','Talks excessively (in social situations)'],
 ['Išpyškina atsakymus dar nebaigus klausimų, užbaigia kitų sakinius arba skuba įvykiams už akių','Blurts out answers before questions have been completed, completes others’ sentences, or jumps the gun'],
 ['Sunkiai laukia savo eilės','Has difficulty awaiting his/her turn'],
 ['Pertraukia kitus arba į juos įsiterpia (be leidimo įsiterpia į pokalbius ar veiklą arba perima tai, ką daro kiti)','Interrupts or intrudes on others (butts into conversations or activities without permission or takes over what others are doing)'],
 ['Yra linkęs ar linkusi svajoti, kai turėtų į ką nors susikaupti arba dirbti','Is prone to daydreaming when he/she should be concentrating on something or working'],
 ['Nuobodžiose situacijose sunkiai išlieka budrus ar nemiega','Has trouble staying alert or awake in boring situations'],
 ['Lengvai susipainioja','Is easily confused'], ['Lengvai pradeda nuobodžiauti','Is easily bored'],
 ['Atrodo išsiblaškęs ar išsiblaškiusi, tarsi „rūke“','Is spacey or “in a fog”'],
 ['Yra vangus ar vangi, labiau pavargęs ar pavargusi nei kiti','Is lethargic, more tired than others'],
 ['Yra nepakankamai aktyvus ar aktyvi arba turi mažiau energijos nei kiti','Is underactive or has less energy than others'],
 ['Juda lėtai','Is slow moving'],
 ['Atrodo, kad informaciją apdoroja ne taip greitai ar tiksliai kaip kiti','Doesn’t seem to process information as quickly or as accurately as others.']
];

const childhood: Pair[] = [
 ['Neskyrė pakankamai dėmesio detalėms arba darbe ar kitoje veikloje darė neatsargumo klaidų','Failed to give close attention to details or made careless mistakes in his/her work or other activities'],
 ['Sunkiai išlaikė dėmesį atlikdamas užduotis ar užsiimdamas malonia veikla','Had difficulty sustaining his/her attention in tasks or fun activities'],
 ['Nesiklausė, kai į jį ar ją buvo kreipiamasi tiesiogiai','Didn’t listen when spoken to directly'],
 ['Nevykdė nurodymų iki galo ir nebaigdavo darbo ar namų ruošos darbų','Didn’t follow through on instructions and failed to finish work or chores.'],
 ['Sunkiai organizavo užduotis ir veiklą','Had difficulty organizing tasks and activities'],
 ['Vengė, nemėgo arba nenoriai imdavosi užduočių, kurioms reikėjo ilgalaikių protinių pastangų','Avoided, disliked, or was reluctant to engage in tasks that required sustained mental effort'],
 ['Pamesdavo užduotims ar veiklai reikalingus daiktus','Lost things necessary for tasks or activities'],
 ['Jį ar ją lengvai išblaškydavo pašaliniai dirgikliai arba nesusijusios mintys','Was easily distracted by extraneous stimuli or irrelevant thoughts.'],
 ['Buvo užmaršus ar užmarši kasdienėje veikloje','Was forgetful in daily activities'],
 ['Judino rankas ar kojas arba muistėsi savo vietoje','Fidgeted with his/her hands or feet or squirmed in his/her seat'],
 ['Pakildavo iš savo vietos klasėje ar kitose situacijose, kuriose buvo tikimasi likti sėdėti','Left his/her seat in classrooms or in other situations in which remaining seated was expected'],
 ['Pernelyg dažnai keitė padėtį arba jautėsi neramus ar suvaržytas','Shifted around excessively or felt restless or hemmed in'],
 ['Sunkiai ramiai užsiimdavo laisvalaikio veikla (jautėsi nepatogiai arba elgėsi garsiai ar triukšmingai)','Had difficulty engaging in leisure activities quietly (felt uncomfortable, or was loud or noisy)'],
 ['Nuolat judėjo arba elgėsi tarsi būtų „varomas variklio“','Was “on the go” or acted as if “driven by a motor”'],
 ['Pernelyg daug kalbėjo','Talked excessively'],
 ['Išpyškindavo atsakymus dar nebaigus klausimų, užbaigdavo kitų sakinius arba skubėdavo įvykiams už akių','Blurted out answers before questions had been completed, completed others’ sentences, or jumped the gun'],
 ['Sunkiai laukdavo savo eilės','Had difficulty awaiting his/her turn'],
 ['Pertraukdavo kitus arba į juos įsiterpdavo (be leidimo įsiterpdavo į pokalbius ar veiklą arba perimdavo tai, ką darė kiti)','Interrupted or intruded on others (butted into conversations or activities without permission or took over what others were doing)']
];

const sct: Pair[] = [
 ['Buvo linkęs ar linkusi svajoti, kai turėjo į ką nors susikaupti arba dirbti','Was prone to daydreaming when he/she should have been concentrating on something or working'],
 ['Nuobodžiose situacijose sunkiai išlikdavo budrus ar nemiegodavo','Had trouble staying alert or awake in boring situations'],
 ['Lengvai susipainiodavo','Was easily confused'], ['Lengvai pradėdavo nuobodžiauti','Was easily bored'],
 ['Atrodė išsiblaškęs ar išsiblaškiusi, tarsi „rūke“','Was spacey or “in a fog”'],
 ['Buvo vangus ar vangi, labiau pavargęs ar pavargusi nei kiti','Was lethargic, more tired than others'],
 ['Buvo nepakankamai aktyvus ar aktyvi arba turėjo mažiau energijos nei kiti','Was underactive or had less energy than others'],
 ['Judėjo lėtai','Was slow moving'],
 ['Atrodė, kad informaciją apdorojo ne taip greitai ar tiksliai kaip kiti','Didn’t seem to process information as quickly or as accurately as others.']
];

function sectionFor(q: QuestionnaireId, n: number): [string,string] {
 if (q === 'current') return n <= 9 ? ['Inattention','Nedėmesingumas'] : n <= 14 ? ['Hyperactivity','Hiperaktyvumas'] : n <= 18 ? ['Impulsivity','Impulsyvumas'] : n <= 27 ? ['Sluggish Cognitive Tempo','Sulėtėjęs pažintinis tempas'] : ['Additional questions','Papildomi klausimai'];
 if (q === 'childhood') return n <= 9 ? ['Inattention','Nedėmesingumas'] : n <= 18 ? ['Hyperactivity-Impulsivity','Hiperaktyvumas ir impulsyvumas'] : ['Additional questions','Papildomi klausimai'];
 return n <= 9 ? ['Symptoms','Simptomai'] : ['Additional questions','Papildomi klausimai'];
}
function freq(q: QuestionnaireId, rows: Pair[], tf: typeof currentTf): Question[] { return rows.map(([lt,en],i) => { const [section,sectionLt]=sectionFor(q,i+1); return { id:`${q}-${i+1}`, questionnaire:q, number:i+1, section, sectionLt, type:'frequency', lt,en,timeframe:tf }; }); }
const settings = (q: QuestionnaireId, number: number, allowed: Setting[], childhoodMode=false): Question => { const [section,sectionLt]=sectionFor(q,number); return { id:`${q}-${number}`,questionnaire:q,number,section,sectionLt,type:'settings',settings:allowed,
 lt:`Jei taip, kuriose iš šių aplinkų šie simptomai trukdė asmeniui funkcionuoti? Pažymėkite visas tinkamas sritis.`,
 en:`If so, in which of these settings did those symptoms impair the person’s functioning? Place a check mark next to all of the areas that apply to the person.`,
 warning:{lt:childhoodMode?'Jei pažymėjote sritį, prašoma pateikti vaikystės sunkumų pavyzdį.':'Jei pažymėjote sritį, prašoma pateikti sunkumų pavyzdį.',en:'The original form requests examples for selected settings.'} }; };
const yesNo = (q: QuestionnaireId, number:number, count:number): Question => { const [section,sectionLt]=sectionFor(q,number); return {id:`${q}-${number}`,questionnaire:q,number,section,sectionLt,type:'yesno',
 lt:`Ar asmuo patyrė bent vieną iš šių ${count} simptomų „dažnai“ arba dar dažniau (ar aukščiau pasirinkote 3 arba 4)?`,
 en:`Did ${q==='current'?'this person':'the person'} experience any of these ${count} symptoms at least “Often” or more frequently (Did you circle a 3 or a 4 above)?`}; };

export const questions: Question[] = [
 ...freq('current',current,currentTf), yesNo('current',28,27),
 {id:'current-29',questionnaire:'current',number:29,...Object.fromEntries([['section','Additional questions'],['sectionLt','Papildomi klausimai']]),type:'age',lt:'Jei taip, kiek metų buvo asmeniui, kai šie simptomai prasidėjo?',en:'If so, how old was the person when those symptoms began? (Fill in the blank)'} as Question,
 settings('current',30,['school','home','work','social']),
 ...freq('childhood',childhood,childhoodTf), yesNo('childhood',19,18), settings('childhood',20,['school','home','social'],true),
 ...freq('sct',sct,childhoodTf), yesNo('sct',10,9), settings('sct',11,['school','home','social'],true)
];

export const questionnaireTitles = {
 current:{lt:'Dabartiniai simptomai',en:'BAARS-IV: Current Symptoms'},
 childhood:{lt:'Vaikystės simptomai',en:'BAARS-IV: Childhood Symptoms'},
 sct:{lt:'Vaikystės sulėtėjęs pažintinis tempas',en:'SCT: Childhood Symptoms'}
};
export const frequencyChoices = [
 {value:1,lt:'Niekada arba retai',en:'Never or rarely'}, {value:2,lt:'Kartais',en:'Sometimes'},
 {value:3,lt:'Dažnai',en:'Often'}, {value:4,lt:'Labai dažnai',en:'Very often'}
] as const;
export const settingLabels: Record<Setting,{lt:string,en:string}> = {
 school:{lt:'Mokykla',en:'School'},home:{lt:'Namai',en:'Home'},work:{lt:'Darbas',en:'Work'},social:{lt:'Socialiniai santykiai',en:'Social Relationships'}
};
