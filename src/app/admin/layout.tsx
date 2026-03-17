import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Tanken Admin',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
