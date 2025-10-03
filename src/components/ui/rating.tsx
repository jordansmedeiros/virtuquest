'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Rating = ({
  className,
  value = 0,
  maxRating = 5,
  onRatingChange,
  readonly = false,
  size = 'md',
  ...props
}: RatingProps) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div
      className={cn('flex items-center space-x-1', className)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const rating = i + 1;
        const isFilled = rating <= (hoverRating || value);

        return (
          <button
            key={i}
            type="button"
            className={cn(
              'transition-colors',
              readonly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110',
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            )}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            disabled={readonly}
          >
            <Star className={cn(sizeClasses[size], isFilled && 'fill-current')} />
          </button>
        );
      })}
    </div>
  );
};

export { Rating };
