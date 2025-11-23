'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen relative">
        {/* Fundo SVG */}
        <svg
          className="absolute inset-0 w-full h-full -z-10"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
          <g fill="#052e16" opacity="0.65">
            <rect x="-100" y="0" width="400" height="400" rx="120" />
            <rect x="200" y="200" width="300" height="300" rx="80" />
            <rect x="550" y="50" width="350" height="350" rx="100" />
            <rect x="100" y="450" width="400" height="400" rx="150" />
          </g>
        </svg>

        {/* Conteúdo */}
        <Sidebar />
        <main className="flex-1 overflow-auto relative z-10">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
