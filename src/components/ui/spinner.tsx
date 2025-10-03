import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'destructive';
}

const Spinner = ({ className, size = 'md', variant = 'default', ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const variantClasses = {
    default: 'text-primary',
    destructive: 'text-destructive',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <LoaderCircle className={cn('animate-spin', sizeClasses[size], variantClasses[variant])} />
    </div>
  );
};

export { Spinner };
