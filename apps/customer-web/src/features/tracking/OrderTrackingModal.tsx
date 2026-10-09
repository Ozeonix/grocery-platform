import React, { useState, useEffect } from 'react';
import {
  CloseIcon,
  CheckIcon,
  TruckIcon,
  PhoneIcon,
  ShieldCheckIcon,
  StarIcon,
  LocationIcon
} from '../../shared/components/Icons';

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
  deliveryOtp = '749102',
}) => {
  const [currentStep] = useState(3); // 0 to 4
  const [etaMinutes, setEtaMinutes] = useState(16);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate ETA updates
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 12000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const STEPS = [
    { title: 'Order Verified', desc: 'Payment approved & routed to merchant store' },
    { title: 'Fresh Items Packed', desc: 'Fresh Harvest Market packed your harvest' },
    { title: 'Rider Dispatched', desc: 'Rider picked up order from grocery hub' },
    { title: 'Out for Delivery', desc: 'On route to your destination (2.1 km away)' },
    { title: 'Delivered', desc: 'Handover complete with secure OTP verification' },
  ];

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
        maxWidth: '560px',
        width: '100%',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        padding: '2rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
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

        {/* Header with Live ETA */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-fresh">
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-emerald)',
                display: 'inline-block'
              }} />
              LIVE DISPATCH
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-slate)' }}>
              Order #{orderNumber}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
                Arriving in {etaMinutes} Mins
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-slate)' }}>
                Estimated Delivery: Today at 8:45 PM
              </p>
            </div>

            {/* OTP Security Token */}
            <div style={{
              padding: '0.5rem 0.875rem',
              backgroundColor: 'var(--color-primary-soft)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', textTransform: 'uppercase' }}>
                Delivery OTP
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
                {deliveryOtp}
              </span>
            </div>
          </div>
        </div>

        {/* Simulated Route Tracking Map Canvas */}
        <div style={{
          height: '140px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-ivory)',
          border: '1px solid var(--color-gray-cool)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Stylized simulated road grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(var(--color-gray-cool) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            opacity: 0.6
          }} />

          {/* Route path line */}
          <div style={{
            position: 'absolute',
            width: '60%',
            height: '4px',
            backgroundColor: 'var(--color-emerald)',
            borderRadius: '2px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Store Icon */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-white)',
              border: '2px solid var(--color-navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translateX(-50%)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <ShieldCheckIcon size={14} color="var(--color-navy)" />
            </div>

            {/* Rider Pin */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(255, 107, 0, 0.4)'
            }}>
              <TruckIcon size={16} color="#FFFFFF" />
            </div>

            {/* Destination Pin */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-white)',
              border: '2px solid var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translateX(50%)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <LocationIcon size={14} color="var(--color-emerald)" />
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '0.625rem',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: 'var(--color-navy)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            Rider is 1.2 km away • Realtime GPS Active
          </div>
        </div>

        {/* Delivery Timeline Stepper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                {/* Step Connector Line */}
                {idx < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '24px',
                    left: '11px',
                    width: '2px',
                    height: 'calc(100% + 4px)',
                    backgroundColor: isCompleted ? 'var(--color-emerald)' : 'var(--color-gray-cool)'
                  }} />
                )}

                {/* Step Icon Indicator */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? 'var(--color-emerald)'
                    : isCurrent
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-cool)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  flexShrink: 0
                }}>
                  {isCompleted ? (
                    <CheckIcon size={14} color="#FFFFFF" />
                  ) : (
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800 }}>{idx + 1}</span>
                  )}
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: isCurrent ? 'var(--color-primary)' : 'var(--color-navy)'
                  }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-slate)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rider Card */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--color-ivory)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-gray-cool)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-navy)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              AM
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                  Alex Mercer
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                  <StarIcon size={12} color="#F59E0B" />
                  <span>4.9</span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-slate)' }}>
                Motorbike • BA 2 PA 4912
              </span>
            </div>
          </div>

          <a
            href="tel:+9779801020304"
            className="btn btn-outline btn-sm"
            style={{ fontWeight: 700, color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
          >
            <PhoneIcon size={14} color="var(--color-primary)" />
            <span>Call Rider</span>
          </a>
        </div>
      </div>
    </div>
  );
};
