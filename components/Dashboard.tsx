'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card bg-white">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 d-flex align-items-center text-dark">
                <i className="bi bi-chat-dots me-2"></i>
                New Chat
              </h3>
              <p className="text-secondary mb-3">Start a new conversation with ChatGPT Pro.</p>
              <Link href="/chat" className="btn btn-gradient w-100">
                Start Chat
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-white">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 d-flex align-items-center text-dark">
                <i className="bi bi-clock-history me-2"></i>
                Recent Chats
              </h3>
              <p className="text-secondary mb-3">View and continue your recent conversations.</p>
              <Link href="/history" className="btn btn-outline-primary w-100">
                View History
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-white">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 d-flex align-items-center text-dark">
                <i className="bi bi-gear me-2"></i>
                Settings
              </h3>
              <p className="text-secondary mb-3">Manage your account and preferences.</p>
              <Link href="/settings" className="btn btn-outline-primary w-100">
                Open Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-white">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 text-dark">Quick Stats</h3>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-chat-text fs-2 text-gradient me-3"></i>
                    <div>
                      <div className="text-secondary">Total Chats</div>
                      <div className="h4 mb-0 text-dark">24</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-clock fs-2 text-gradient me-3"></i>
                    <div>
                      <div className="text-secondary">Usage Time</div>
                      <div className="h4 mb-0 text-dark">3.5 hrs</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-stars fs-2 text-gradient me-3"></i>
                    <div>
                      <div className="text-secondary">Subscription</div>
                      <div className="h4 mb-0 text-dark">Pro</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 