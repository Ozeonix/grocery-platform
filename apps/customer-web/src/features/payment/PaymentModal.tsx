import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  orderNumber?: string;
  totalAmount: number;
  onPaymentSuccess: (paymentResult: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  totalAmount,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'CARD' | 'UPI' | 'CASH_ON_DELIVERY'>('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate/Trigger API payment call
      const token = method === 'CARD' ? `tok_${cardNumber.slice(-4)}` : method === 'UPI' ? upiId : 'cod_token';

      // Mock network latency for seamless realistic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      setCompleted(true);
      onPaymentSuccess({
        orderId,
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '1rem',
    }}>
      <div className="card" style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem',
      }}>
        {completed ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <span style={{ fontSize: '3.5rem' }}>🎉</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem', color: 'var(--primary)' }}>
              {method === 'CASH_ON_DELIVERY' ? 'Order Placed with COD!' : 'Payment Successful!'}
            </h3>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Order <strong>#{orderNumber || 'ORD-9831'}</strong> is confirmed and being prepared by the merchant.
            </p>
            <button
              onClick={() => {
                setCompleted(false);
                onClose();
              }}
              className="btn btn-primary"
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Track Order Live
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Complete Your Payment</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  Total Payable: <strong style={{ color: 'var(--foreground)' }}>${totalAmount.toFixed(2)}</strong>
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setMethod('CARD')}
                className={`btn ${method === 'CARD' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.625rem 0.25rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>💳</span>
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`btn ${method === 'UPI' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.625rem 0.25rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>📱</span>
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('CASH_ON_DELIVERY')}
                className={`btn ${method === 'CASH_ON_DELIVERY' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.625rem 0.25rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>💵</span>
                <span>Cash/COD</span>
              </button>
            </div>

            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {method === 'CARD' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Expires (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {method === 'UPI' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>UPI ID (VPA)</label>
                  <input
                    type="text"
                    placeholder="user@okhdfcbank"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginTop: '0.375rem' }}>
                    You will receive a payment prompt on your UPI app.
                  </span>
                </div>
              )}

              {method === 'CASH_ON_DELIVERY' && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border)',
                  fontSize: '0.875rem',
                  color: 'var(--muted)',
                }}>
                  💰 Pay with cash or UPI directly to our delivery partner when your grocery arrives.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
