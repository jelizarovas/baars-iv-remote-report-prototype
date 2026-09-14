import type { LanguageMode, Relationship, Respondent } from '../types';

export interface Invitation {
  version: 2;
  from: string;
  to: string;
  relationship: Relationship;
  returnEmail: string;
  language: LanguageMode;
  sessionName: string;
}

const validLanguages: LanguageMode[] = ['lt-en', 'lt', 'en'];

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

export function encodeInvitation(invitation: Invitation): string {
  return toBase64Url(JSON.stringify(invitation));
}

export function decodeInvitation(value: string): Invitation | undefined {
  try {
    const parsed = JSON.parse(fromBase64Url(value)) as Record<string, unknown>;
    if (parsed.version !== 2 || typeof parsed.from !== 'string' || typeof parsed.to !== 'string') return;
    if (typeof parsed.relationship !== 'string' || !parsed.relationship.trim()) return;
    if (typeof parsed.returnEmail !== 'string' || typeof parsed.sessionName !== 'string') return;
    if (!validLanguages.includes(parsed.language as LanguageMode)) return;
    return {
      version: 2,
      from: parsed.from.trim(),
      to: parsed.to.trim(),
      relationship: parsed.relationship.trim(),
      returnEmail: parsed.returnEmail.trim(),
      language: parsed.language as LanguageMode,
      sessionName: parsed.sessionName.trim(),
    };
  } catch {
    return;
  }
}

export function invitationFromHash(hash = window.location.hash): Invitation | undefined {
  const match = hash.match(/^#invite=([^&]+)$/);
  return match ? decodeInvitation(match[1]) : undefined;
}

export function invitationUrl(invitation: Invitation, locationLike: Pick<Location, 'origin' | 'pathname'> = window.location): string {
  return `${locationLike.origin}${locationLike.pathname}#invite=${encodeInvitation(invitation)}`;
}

export function respondentFromInvitation(invitation: Invitation, date = new Date().toLocaleDateString('en-CA')): Respondent {
  return {
    personName: invitation.from,
    respondentName: invitation.to,
    relationship: invitation.relationship,
    returnEmail: invitation.returnEmail,
    language: invitation.language,
    sessionName: invitation.sessionName,
    date,
  };
}
