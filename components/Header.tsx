'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className="navbar fixed-top">
      <div className="container-fluid px-4">
        <Link href="/" className="navbar-brand">
          ChatGPT Pro
        </Link>
        <div className="d-flex align-items-center gap-3">
          {session?.user?.email && (
            <span className="text-light opacity-75">
              {session.user.email}
            </span>
          )}
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn btn-outline-light btn-sm text-light opacity-75"
            >
              Logout
            </button>
          )}
          <Link
            href="/pricing"
            className="btn btn-sm ms-2 upgrade-btn"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </nav>
  );
} 