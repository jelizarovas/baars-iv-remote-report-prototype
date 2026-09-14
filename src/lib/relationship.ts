import type { Relationship } from '../types';

export type PdfRelationshipField = 'mother' | 'father' | 'sibling' | 'spousePartner' | 'friend' | 'other';

export const relationshipSuggestions = [
  { value: 'Mother', en: 'Mother', lt: 'Motina' },
  { value: 'Father', en: 'Father', lt: 'Tėvas' },
  { value: 'Brother/sister', en: 'Brother or sister', lt: 'Brolis ar sesuo' },
  { value: 'Spouse/partner', en: 'Spouse or partner', lt: 'Sutuoktinis ar partneris' },
  { value: 'Friend', en: 'Friend', lt: 'Draugas' },
] as const;

const fields: Record<string, PdfRelationshipField> = {
  mother: 'mother',
  father: 'father',
  'brother/sister': 'sibling',
  'brother or sister': 'sibling',
  sibling: 'sibling',
  'spouse/partner': 'spousePartner',
  'spouse or partner': 'spousePartner',
  spouse: 'spousePartner',
  partner: 'spousePartner',
  friend: 'friend',
};

export function relationshipPdfSelection(relationship: Relationship): {
  field: PdfRelationshipField;
  circle: string;
  otherText: string;
} {
  const value = relationship.trim();
  const field = fields[value.toLocaleLowerCase('en-US')] ?? 'other';
  const labels: Record<PdfRelationshipField, string> = {
    mother: 'Mother',
    father: 'Father',
    sibling: 'Brother/sister',
    spousePartner: 'Spouse/partner',
    friend: 'Friend',
    other: 'Other (specify)',
  };
  return { field, circle: labels[field], otherText: field === 'other' ? value : '' };
}
