import './globals.css';
import Providers from '@/components/Providers';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'INTELCHAIN — Follow Money. Understand Everything.',
  description: 'INTELCHAIN is an enterprise-grade blockchain intelligence platform. Track wallets, entities, whales, tokens, and money flows in real time.',
  manifest: '/manifest.webmanifest',
  themeColor: '#05070a',
  applicationName: 'INTELCHAIN',
  openGraph: {
    title: 'INTELCHAIN',
    description: 'Follow Money. Understand Everything.',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
