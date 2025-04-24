'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface SubscriptionModalProps {
  onClose: () => void;
}

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content modal-dark">
          <div className="modal-header border-0">
            <h5 className="modal-title text-gradient">Upgrade to Pro</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="text-center mb-4">
              <p className="text-light-50">
                Unlock the full potential of ChatGPT Pro with our premium features
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100 bg-dark border-light">
                  <div className="card-body">
                    <h5 className="card-title text-gradient mb-4">Free Trial</h5>
                    <h2 className="card-price mb-3 text-light fs-1">$0<small className="text-light-50 fs-5">/month</small></h2>
                    <p className="text-light-50 mb-4">Perfect for testing the waters</p>
                    <ul className="list-unstyled mb-4">
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        Basic chat functionality
                      </li>
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        5 messages per day
                      </li>
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        Standard response time
                      </li>
                    </ul>
                    <button className="btn btn-outline-light w-100" disabled>
                      Current Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 bg-dark border-primary">
                  <div className="card-body">
                    <h5 className="card-title text-gradient mb-4">Pro Plan</h5>
                    <h2 className="card-price mb-3 text-light fs-1">$20<small className="text-light-50 fs-5">/month</small></h2>
                    <p className="text-light-50 mb-4">For power users and professionals</p>
                    <ul className="list-unstyled mb-4">
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        Unlimited messages
                      </li>
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        Priority response time
                      </li>
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        Advanced features access
                      </li>
                      <li className="mb-2 text-light">
                        <i className="bi bi-check2 text-success me-2"></i>
                        24/7 priority support
                      </li>
                    </ul>
                    <button
                      className="btn btn-gradient w-100"
                      onClick={handleSubscribe}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div className="spinner-border spinner-border-sm spinner-border-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Upgrade Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-light-50 mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 