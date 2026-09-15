import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DisplayControls, LanguagePicker, LanguageProvider, ThemeProvider } from '../i18n/LanguageContext';
import { Welcome } from '../components/Welcome';

describe('language selection', () => {
  beforeEach(() => { localStorage.clear(); delete document.documentElement.dataset.theme; });

  it('shows English by default and one language at a time', async () => {
    render(<LanguageProvider><LanguagePicker/><Welcome onStart={() => {}} onInvite={() => {}}/></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'Choose how to complete the questionnaire' })).toBeInTheDocument();
    expect(screen.queryByText('Pasirinkite, kaip pildysite klausimyną')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Language' }));
    await userEvent.click(screen.getByRole('option', { name: 'Lietuvių' }));
    expect(screen.getByRole('heading', { name: 'Pasirinkite, kaip pildysite klausimyną' })).toBeInTheDocument();
    expect(screen.queryByText('Choose how to complete the questionnaire')).not.toBeInTheDocument();
  });

  it('switches between light and dark mode', async () => {
    render(<LanguageProvider><ThemeProvider><DisplayControls/><Welcome onStart={() => {}} onInvite={() => {}}/></ThemeProvider></LanguageProvider>);
    const toggle = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(toggle).toHaveAttribute('aria-pressed','false');
    await userEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute('aria-pressed','true');
  });
});
