'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SubscriptionModal from '@/components/SubscriptionModal';

interface UserSettings {
  name: string;
  email: string;
  subscription: {
    status: string;
    stripeCustomerId: string;
  } | null;
  credits: number;
}

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
      setName(data.name || '');
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUpdateSuccess(false);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      setUpdateSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to create portal session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError('Failed to open subscription portal');
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete account');
      
      // Sign out and redirect to home page
      router.push('/api/auth/signout?callbackUrl=/');
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="h4 mb-4 text-dark">Settings</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {updateSuccess && (
            <div className="alert alert-success" role="alert">
              Profile updated successfully!
            </div>
          )}

          <div className="card bg-white mb-4">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 text-dark">Profile Information</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label text-dark">Name</label>
                  <input
                    type="text"
                    className="form-control bg-white text-dark border-secondary"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-dark">Email</label>
                  <input
                    type="email"
                    className="form-control bg-white text-dark border-secondary"
                    id="email"
                    value={settings?.email}
                    disabled
                  />
                </div>
                <button type="submit" className="btn btn-gradient">
                  Update Profile
                </button>
              </form>
            </div>
          </div>

          <div className="card bg-white mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0 text-dark">Subscription</h3>
                <span className={`badge ${settings?.subscription?.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                  {settings?.subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-dark mb-3">
                {settings?.subscription?.status === 'active'
                  ? 'You currently have an active Pro subscription.'
                  : `You have ${settings?.credits} credits remaining. Upgrade to Pro for unlimited access.`}
              </p>
              <button
                onClick={() => settings?.subscription?.status === 'active' 
                  ? handleManageSubscription() 
                  : setShowSubscriptionModal(true)}
                className="btn btn-gradient"
              >
                {settings?.subscription?.status === 'active'
                  ? 'Manage Subscription'
                  : 'Upgrade to Pro'}
              </button>
            </div>
          </div>

          <div className="card bg-white">
            <div className="card-body p-4">
              <h3 className="h5 mb-3 text-dark">Danger Zone</h3>
              <p className="text-dark mb-3">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-outline-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-glass">
              <div className="modal-header border-0">
                <h5 className="modal-title">Delete Account</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </div>
  );
} 