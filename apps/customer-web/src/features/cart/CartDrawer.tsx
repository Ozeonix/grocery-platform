import React, { useState } from 'react';
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckIcon,
  LocationIcon
} from '../../shared/components/Icons';

export interface CartItemView {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  image?: string;
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
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState<'express' | 'evening'>('express');
  const [selectedAddress] = useState('Home: Kathmandu, Ward 4');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 15.0;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : 2.99;
  const discount = promoApplied ? subtotal * 0.10 : 0; // 10% promo
  const tax = (subtotal - discount) * 0.05;
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  const amountNeededForFree = Math.max(0, 15.0 - subtotal);
  const freeProgressPercent = Math.min(100, Math.round((subtotal / 15.0) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FRESH10' || promoCode.trim().toUpperCase() === 'OZEONIX') {
      setPromoApplied(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 40, 74, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 60
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--color-white)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-xl)',
        animation: 'slideIn 0.25s ease'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-gray-cool)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-ivory)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
              Your Grocery Basket
            </h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-slate)' }}>
              {items.length} {items.length === 1 ? 'unique product' : 'unique products'}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-gray-cool)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Free Delivery Goal Bar */}
        {items.length > 0 && (
          <div style={{
            padding: '0.875rem 1.5rem',
            backgroundColor: isFreeDelivery ? 'var(--color-emerald-soft)' : 'var(--color-primary-soft)',
            borderBottom: '1px solid var(--color-gray-cool)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: isFreeDelivery ? 'var(--color-emerald-hover)' : 'var(--color-primary-hover)',
              marginBottom: '0.375rem'
            }}>
              <span>
                {isFreeDelivery ? '🎉 You qualify for FREE Delivery!' : `Add $${amountNeededForFree.toFixed(2)} more for FREE Delivery`}
              </span>
              <span>{freeProgressPercent}%</span>
            </div>
            <div style={{
              height: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${freeProgressPercent}%`,
                backgroundColor: isFreeDelivery ? 'var(--color-emerald)' : 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        {items.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-ivory)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <TruckIcon size={32} color="var(--color-gray-slate)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
              Your basket is empty
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)', maxWidth: '280px', marginBottom: '1.5rem' }}>
              Explore fresh farm harvests and daily groceries to build your order.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-cool)',
                    borderRadius: 'var(--radius-md)',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-ivory)',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=120&q=80'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', lineHeight: 1.25 }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-slate)' }}>
                        ${item.price.toFixed(2)} each {item.unit ? `• ${item.unit}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--color-gray-cool)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.15rem 0.35rem',
                      backgroundColor: 'var(--color-gray-light)'
                    }}>
                      <button
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        style={{ padding: '0.2rem', color: 'var(--color-navy)' }}
                        title="Reduce quantity"
                      >
                        {item.quantity === 1 ? <TrashIcon size={13} color="var(--color-danger)" /> : <MinusIcon size={13} />}
                      </button>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, minWidth: '1.5rem', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        style={{ padding: '0.2rem', color: 'var(--color-navy)' }}
                        title="Add quantity"
                      >
                        <PlusIcon size={13} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-navy)', minWidth: '50px', textAlign: 'right' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Details Selector */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--color-ivory)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-gray-cool)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <LocationIcon size={16} color="var(--color-primary)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                  Delivery Address:
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-slate)' }}>
                  {selectedAddress}
                </span>
              </div>

              {/* Delivery Slot Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setDeliverySlot('express')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: deliverySlot === 'express' ? '2px solid var(--color-emerald)' : '1px solid var(--color-gray-cool)',
                    backgroundColor: deliverySlot === 'express' ? 'var(--color-emerald-soft)' : 'var(--color-white)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: deliverySlot === 'express' ? 'var(--color-emerald-hover)' : 'var(--color-navy)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Express (20 Mins)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliverySlot('evening')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: deliverySlot === 'evening' ? '2px solid var(--color-navy)' : '1px solid var(--color-gray-cool)',
                    backgroundColor: deliverySlot === 'evening' ? 'rgba(4, 40, 74, 0.08)' : 'var(--color-white)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-navy)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  🌅 Evening (6-8 PM)
                </button>
              </div>
            </div>

            {/* Promo Voucher */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code (e.g. OZEONIX)"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-gray-cool)',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-outline btn-sm"
                style={{ fontWeight: 700 }}
              >
                Apply
              </button>
            </form>

            {promoApplied && (
              <div style={{
                backgroundColor: 'var(--color-emerald-soft)',
                color: 'var(--color-emerald-hover)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <CheckIcon size={14} />
                <span>10% Promo discount applied successfully!</span>
              </div>
            )}

            {/* Bill Summary */}
            <div style={{
              borderTop: '1px solid var(--color-gray-cool)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-slate)' }}>
                <span>Item Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {promoApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-emerald)' }}>
                  <span>Promo Voucher (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-slate)' }}>
                <span>Express Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--color-emerald)' }}>FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-slate)' }}>
                <span>Standard VAT (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div style={{
                borderTop: '1px dashed var(--color-gray-cool)',
                paddingTop: '0.75rem',
                marginTop: '0.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.125rem',
                fontWeight: 800,
                color: 'var(--color-navy)'
              }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--color-gray-cool)',
            backgroundColor: 'var(--color-white)',
            boxShadow: '0 -4px 12px rgba(4, 40, 74, 0.05)'
          }}>
            <button
              onClick={onCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Proceed to Checkout</span>
              <span style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                ${total.toFixed(2)}
              </span>
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--color-gray-slate)'
            }}>
              <ShieldCheckIcon size={14} color="var(--color-emerald)" />
              <span>100% Encrypted & Safe Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
