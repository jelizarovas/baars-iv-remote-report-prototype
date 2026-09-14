import type { Relationship } from '../types';

export type PdfRelationshipField = 'mother' | 'father' | 'sibling' | 'spousePartner' | 'friend' | 'other';

export const relationshipSuggestions = [
  { value: 'Mother', label: 'Motina / Mother' },
  { value: 'Father', label: 'Tėvas / Father' },
  { value: 'Brother/sister', label: 'Brolis ar sesuo / Brother or sister' },
  { value: 'Spouse/partner', label: 'Sutuoktinis ar partneris / Spouse or partner' },
  { value: 'Friend', label: 'Draugas / Friend' },
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
