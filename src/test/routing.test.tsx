import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('client routing', () => {
  beforeEach(() => history.replaceState(null, '', '/'));
  afterEach(() => history.replaceState(null, '', '/'));

  it('adds navigable history entries and responds to browser navigation', async () => {
    render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: /Ask someone to answer about me/ }));
    expect(location.pathname).toBe('/invite');
    expect(history.state).toMatchObject({ baarsRoute: 'share', from: 'welcome' });

    history.replaceState({ baarsRoute: 'welcome' }, '', '/');
    fireEvent.popState(window);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Choose how to complete the questionnaire' })).toBeInTheDocument());
  });

  it('keeps one background mounted while route content changes', () => {
    const { container } = render(<App/>);
    const background = container.querySelector('.app-layout > .neural-background');
    expect(background).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Answer about someone/ }));
    expect(location.pathname).toBe('/start');
    expect(container.querySelector('.app-layout > .neural-background')).toBe(background);
    expect(container.querySelectorAll('.neural-background')).toHaveLength(1);
  });
});
