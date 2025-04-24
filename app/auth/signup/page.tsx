'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Please sign in with your credentials.');
        // Wait 2 seconds before redirecting to show the success message
        setTimeout(() => {
          router.push('/auth/signin?registered=true');
        }, 2000);
      } else {
        setError(data.error || 'An error occurred during sign up');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card bg-glass">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4 text-gradient">Create Account</h2>
                <p className="text-center text-light-50 mb-4">
                  Join ChatGPT Pro and start your journey
                </p>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-light">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="form-control dark"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-light">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control dark"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-light">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control dark"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm spinner-border-light" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/auth/signin"
                      className="text-decoration-none text-primary"
                    >
                      Already have an account? Sign in
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 