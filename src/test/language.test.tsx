import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DisplayControls, LanguagePicker, LanguageProvider, ThemeProvider } from '../i18n/LanguageContext';
import { Welcome } from '../components/Welcome';

describe('language selection', () => {
  beforeEach(() => { localStorage.clear(); delete document.documentElement.dataset.theme; });

  it('shows English by default and one language at a time', async () => {
    render(<LanguageProvider><LanguagePicker/><Welcome onStart={() => {}} onInvite={() => {}}/></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'Behavior questionnaire' })).toBeInTheDocument();
    expect(screen.queryByText('Elgesio klausimynas')).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'lt');
    expect(screen.getByRole('heading', { name: 'Elgesio klausimynas' })).toBeInTheDocument();
    expect(screen.queryByText('Behavior questionnaire')).not.toBeInTheDocument();
  });

  it('switches between light and dark mode', async () => {
    render(<LanguageProvider><ThemeProvider><DisplayControls/><Welcome onStart={() => {}} onInvite={() => {}}/></ThemeProvider></LanguageProvider>);
    expect(screen.getByRole('button', { name: 'Light mode' })).toHaveAttribute('aria-pressed','true');
    await userEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed','true');
  });
});
