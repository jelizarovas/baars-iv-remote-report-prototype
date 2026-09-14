import { describe, expect, it } from 'vitest';
import { decodeInvitation, encodeInvitation, invitationUrl, respondentFromInvitation, type Invitation } from '../lib/invitation';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { makeSession } from '../lib/storage';
import { returnEmailUrl } from '../components/Review';

const invitation: Invitation = {
  version: 2,
  from: 'Vertinamas Žmogus',
  to: 'Pakviestas Asmuo',
  relationship: 'Coworker',
  returnEmail: 'results@example.test',
  language: 'en',
};

describe('invitation links', () => {
  it('round-trips Unicode names through a URL-safe payload', () => {
    const encoded = encodeInvitation(invitation);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(decodeInvitation(encoded)).toEqual(invitation);
  });

  it('puts personal details in the fragment rather than the server request path', () => {
    const url = invitationUrl(invitation, { origin: 'https://example.github.io', pathname: '/baars/' } as Location);
    expect(url).toMatch(/^https:\/\/example\.github\.io\/baars\/#invite=/);
    expect(url.split('#')[0]).not.toContain(invitation.from);
    expect(url).not.toContain('?');
  });

  it('creates a prefilled respondent and leaves answers out of the invitation', () => {
    const respondent = respondentFromInvitation(invitation, '2026-09-14');
    expect(respondent).toMatchObject({ personName: 'Vertinamas Žmogus', respondentName: 'Pakviestas Asmuo', relationship: 'Coworker', date: '2026-09-14' });
    expect(respondent.returnEmail).toBe('results@example.test');
    expect(encodeInvitation(invitation)).not.toContain('answers');
  });

  it('rejects malformed or unsupported invitations', () => {
    expect(decodeInvitation('not-base64')).toBeUndefined();
  });

  it('pre-addresses the return email without trying to attach a file', () => {
    const session = makeSession(respondentFromInvitation(invitation, '2026-09-14'));
    const mailto = returnEmailUrl(session);
    expect(mailto).toContain('mailto:results%40example.test');
    expect(decodeURIComponent(mailto)).toContain('Please attach the downloaded PDF');
  });

  it('prefills the intended respondent when an invitation opens', () => {
    location.hash = `#invite=${encodeInvitation(invitation)}`;
    render(<App />);
    expect(screen.getByRole('textbox', { name: /Name of person being rated/ })).toHaveValue('Vertinamas Žmogus');
    expect(screen.getByRole('textbox', { name: /Your full name/ })).toHaveValue('Pakviestas Asmuo');
    expect(screen.getByRole('combobox', { name: /Relationship to the person/ })).toHaveValue('Coworker');
    location.hash = '';
  });

  it('shows a welcome page with fill and invite choices for a plain URL', () => {
    location.hash = '';
    render(<App />);
    expect(screen.getByRole('button', { name: /Fill out the questionnaire/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Invite someone to fill it out/ })).toBeInTheDocument();
  });

  it('uses a working relationship select on the invitation page', async () => {
    location.hash = '#share';
    render(<App />);
    const relationship = screen.getByRole('combobox', { name: 'Their relationship to you' });
    await userEvent.selectOptions(relationship, 'Mother');
    expect(relationship).toHaveValue('Mother');
    location.hash = '';
  });
});
