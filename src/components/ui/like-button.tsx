'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const likeButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent',
      },
      size: {
        default: 'h-10 w-10',
        sm: 'h-9 w-9',
        lg: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface LikeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof likeButtonVariants> {
  isLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  readonly?: boolean;
}

const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  ({ className, variant, size, isLiked = false, onLikeChange, readonly = false, ...props }, ref) => {
    const [liked, setLiked] = React.useState(isLiked);

    const handleClick = () => {
      if (!readonly) {
        const newLikedState = !liked;
        setLiked(newLikedState);
        if (onLikeChange) {
          onLikeChange(newLikedState);
        }
      }
    };

    return (
      <button
        className={cn(likeButtonVariants({ variant, size, className }))}
        onClick={handleClick}
        disabled={readonly}
        ref={ref}
        {...props}
      >
        <Heart
          className={cn(
            'transition-colors',
            liked ? 'text-red-500 fill-red-500' : 'text-gray-400'
          )}
        />
        <span className="sr-only">Like</span>
      </button>
    );
  }
);
LikeButton.displayName = 'LikeButton';

export { LikeButton, likeButtonVariants };
