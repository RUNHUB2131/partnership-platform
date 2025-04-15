import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@/RUNHUB Logo (1).png';

interface RunhubLogoProps extends HTMLAttributes<HTMLImageElement> {
  variant?: 'default' | 'small';
}

export function RunhubLogo({ 
  className, 
  variant = 'default',
  ...props 
}: RunhubLogoProps) {
  return (
    <img
      src={logoImage}
      alt="RUNHUB"
      className={cn(
        'h-auto',
        variant === 'default' ? 'w-32' : 'w-24',
        className
      )}
      {...props}
    />
  );
}