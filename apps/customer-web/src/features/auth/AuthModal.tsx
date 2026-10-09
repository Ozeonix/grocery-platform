import React, { useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import { CloseIcon, ShieldCheckIcon } from '../../shared/components/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ email, password, firstName, lastName });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 40, 74, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 70,
      padding: '1.25rem'
    }}>
      <div className="card" style={{
        maxWidth: '440px',
        width: '100%',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: '2rem'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gray-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <CloseIcon size={16} />
        </button>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--color-gray-light)',
          borderRadius: 'var(--radius-md)',
          padding: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: !isRegister ? 'var(--color-white)' : 'transparent',
              color: !isRegister ? 'var(--color-navy)' : 'var(--color-gray-slate)',
              boxShadow: !isRegister ? 'var(--shadow-xs)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: isRegister ? 'var(--color-white)' : 'transparent',
              color: isRegister ? 'var(--color-navy)' : 'var(--color-gray-slate)',
              boxShadow: isRegister ? 'var(--shadow-xs)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Create Account
          </button>
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            {isRegister ? 'Welcome to FreshCart' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--color-gray-slate)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {isRegister
              ? 'Join today to enjoy fresh produce delivered in 20 minutes.'
              : 'Sign in to access your orders, tracking, and saved address.'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: 'var(--color-danger)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {isRegister && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Bhola"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-gray-cool)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dev"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-gray-cool)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bhola@ozeonix.com"
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-gray-cool)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 9800000000"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-gray-cool)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-gray-cool)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              marginTop: '0.5rem',
              fontWeight: 800,
              fontSize: '0.9375rem'
            }}
          >
            {submitting ? 'Authenticating...' : isRegister ? 'Create My Account' : 'Sign In to FreshCart'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.25rem',
          fontSize: '0.75rem',
          color: 'var(--color-gray-slate)'
        }}>
          <ShieldCheckIcon size={14} color="var(--color-emerald)" />
          <span>Secured by JWT Authentication & 256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
};
