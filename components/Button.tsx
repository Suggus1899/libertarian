'use client';

import { Link } from '@/i18n/routing';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gold text-black hover:bg-gold-light focus:ring-gold',
  secondary:
    'bg-foreground text-background hover:bg-cream focus:ring-foreground',
  outline:
    'border border-foreground/30 text-foreground hover:border-gold hover:text-gold bg-transparent focus:ring-gold',
  ghost:
    'bg-transparent text-foreground hover:text-gold focus:ring-gold',
};

export function Button({
  href,
  onClick,
  variant = 'primary',
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const classes = `
    inline-flex items-center justify-center gap-2 px-6 py-3
    font-semibold text-sm tracking-wide uppercase transition
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    ${variantClasses[variant]}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href as Parameters<typeof Link>[0]['href']} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
