'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="text-decoration-none">
      <div className="d-flex align-items-center">
        <div className="logo-icon me-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="logo-svg"
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient
                id="mainGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FF4D6A" />
                <stop offset="25%" stopColor="#FF3B7E" />
                <stop offset="50%" stopColor="#9C3FE4" />
                <stop offset="75%" stopColor="#4B6FE9" />
                <stop offset="100%" stopColor="#37DFD9" />
              </linearGradient>
              
              {/* Glow Effect */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                <feComposite in="SourceGraphic" operator="over" />
              </filter>
            </defs>

            {/* Main S Shape */}
            <path
              d="M160 80C160 60 145 45 125 45H95C75 45 60 60 60 80C60 100 75 115 95 115H105C125 115 140 130 140 150C140 170 125 185 105 185H75C55 185 40 170 40 150"
              stroke="url(#mainGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              filter="url(#glow)"
              fill="none"
            />

            {/* Decorative Circles */}
            <circle cx="165" cy="80" r="4" fill="#FF4D6A" />
            <circle cx="155" cy="65" r="3" fill="#FF3B7E" />
            <circle cx="170" cy="95" r="2" fill="#9C3FE4" />
            <circle cx="35" cy="150" r="4" fill="#37DFD9" />
            <circle cx="45" cy="165" r="3" fill="#4B6FE9" />
            <circle cx="30" cy="135" r="2" fill="#9C3FE4" />
          </svg>
        </div>
        <div className="logo-text">
          <span className="fw-bold fs-4 text-gradient-primary">ChatGPT</span>
          <span className="badge bg-gradient-secondary ms-1 fw-bold">Pro</span>
        </div>
      </div>
    </Link>
  );
} 