import { describe,expect,it } from 'vitest';
import { completion, suggestedGateAnswer, withBranching } from '../lib/questionnaire';
import { clearSession, loadSession, makeSession, saveSession, sessionKey } from '../lib/storage';
import type { Respondent, Session } from '../types';

const respondent=(relationship='Friend',name='Respondent One'):Respondent=>({personName:'Rated Person',respondentName:name,relationship,date:'2026-07-18',sessionName:''});
describe('questionnaire logic',()=>{
 it('calculates progress against the fixed 61-question total',()=>{const s=makeSession(respondent());s.answers['current-1']=3;expect(completion(s)).toEqual({count:1,percent:2});});
 it('suggests gate answers without overwriting a manual answer',()=>{const answers=Object.fromEntries(Array.from({length:27},(_,i)=>[`current-${i+1}`,i===4?3:1]));expect(suggestedGateAnswer('current-28',answers)).toBe(true);const s=makeSession(respondent());s.answers={...answers,'current-28':false};expect(withBranching(s,'current-28').answers['current-28']).toBe(false);});
 it('conditionally skips and restores dependent questions',()=>{let s=makeSession(respondent());s.answers['current-28']=false;s=withBranching(s,'current-28');expect(s.skipped).toEqual(expect.arrayContaining(['current-29','current-30']));s.answers['current-28']=true;s=withBranching(s,'current-28');expect(s.skipped).not.toContain('current-29');});
 it('autosaves and restores a complete session payload',()=>{const s=makeSession(respondent());s.answers['current-1']=4;saveSession(s);expect(loadSession(s.respondent)?.answers['current-1']).toBe(4);clearSession(s);expect(loadSession(s.respondent)).toBeUndefined();});
 it('keeps sessions for different respondents and relationships separate',()=>{const first=makeSession(respondent('Friend'));const second=makeSession(respondent('Coworker','Respondent Two'));expect(sessionKey(first.respondent)).not.toBe(sessionKey(second.respondent));saveSession(first);saveSession(second);expect(loadSession(first.respondent)?.respondent.relationship).toBe('Friend');expect(loadSession(second.respondent)?.respondent.relationship).toBe('Coworker');});
});
