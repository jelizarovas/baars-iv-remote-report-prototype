import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AccessGate } from '../components/AccessGate';

const reviewHash = 'c97ace4c8fef2cee8fa0f3c9f52aab18dbd4f42438afe362ffb8f75ce4c04b84';

describe('review access gate', () => {
  beforeEach(() => sessionStorage.clear());

  it('keeps the review hidden until the correct password is entered', async () => {
    render(<AccessGate expectedHash={reviewHash} development={false}><p>Private review</p></AccessGate>);
    expect(screen.queryByText('Private review')).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/PIN or password/), { target: { value: 'review' } });
    fireEvent.click(screen.getByRole('button', { name: /Open review/ }));
    await waitFor(() => expect(screen.getByText('Private review')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Lock review and return to password/ }));
    expect(screen.getByRole('heading', { name: /Enter the review code/ })).toBeInTheDocument();
    expect(screen.queryByText('Private review')).not.toBeInTheDocument();
  });

  it('fails closed in production when no hash is configured', () => {
    render(<AccessGate expectedHash="" development={false}><p>Private review</p></AccessGate>);
    expect(screen.queryByText('Private review')).not.toBeInTheDocument();
    expect(screen.getByText(/access hash was supplied/)).toBeInTheDocument();
  });
});
