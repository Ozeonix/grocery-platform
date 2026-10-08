import React from 'react';

export interface CartItemView {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItemView[];
  onClose: () => void;
  onUpdateQty: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 50
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Cart ({items.length})</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</span>
            <p style={{ fontWeight: 600 }}>Your cart is empty</p>
            <p style={{ fontSize: '0.875rem' }}>Add items from local stores to begin.</p>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{item.name}</h4>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>${item.price.toFixed(2)} each</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      className="btn btn-outline"
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      className="btn btn-outline"
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
