'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ChatHistory {
  id: string;
  content: string;
  response: string;
  createdAt: string;
  detectability: number;
}

export default function History() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchHistory();
    }
  }, [status]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/chat/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError('Failed to load chat history');
      console.error(err);
    } finally {
      setLoading(false);
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
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0 text-dark">Chat History</h2>
            <button 
              onClick={() => router.push('/chat')} 
              className="btn btn-gradient"
            >
              <i className="bi bi-plus-lg me-2"></i>
              New Chat
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {history.length === 0 ? (
            <div className="card bg-white">
              <div className="card-body text-center p-5">
                <i className="bi bi-chat-dots display-4 text-gradient mb-3"></i>
                <h3 className="h5 mb-3 text-dark">No Chat History</h3>
                <p className="text-secondary mb-4">Start a new chat to begin your conversation journey.</p>
                <button 
                  onClick={() => router.push('/chat')} 
                  className="btn btn-gradient"
                >
                  Start Chatting
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {history.map((chat) => (
                <div key={chat.id} className="col-12">
                  <div className="card bg-white hover-shadow">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h3 className="h6 mb-1 text-dark">{chat.content.substring(0, 100)}...</h3>
                          <div className="text-secondary">
                            {new Date(chat.createdAt).toLocaleDateString()} • 
                            Detectability: {(chat.detectability * 100).toFixed(1)}%
                          </div>
                        </div>
                        <button 
                          onClick={() => router.push(`/chat/${chat.id}`)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Chat
                        </button>
                      </div>
                      <p className="text-dark mb-0">
                        {chat.response.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 