import { describe, expect, it } from 'vitest';
import { decodeInvitation, encodeInvitation, invitationUrl, respondentFromInvitation, type Invitation } from '../lib/invitation';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('allows an invitation without a relationship', () => {
    const optionalRelationship = { ...invitation, relationship: '' };
    expect(decodeInvitation(encodeInvitation(optionalRelationship))).toEqual(optionalRelationship);
  });

  it('puts the encoded invitation in a respondent route', () => {
    const url = invitationUrl(invitation, { origin: 'https://example.github.io', pathname: '/baars/' } as Location);
    expect(url).toMatch(/^https:\/\/example\.github\.io\/baars\/respond\//);
    expect(url).not.toContain(invitation.from);
    expect(url).not.toContain('#');
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
    history.replaceState(null, '', `/respond/${encodeInvitation(invitation)}`);
    render(<App />);
    expect(screen.getByRole('textbox', { name: /Name of person being rated/ })).toHaveValue('Vertinamas Žmogus');
    expect(screen.getByRole('textbox', { name: /Your full name/ })).toHaveValue('Pakviestas Asmuo');
    expect(screen.getByRole('combobox', { name: /Relationship to the person/ })).toHaveValue('Coworker');
    history.replaceState(null, '', '/');
  });

  it('shows a welcome page with fill and invite choices for a plain URL', () => {
    history.replaceState(null, '', '/');
    render(<App />);
    expect(screen.getByRole('button', { name: /Answer about someone/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ask someone to answer about me/ })).toBeInTheDocument();
  });

  it('uses a working relationship select on the invitation page', async () => {
    history.replaceState(null, '', '/invite');
    render(<App />);
    const relationship = screen.getByRole('combobox', { name: 'Their relationship to you' });
    await userEvent.selectOptions(relationship, 'Mother');
    expect(relationship).toHaveValue('Mother');
    history.replaceState(null, '', '/');
  });

  it('shows the invitation link with an explicit copy action', () => {
    history.replaceState(null, '', '/invite');
    render(<App />);
    expect(screen.getByRole('textbox', { name: 'Invitation link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /share invitation/i })).not.toBeInTheDocument();
    history.replaceState(null, '', '/');
  });

  it('creates a link while the optional relationship is blank', () => {
    history.replaceState(null, '', '/invite');
    render(<App />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Rated Person' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Your email' }), { target: { value: 'results@example.test' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Who are you inviting?' }), { target: { value: 'Respondent' } });
    expect((screen.getByRole('textbox', { name: 'Invitation link' }) as HTMLInputElement).value).toContain('/respond/');
    history.replaceState(null, '', '/');
  });
});
