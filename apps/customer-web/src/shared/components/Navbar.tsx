import React, { useState } from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import {
  SearchIcon,
  CartIcon,
  LocationIcon,
  UserIcon,
  ChevronDownIcon,
  LeafIcon
} from './Icons';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  onSearchChange?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CATEGORY_TABS = [
  'All Groceries',
  'Fresh Produce',
  'Dairy & Eggs',
  'Bakery',
  'Pantry & Staples',
  'Beverages',
  'Snacks'
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenCart,
  cartCount = 0,
  onSearchChange,
  selectedCategory = 'All Groceries',
  onSelectCategory,
}) => {
  const { user, logout } = useAuth();
  const [address, setAddress] = useState('Kathmandu, Ward 4 (Baneshwor)');
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  return (
    <header style={{
      backgroundColor: 'var(--color-white)',
      borderBottom: '1px solid var(--color-gray-cool)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Top Banner Notice */}
      <div style={{
        backgroundColor: 'var(--color-navy)',
        color: 'var(--color-white)',
        fontSize: '0.75rem',
        padding: '0.4rem 0',
        fontWeight: 500,
        textAlign: 'center',
        letterSpacing: '0.01em'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚡ Lightning Delivery: Fresh groceries delivered to your door in 20-30 minutes</span>
          <span style={{ opacity: 0.85, display: 'none' }}>Hotline: +977 01-4491023</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.75rem',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-emerald)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 168, 107, 0.3)'
            }}>
              <LeafIcon size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--color-navy)'
              }}>
                FreshCart<span style={{ color: 'var(--color-primary)' }}>.</span>
              </div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-gray-slate)', letterSpacing: '0.04em' }}>
                GROCERY EXPRESS
              </div>
            </div>
          </div>

          {/* Location Selector Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLocationSelect(!showLocationSelect)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.875rem',
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-gray-cool)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--color-navy)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: 'all var(--transition-fast)'
              }}
            >
              <LocationIcon size={16} color="var(--color-primary)" />
              <div style={{ textAlign: 'left', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--color-gray-slate)', fontWeight: 500, fontSize: '0.6875rem', display: 'block' }}>Delivery to</span>
                {address}
              </div>
              <ChevronDownIcon size={14} color="var(--color-gray-slate)" />
            </button>

            {showLocationSelect && (
              <div style={{
                position: 'absolute',
                top: '115%',
                left: 0,
                width: '260px',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-gray-cool)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem',
                zIndex: 60
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gray-slate)', marginBottom: '0.5rem' }}>
                  Select Delivery Location
                </div>
                {['Kathmandu, Ward 4 (Baneshwor)', 'Lalitpur, Ward 3 (Pulchowk)', 'Bhaktapur, Suryabinayak'].map((loc) => (
                  <div
                    key={loc}
                    onClick={() => { setAddress(loc); setShowLocationSelect(false); }}
                    style={{
                      padding: '0.5rem 0.625rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                      fontWeight: loc === address ? 700 : 500,
                      color: loc === address ? 'var(--color-primary)' : 'var(--color-navy)',
                      backgroundColor: loc === address ? 'var(--color-primary-soft)' : 'transparent',
                      cursor: 'pointer',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            <SearchIcon size={18} color="var(--color-gray-slate)" />
          </div>
          <input
            type="text"
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search fresh vegetables, dairy, farm eggs, fruits, bread..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-gray-cool)',
              backgroundColor: 'var(--color-gray-light)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast), background-color var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.backgroundColor = 'var(--color-white)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-gray-cool)';
              e.target.style.backgroundColor = 'var(--color-gray-light)';
            }}
          />
        </div>

        {/* Right Actions: User & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.875rem',
                backgroundColor: 'var(--color-gray-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-navy)'
              }}>
                <UserIcon size={16} color="var(--color-navy)" />
                <span>{user.firstName}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-outline"
              style={{ fontWeight: 700 }}
            >
              <UserIcon size={16} />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary Cart Action Button (Primary Orange #FF6B00) */}
          <button
            onClick={onOpenCart}
            className="btn btn-primary"
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700
            }}
          >
            <CartIcon size={18} color="#FFFFFF" />
            <span>Cart</span>
            <span style={{
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-primary)',
              padding: '0.125rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginLeft: '0.25rem'
            }}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation Sub-bar */}
      {onSelectCategory && (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderTop: '1px solid var(--color-gray-cool)',
          padding: '0.5rem 0'
        }}>
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '2px'
          }}>
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onSelectCategory(tab)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--color-white)' : 'var(--color-navy)',
                    backgroundColor: active ? 'var(--color-primary)' : 'var(--color-gray-light)',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-gray-cool)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
