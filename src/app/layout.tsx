import Header from './header';
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="https://apis.google.com/js/api.js" />
      <body className={inter.className}><Header />{children}</body>
    </html>
  );
}
