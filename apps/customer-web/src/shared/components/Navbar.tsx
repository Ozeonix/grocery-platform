import React from 'react';
import { useAuth } from '../../app/providers/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.25rem'
          }}>
            🛒
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            FreshCart<span style={{ color: 'var(--primary)' }}>.</span>
          </span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '480px', margin: '0 2rem' }}>
          <input
            type="text"
            placeholder="Search groceries, fruits, milk, organic vegetables..."
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              backgroundColor: '#f8fafc',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Hi, {user.firstName}!
              </span>
              <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary">
              Sign In
            </button>
          )}

          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🛍️</span>
            <span>Cart</span>
            <span style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-hover)',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>0</span>
          </button>
        </div>
      </div>
    </header>
  );
};
