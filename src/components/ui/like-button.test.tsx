import React from 'react';
import '../../../vitest.setup.ts';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LikeButton } from './like-button';

describe('LikeButton', () => {
  it('renders without crashing', () => {
    render(<LikeButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles like state on click', () => {
    render(<LikeButton />);
    const button = screen.getByRole('button');
    const heartIcon = button.querySelector('svg');

    // Initially not liked
    expect(heartIcon).toHaveClass('text-gray-400');

    // Click to like
    fireEvent.click(button);
    expect(heartIcon).toHaveClass('text-red-500 fill-red-500');

    // Click to unlike
    fireEvent.click(button);
    expect(heartIcon).toHaveClass('text-gray-400');
  });

  it('calls onLikeChange callback with the new state', () => {
    const onLikeChange = vi.fn();
    render(<LikeButton onLikeChange={onLikeChange} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(onLikeChange).toHaveBeenCalledWith(true);

    fireEvent.click(button);
    expect(onLikeChange).toHaveBeenCalledWith(false);
  });

  it('does not change state when readonly', () => {
    const onLikeChange = vi.fn();
    render(<LikeButton isLiked={false} onLikeChange={onLikeChange} readonly />);
    const button = screen.getByRole('button');
    const heartIcon = button.querySelector('svg');

    expect(heartIcon).toHaveClass('text-gray-400');

    fireEvent.click(button);
    expect(heartIcon).toHaveClass('text-gray-400');
    expect(onLikeChange).not.toHaveBeenCalled();
  });

  it('respects the initial isLiked prop', () => {
    render(<LikeButton isLiked={true} />);
    const button = screen.getByRole('button');
    const heartIcon = button.querySelector('svg');
    expect(heartIcon).toHaveClass('text-red-500 fill-red-500');
  });
});
