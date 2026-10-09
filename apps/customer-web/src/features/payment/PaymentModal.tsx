import React, { useState } from 'react';
import {
  CloseIcon,
  CreditCardIcon,
  WalletIcon,
  CashIcon,
  ShieldCheckIcon
} from '../../shared/components/Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  orderNumber?: string;
  totalAmount: number;
  onPaymentSuccess: (paymentResult: any) => void;
}

type PaymentMethodType = 'ESEWA' | 'KHALTI' | 'CARD' | 'CASH_ON_DELIVERY';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber = 'ORD-1712-4912',
  totalAmount,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethodType>('ESEWA');
  const [phoneOrId, setPhoneOrId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate/Trigger API payment processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      onPaymentSuccess({
        orderId,
        orderNumber,
        paymentMethod: method,
        status: method === 'CASH_ON_DELIVERY' ? 'PENDING' : 'CAPTURED',
        amount: totalAmount,
      });
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
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
        maxWidth: '480px',
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

        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-fresh" style={{ marginBottom: '0.35rem' }}>
            Order {orderNumber}
          </span>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
            Choose Payment Method
          </h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)' }}>Total to Pay:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: 'var(--color-danger)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Method Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'ESEWA', label: 'eSewa Mobile', icon: WalletIcon, color: '#60BB46' },
            { id: 'KHALTI', label: 'Khalti Wallet', icon: WalletIcon, color: '#5C2D91' },
            { id: 'CARD', label: 'Debit / Credit Card', icon: CreditCardIcon, color: 'var(--color-navy)' },
            { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: CashIcon, color: 'var(--color-primary)' },
          ].map((m) => {
            const isSelected = method === m.id;
            const IconComp = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id as PaymentMethodType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-cool)',
                  backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'var(--color-white)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--color-white)' : 'var(--color-gray-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComp size={18} color={m.color} />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form per Payment Method */}
        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(method === 'ESEWA' || method === 'KHALTI') && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                {method === 'ESEWA' ? 'eSewa ID / Registered Mobile' : 'Khalti Registered Mobile'}
              </label>
              <input
                type="text"
                required
                value={phoneOrId}
                onChange={(e) => setPhoneOrId(e.target.value)}
                placeholder="98XXXXXXXX"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-gray-cool)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-gray-slate)', marginTop: '0.25rem', display: 'block' }}>
                You will receive an instant verification push prompt on your wallet app.
              </span>
            </div>
          )}

          {method === 'CARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4000 1234 5678 9010"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
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
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
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
            </div>
          )}

          {method === 'CASH_ON_DELIVERY' && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-ivory)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-gray-cool)',
              fontSize: '0.8125rem',
              color: 'var(--color-navy)'
            }}>
              Pay with cash or scan dynamic QR on arrival. Exact change is appreciated!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '1rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Processing Transaction...' : `Confirm & Pay $${totalAmount.toFixed(2)}`}
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
          <span>PCI-DSS Level 1 Compliant • 256-Bit SSL Protection</span>
        </div>
      </div>
    </div>
  );
};
