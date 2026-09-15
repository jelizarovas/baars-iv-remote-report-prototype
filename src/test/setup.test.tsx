import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../i18n/LanguageContext';
import { Setup } from '../components/Setup';

describe('questionnaire setup', () => {
  it('shows a visible primary start action without unnecessary saved-session actions', () => {
    render(
      <LanguageProvider>
        <Setup onStart={vi.fn()} onOpenShare={vi.fn()} onBack={vi.fn()} />
      </LanguageProvider>,
    );

    expect(screen.getByRole('button', { name: 'Start' })).toHaveClass('primary');
    expect(screen.queryByRole('button', { name: 'Continue saved questionnaire' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /Session name/i })).not.toBeInTheDocument();
  });
});
