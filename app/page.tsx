'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Dashboard from '@/components/Dashboard';
import LoginModal from '@/components/LoginModal';
import SubscriptionModal from '@/components/SubscriptionModal';

export default function Home() {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border spinner-border-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-vh-100">
      <div className="container" style={{ marginTop: '6rem' }}>
        {session ? (
          <Dashboard />
        ) : (
          <div className="text-center py-5">
            <div className="animate-float">
              <h1 className="display-4 fw-bold text-gradient mb-4">
                Welcome to ChatGPT Pro
              </h1>
              <p className="lead text-light-50 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                Experience the next generation of AI conversation with undetectable text generation. 
                Start with 3 free prompts and unlock unlimited access with our Pro subscription.
              </p>
              <div className="d-flex justify-content-center gap-3 mb-5">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="btn btn-gradient btn-lg"
                >
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Get Started
                </button>
              </div>
              <div className="row g-4 justify-content-center" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="col-md-4">
                  <div className="card bg-glass hover-glow h-100">
                    <div className="card-body text-center p-4">
                      <div className="display-5 mb-3 text-gradient">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <h3 className="h5 mb-3">Undetectable Output</h3>
                      <p className="text-light-50 mb-0">Advanced algorithms ensure your text remains undetectable by AI detectors.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-glass hover-glow h-100">
                    <div className="card-body text-center p-4">
                      <div className="display-5 mb-3 text-gradient">
                        <i className="bi bi-lightning-charge"></i>
                      </div>
                      <h3 className="h5 mb-3">Lightning Fast</h3>
                      <p className="text-light-50 mb-0">Get instant responses powered by the latest AI technology.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-glass hover-glow h-100">
                    <div className="card-body text-center p-4">
                      <div className="display-5 mb-3 text-gradient">
                        <i className="bi bi-lock"></i>
                      </div>
                      <h3 className="h5 mb-3">Secure & Private</h3>
                      <p className="text-light-50 mb-0">Your conversations are encrypted and never stored or shared.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </main>
  );
} 