import React, { useState } from 'react';
import { AuthProvider } from './app/providers/AuthContext';
import { Navbar } from './shared/components/Navbar';
import { HomePage } from './features/home/HomePage';
import { AuthModal } from './features/auth/AuthModal';

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
        <div style={{ flex: 1 }}>
          <HomePage />
        </div>
        <footer style={{
          backgroundColor: 'white',
          borderTop: '1px solid var(--border)',
          padding: '2rem 0',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.875rem'
        }}>
          <div className="container">
            © {new Date().getFullYear()} FreshCart Grocery Platform. All rights reserved.
          </div>
        </footer>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </AuthProvider>
  );
};
