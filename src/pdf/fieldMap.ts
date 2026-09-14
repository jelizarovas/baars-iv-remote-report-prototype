import type { QuestionnaireId, Setting } from '../types';

export interface Point { x:number; y:number }
export interface Box { x:number; y:number; width:number; height:number }
export interface FrequencyField { page:number; choices:Record<1|2|3|4,Point> }
const choiceXs=[407.2,452.2,490.5,526.5] as const;
const row=(page:number,topCenter:number):FrequencyField=>({page,choices:Object.fromEntries(choiceXs.map((x,i)=>[i+1,{x,y:792-topCenter}])) as unknown as FrequencyField['choices']});

const frequency:Record<string,FrequencyField>={};
function add(prefix:string,page:number,start:number,tops:number[]){tops.forEach((top,i)=>frequency[`${prefix}-${start+i}`]=row(page,top));}
add('current',0,1,[326.1,351.9,377.7,403.5,429.3,455.1,480.9,506.7,532.5,621.4,647.2,673.0]);
add('current',1,13,[79.5,105.3,194.3,220.1,245.8,271.6,373.1,398.9,424.7,450.5,476.3,502.1,527.9,553.7,579.5]);
add('childhood',3,1,[300.8,326.6,352.4,378.2,404.0,429.8,455.6,481.4,507.2,596.1,634.6,660.4]);
add('childhood',4,13,[79.6,105.3,131.1,156.9,182.7,208.5]);
add('sct',5,1,[337.6,363.4,389.2,415.0,440.8,466.6,492.4,518.2,544.0]);

export const fieldMap={
 frequency,
 respondentPages:[0,3,5],
 respondent:{
 personName:{x:218,y:675,width:175,height:13} as Box,date:{x:449,y:675,width:105,height:13} as Box,
  respondentName:{x:145,y:649,width:407,height:13} as Box,
  relationships:{
   mother:{x:95,y:608} as Point,
   father:{x:142.5,y:608} as Point,
   sibling:{x:204.7,y:608} as Point,
   spousePartner:{x:287.2,y:608} as Point,
   friend:{x:353,y:608} as Point,
   other:{x:397,y:608} as Point,
  },
  otherText:{x:463,y:603,width:91,height:13} as Box
 },
 yesno:{
  'current-28':{page:2,no:{x:261.5,y:672.2},yes:{x:304.4,y:672.2}},
  'childhood-19':{page:4,no:{x:261.5,y:437.3},yes:{x:304.4,y:437.3}},
  'sct-10':{page:6,no:{x:261.5,y:672.2},yes:{x:304.4,y:672.2}}
 } as Record<string,{page:number;no:Point;yes:Point}>,
 age:{page:2,box:{x:173,y:618,width:105,height:14} as Box,unknown:{x:149,y:579} as Point},
 settings:{
  'current-30':{page:2,checks:{school:{x:139,y:507},home:{x:139,y:494},work:{x:139,y:481},social:{x:139,y:469}},boxes:{school:{x:160,y:337,width:395,height:39},home:{x:160,y:276,width:395,height:39},work:{x:160,y:212,width:395,height:39},social:{x:190,y:148,width:365,height:39}}},
  'childhood-20':{page:4,checks:{school:{x:139,y:374},home:{x:139,y:361},social:{x:139,y:348}},boxes:{school:{x:160,y:232,width:395,height:39},home:{x:160,y:167,width:395,height:39},social:{x:190,y:115,width:365,height:39}}},
  'sct-11':{page:6,checks:{school:{x:139,y:608},home:{x:139,y:595},social:{x:139,y:582}},boxes:{school:{x:160,y:464,width:395,height:39},home:{x:160,y:398,width:395,height:39},social:{x:190,y:333,width:365,height:39}}}
 } as Record<string,{page:number;checks:Partial<Record<Setting,Point>>;boxes:Partial<Record<Setting,Box>>}>
};

export interface CalibrationMarker {label:string;page:number;point:Point}
export function calibrationMarkers():CalibrationMarker[]{
 const markers:CalibrationMarker[]=[];
 for(const [id,f] of Object.entries(frequency)) for(const [score,point] of Object.entries(f.choices)) markers.push({label:`${id}:${score}`,page:f.page,point});
 for(const [id,f] of Object.entries(fieldMap.yesno)){markers.push({label:`${id}:No`,page:f.page,point:f.no},{label:`${id}:Yes`,page:f.page,point:f.yes});}
 return markers;
}
