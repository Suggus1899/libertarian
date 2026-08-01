'use client';

import { Link } from '@/i18n/routing';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variantMap: Record<Variant, string> = {
  primary: 'btn-p',
  secondary: 'btn-g',
  outline: 'btn-o',
};

export function Button({
  href,
  onClick,
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const classes = `${variantMap[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href as Parameters<typeof Link>[0]['href']} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
