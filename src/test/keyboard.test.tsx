import { fireEvent,render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe,expect,it } from 'vitest';
import App from '../App';
import { makeSession,saveSession } from '../lib/storage';
import type { Session } from '../types';

function baseSession(id='current-1'):Session{const s=makeSession({personName:'Rated Person',respondentName:'Test Respondent',relationship:'Friend',date:'2026-07-18',sessionName:'Saved test'});s.currentQuestionId=id;return s;}
async function open(s:Session){saveSession(s);render(<App/>);await userEvent.click(screen.getByRole('button',{name:/Fill out the questionnaire/}));await userEvent.click(screen.getByRole('button',{name:/Saved test/}));}
describe('global keyboard controls',()=>{
 beforeEach(()=>location.hash='');
 it('selects scores with number keys but does not auto-advance',async()=>{await open(baseSession());fireEvent.keyDown(window,{key:'3'});expect(screen.getByRole('radio',{name:/3/})).toHaveAttribute('aria-checked','true');expect(screen.getByText('Question 1')).toBeInTheDocument();});
 it('Enter moves forward after an answer',async()=>{const s=baseSession();s.answers['current-1']=1;await open(s);fireEvent.keyDown(window,{key:'Enter'});expect(screen.getByText('Question 2')).toBeInTheDocument();});
 it('Space moves forward and prevents scrolling navigation defaults',async()=>{const s=baseSession();s.answers['current-1']=1;await open(s);expect(fireEvent.keyDown(window,{key:' '})).toBe(false);expect(screen.getByText('Question 2')).toBeInTheDocument();});
 it('Shift+Space moves backward',async()=>{const s=baseSession('current-2');await open(s);fireEvent.keyDown(window,{key:' ',shiftKey:true});expect(screen.getByText('Question 1')).toBeInTheDocument();});
 it('does not run shortcuts while typing in a textarea',async()=>{const s=baseSession('current-30');s.answers['current-28']=true;s.answers['current-30']={selected:['school'],narratives:{school:{lt:'',en:''}}};await open(s);const area=screen.getAllByRole('textbox')[0];await userEvent.type(area,'1 2');expect(area).toHaveValue('1 2');expect(screen.getByText('Question 30')).toBeInTheDocument();});
 it('blocks forward navigation when a required score is unanswered',async()=>{await open(baseSession());fireEvent.keyDown(window,{key:'Enter'});expect(screen.getByRole('alert')).toHaveTextContent('Choose an answer');expect(screen.getByText('Question 1')).toBeInTheDocument();});
});
