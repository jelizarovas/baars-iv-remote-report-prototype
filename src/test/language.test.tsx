import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { LanguagePicker, LanguageProvider } from '../i18n/LanguageContext';
import { Welcome } from '../components/Welcome';

describe('language selection', () => {
  beforeEach(() => localStorage.clear());

  it('shows English by default and one language at a time', async () => {
    render(<LanguageProvider><LanguagePicker/><Welcome onStart={() => {}} onInvite={() => {}}/></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'Behavior questionnaire' })).toBeInTheDocument();
    expect(screen.queryByText('Elgesio klausimynas')).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'lt');
    expect(screen.getByRole('heading', { name: 'Elgesio klausimynas' })).toBeInTheDocument();
    expect(screen.queryByText('Behavior questionnaire')).not.toBeInTheDocument();
  });
});
