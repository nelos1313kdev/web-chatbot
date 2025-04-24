'use client';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Logo from '@/components/Logo';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

function Header() {
  const { data: session } = useSession();
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    if (session) {
      // Fetch user settings to check subscription status
      fetch('/api/user/settings')
        .then(res => res.json())
        .then(data => {
          setHasSubscription(data.subscription?.status === 'active');
        })
        .catch(err => console.error('Error fetching subscription status:', err));
    }
  }, [session]);

  return (
    <header className="fixed-top bg-white shadow-sm">
      <nav className="navbar navbar-expand">
        <div className="container">
          <Logo />
          {session && (
            <div className="ms-auto d-flex align-items-center">
              <span className="text-secondary me-3">{session.user?.email}</span>
              <Link href="/api/auth/signout" className="btn btn-outline-secondary me-2">
                Logout
              </Link>
              {!hasSubscription && (
                <Link href="/settings" className="btn btn-gradient">
                  Upgrade to Pro
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white antialiased">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <SessionProvider>
          <Header />
          <main className="pt-5 mt-5">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
} 