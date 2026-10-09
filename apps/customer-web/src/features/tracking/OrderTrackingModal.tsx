import React, { useState, useEffect } from 'react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  deliveryOtp?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orderNumber = 'ORD-1712-4912',
  deliveryOtp = '839201',
}) => {
  const [currentStep, setCurrentStep] = useState(3); // 0 to 4
  const [etaMinutes, setEtaMinutes] = useState(18);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate realtime progress updates
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const STEPS = [
    { title: 'Order Confirmed', desc: 'Payment verified and sent to merchant', icon: '✅' },
    { title: 'Store Preparing', desc: 'Packing fresh items at Fresh Harvest Market', icon: '🏪' },
    { title: 'Rider Assigned', desc: 'Alex Mercer (Motorbike • KA-03-HA-8821)', icon: '🛵' },
    { title: 'Out for Delivery', desc: 'Rider is on the way to your doorstep', icon: '⚡' },
    { title: 'Delivered', desc: 'Handed over with secure OTP verification', icon: '🎉' },
  ];

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
        maxWidth: '560px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
            }}>
              ● LIVE REALTIME TRACKING
            </span>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginTop: '0.5rem' }}>
              Order #{orderNumber}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* ETA & OTP Banner */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <div>
            <span style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>Estimated Delivery</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
              ~{etaMinutes} Mins
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Delivery Verification OTP</span>
            <span style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: 'var(--primary)',
              backgroundColor: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}>
              {deliveryOtp}
            </span>
          </div>
        </div>

        {/* Live Rider Map Representation */}
        <div style={{
          height: '160px',
          backgroundColor: '#e2e8f0',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '2rem' }}>🗺️</div>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: '0.25rem', color: '#334155' }}>
            Live GPS Tracking Active
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Rider is 1.4 km away • Moving at ~26 km/h
          </span>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '0.2rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontWeight: 600,
          }}>
            📍 12.9716° N, 77.5946° E
          </div>
        </div>

        {/* Timeline Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {STEPS.map((step, idx) => {
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  backgroundColor: isDone ? 'var(--primary-light)' : '#f1f5f9',
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                <div>
                  <h4 style={{
                    fontSize: '0.9375rem',
                    fontWeight: isDone ? 700 : 500,
                    color: isDone ? 'var(--foreground)' : 'var(--muted)',
                  }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.125rem' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="btn btn-outline"
          style={{ width: '100%', marginTop: '2rem', padding: '0.75rem' }}
        >
          Close Tracking
        </button>
      </div>
    </div>
  );
};
