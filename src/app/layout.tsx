import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OneStopCareers — AI Analytics Case Platform',
  description: 'Master analytical judgment through real business investigations. Built for Product Analysts, Business Analysts, and Data Analysts.',
  keywords: ['analytics', 'case study', 'product analyst', 'data analyst', 'portfolio'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div id="app-root" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
