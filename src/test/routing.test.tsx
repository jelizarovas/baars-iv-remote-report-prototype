import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('client routing', () => {
  beforeEach(() => history.replaceState(null, '', location.pathname));
  afterEach(() => history.replaceState(null, '', location.pathname));

  it('adds navigable history entries and responds to browser navigation', async () => {
    render(<App/>);
    fireEvent.click(screen.getByRole('button', { name: /Ask someone to answer about me/ }));
    expect(location.hash).toBe('#share');
    expect(history.state).toMatchObject({ baarsRoute: 'share', from: 'welcome' });

    history.replaceState({ baarsRoute: 'welcome' }, '', location.pathname);
    fireEvent.popState(window);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Choose how to complete the questionnaire' })).toBeInTheDocument());
  });

  it('keeps one background mounted while route content changes', () => {
    const { container } = render(<App/>);
    const background = container.querySelector('.app-layout > .neural-background');
    expect(background).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Answer about someone/ }));
    expect(location.hash).toBe('#start');
    expect(container.querySelector('.app-layout > .neural-background')).toBe(background);
    expect(container.querySelectorAll('.neural-background')).toHaveLength(1);
  });
});
