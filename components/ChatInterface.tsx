'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import FileUpload from './FileUpload';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  detectability?: number;
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch subscription status when component mounts
    if (session) {
      fetch('/api/user/settings')
        .then(res => res.json())
        .then(data => {
          setHasSubscription(data.subscription?.status === 'active');
        })
        .catch(err => console.error('Error fetching subscription status:', err));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: session?.user?.email,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        detectability: data.detectability,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="text-center">
              <h2 className="text-gradient mb-3">Welcome to ChatGPT Pro</h2>
              <p className="text-muted">
                Start a conversation with our advanced AI assistant.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${
                message.role === 'user' ? 'user' : 'ai'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="ai-badge">AI</div>
              )}
              <div className="message-bubble">
                <p>{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message-container ai">
            <div className="ai-badge">AI</div>
            <div className="message-bubble typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FileUpload isSubscribed={hasSubscription} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 