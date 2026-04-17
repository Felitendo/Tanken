import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './admin.css';

export const metadata: Metadata = {
  title: 'Tanken Admin',
  description: 'Konfiguration, Scanner und Authentifizierung verwalten.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      {children}
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
    </>
  );
}
