import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './admin.css';
import { ThemeSync } from './theme-sync';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Tanken Admin',
  description: 'Konfiguration, Scanner und Authentifizierung verwalten.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <ThemeSync />
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster richColors position="top-center" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
    </>
  );
}
