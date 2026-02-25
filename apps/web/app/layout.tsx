import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'ProcureAI',
  description: 'Enterprise multi-tenant procurement platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
