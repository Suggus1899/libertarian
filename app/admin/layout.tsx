import { ReactNode } from 'react';
import { Metadata } from 'next';

// The admin panel must never be indexed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
