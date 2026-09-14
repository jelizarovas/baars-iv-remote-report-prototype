// @vitest-environment node
// @ts-nocheck
import { readFile } from 'node:fs/promises';
import { describe,expect,it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { fieldMap } from '../pdf/fieldMap';
import { generateCompletedPdf } from '../pdf/generatePdf';
import { relationshipPdfSelection } from '../lib/relationship';
import { makeSession } from '../lib/storage';

const source=()=>readFile('public/BAARS-IV-original.pdf');
const font=()=>readFile('public/fonts/Arial.ttf');
const session=()=>makeSession({personName:'Rated Person',respondentName:'Test Respondent',relationship:'Friend',date:'2026-07-18',sessionName:''});
describe('PDF output',()=>{
 it('maps a standard relationship to its printed PDF choice',()=>expect(relationshipPdfSelection('Friend')).toEqual({field:'friend',circle:'Friend',otherText:''}));
 it('writes an arbitrary relationship beside Other',()=>expect(relationshipPdfSelection('Counselor')).toEqual({field:'other',circle:'Other (specify)',otherText:'Counselor'}));
 it('returns all seven original pages for ordinary responses',async()=>{const bytes=await generateCompletedPdf(session(),{sourceBytes:await source(),fontBytes:await font()});expect((await PDFDocument.load(bytes)).getPageCount()).toBe(7);});
 it('contains no mapping for Office Use Only fields',()=>expect(JSON.stringify(fieldMap).toLowerCase()).not.toContain('office')); 
 it('moves overflowing narrative text to a single-language appendix',async()=>{const s=session();s.answers['current-30']={selected:['school'],narratives:{school:{lt:'',en:'A very long example '.repeat(140)}}};const bytes=await generateCompletedPdf(s,{sourceBytes:await source(),fontBytes:await font()});expect((await PDFDocument.load(bytes)).getPageCount()).toBeGreaterThan(7);});
});
