import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Tanken',
  description: 'Diesel- und Spritpreise in deiner Naehe',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tanken'
  }
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(function(){try{var d=document.documentElement;var t=JSON.parse(localStorage.getItem('tank_settings')||'{}').theme;if(t&&t!=='auto')d.setAttribute('data-theme',t);var ua=navigator.userAgent||'';var isIOS=/iPhone|iPad|iPod/i.test(ua)||(/MacIntel/i.test(navigator.platform||'')&&navigator.maxTouchPoints>1);var isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;if(isIOS&&isStandalone)d.setAttribute('data-ios-pwa','true')}catch(e){}}())` }} />
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      {children}
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="beforeInteractive" />
      <Script src="/web-haptics.js" strategy="beforeInteractive" />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
