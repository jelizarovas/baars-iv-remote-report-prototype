import { questions } from '../data/questions';
import type { Answer, Question, Session } from '../types';

export const TOTAL_QUESTIONS = 61;

export function isQuestionComplete(question: Question, answer: Answer | undefined, skipped: string[]): boolean {
  if (skipped.includes(question.id)) return true;
  if (question.type === 'frequency') return typeof answer === 'number' && answer >= 1 && answer <= 4;
  if (question.type === 'yesno') return typeof answer === 'boolean';
  if (question.type === 'age') return !!answer && typeof answer === 'object' && 'unknown' in answer && (answer.unknown || answer.age.trim().length > 0);
  return !!answer && typeof answer === 'object' && 'selected' in answer;
}

export function completion(session: Pick<Session,'answers'|'skipped'>) {
  const count = questions.filter(q => isQuestionComplete(q,session.answers[q.id],session.skipped)).length;
  return { count, percent: Math.round((count / TOTAL_QUESTIONS) * 100) };
}

const branches = {
  'current-28': ['current-29','current-30'],
  'childhood-19': ['childhood-20'],
  'sct-10': ['sct-11']
} as const;

export function withBranching(session: Session, changedId?: string): Session {
  let skipped = [...session.skipped];
  for (const [gate, dependents] of Object.entries(branches)) {
    if (changedId && changedId !== gate) continue;
    const answer = session.answers[gate];
    if (answer === false) skipped = [...new Set([...skipped,...dependents])];
    if (answer === true) skipped = skipped.filter(id => !(dependents as readonly string[]).includes(id));
  }
  return {...session,skipped};
}

export function suggestedGateAnswer(id: string, answers: Record<string,Answer>): boolean | undefined {
  const spec = id === 'current-28' ? ['current',27] : id === 'childhood-19' ? ['childhood',18] : id === 'sct-10' ? ['sct',9] : undefined;
  if (!spec) return undefined;
  const [prefix,count] = spec;
  const values = Array.from({length:Number(count)},(_,i)=>answers[`${prefix}-${i+1}`]);
  if (!values.every(v=>typeof v === 'number')) return undefined;
  return values.some(v=>typeof v === 'number' && v >= 3);
}

export function navigableQuestions(session: Session): Question[] { return questions.filter(q=>!session.skipped.includes(q.id)); }
export function nextQuestionId(session: Session,currentId:string,direction:1|-1): string {
  const list=navigableQuestions(session); const index=list.findIndex(q=>q.id===currentId);
  return list[Math.max(0,Math.min(list.length-1,index+direction))]?.id ?? currentId;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  const el=target as HTMLElement | null;
  return !!el && (['INPUT','TEXTAREA','SELECT'].includes(el.tagName) || el.isContentEditable);
}
