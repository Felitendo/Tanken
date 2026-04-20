import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Tanken',
  description: 'Diesel- und Spritpreise in deiner Nähe',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tanken'
  },
  openGraph: {
    title: 'Tanken',
    description: 'Diesel- und Spritpreise in deiner Nähe',
    type: 'website',
    locale: 'de_DE',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#007aff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=JSON.parse(localStorage.getItem('tank_settings')||'{}').theme;if(t&&t!=='auto')document.documentElement.setAttribute('data-theme',t)}catch(e){}}())` }} />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      {children}
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="beforeInteractive" />
      <Script src="/web-haptics.js" strategy="beforeInteractive" />
      <Script src="/coverage-outlines.js" strategy="beforeInteractive" />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
