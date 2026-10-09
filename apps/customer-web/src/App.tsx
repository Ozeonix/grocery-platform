import React, { useState, useMemo } from 'react';
import { AuthProvider } from './app/providers/AuthContext';
import { Navbar } from './shared/components/Navbar';
import { HomePage } from './features/home/HomePage';
import { AuthModal } from './features/auth/AuthModal';
import { CartDrawer, CartItemView } from './features/cart/CartDrawer';
import { PaymentModal } from './features/payment/PaymentModal';
import { OrderTrackingModal } from './features/tracking/OrderTrackingModal';
import { LeafIcon, ShieldCheckIcon, TruckIcon } from './shared/components/Icons';

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Groceries');

  const [cartItems, setCartItems] = useState<CartItemView[]>([
    {
      id: 'p1',
      name: 'Organic Cavendish Bananas',
      price: 1.99,
      quantity: 2,
      unit: '1 bunch (~1.2 kg)',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: 'p2',
      name: 'Pure Farm Whole Milk (A2)',
      price: 3.49,
      quantity: 1,
      unit: '1 Liter Glass Bottle',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=120&q=80'
    },
  ]);

  const [currentOrder] = useState({
    id: 'ord_' + Date.now(),
    orderNumber: 'ORD-1712-4912',
    deliveryOtp: '749102',
  });

  const cartItemsMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const delta = product.quantityDelta || 1;
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          return prev.filter((item) => item.id !== product.id);
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          unit: product.unit,
          image: product.image
        }
      ];
    });
  };

  const handleUpdateQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? (subtotal >= 15 ? 0 : 2.99) : 0;
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + deliveryFee + tax;

  const handleProceedToCheckout = () => {
    setCartDrawerOpen(false);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (_result: any) => {
    setCartItems([]);
    setPaymentModalOpen(false);
    setOrderTrackingOpen(true);
  };

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-ivory)' }}>
        {/* Navigation Bar */}
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCart={() => setCartDrawerOpen(true)}
          cartCount={cartCount}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Floating Active Order Tracking Pill */}
        {orderTrackingOpen === false && (
          <div style={{
            backgroundColor: 'var(--color-navy)',
            color: 'var(--color-white)',
            padding: '0.625rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem'
          }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-fresh">Active Delivery</span>
                <span>Order #{currentOrder.orderNumber} is arriving soon • Rider on the way</span>
              </div>
              <button
                onClick={() => setOrderTrackingOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              >
                Track Live Map
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          <HomePage
            onAddToCart={handleAddToCart}
            cartItemsMap={cartItemsMap}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Upgraded Footer */}
        <footer style={{
          backgroundColor: 'var(--color-navy)',
          color: 'var(--color-white)',
          padding: '3.5rem 0 2rem',
          borderTop: '1px solid var(--color-gray-cool)'
        }}>
          <div className="container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LeafIcon size={16} color="#FFFFFF" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  FreshCart<span style={{ color: 'var(--color-primary)' }}>.</span>
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '280px' }}>
                Ozeonix-powered next-generation grocery platform delivering freshness in 20 minutes across the Kathmandu Valley.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-white)' }}>
                Departments
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Fresh Produce')}>Fresh Fruits & Vegetables</li>
                <li style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Dairy & Eggs')}>Farm Dairy & Free-Range Eggs</li>
                <li style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Bakery')}>Artisan Breads & Sourdough</li>
                <li style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Pantry & Staples')}>Organic Staples & Grains</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-white)' }}>
                Portals & Partners
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                <li><a href="http://localhost:3005" target="_blank" rel="noreferrer" style={{ color: '#94A3B8', textDecoration: 'none' }}>Merchant Hub (:3005)</a></li>
                <li><a href="http://localhost:3004" target="_blank" rel="noreferrer" style={{ color: '#94A3B8', textDecoration: 'none' }}>Admin Console (:3004)</a></li>
                <li><span style={{ color: 'var(--color-emerald)' }}>● Realtime API (:3001) Connected</span></li>
                <li><span style={{ color: 'var(--color-emerald)' }}>● Core API (:8080) Verified</span></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-white)' }}>
                Safe & Secure
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: '#94A3B8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheckIcon size={16} color="var(--color-emerald)" />
                  <span>100% Quality & Freshness Guarantee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TruckIcon size={16} color="var(--color-primary)" />
                  <span>Cold-Chain Express Fleet</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container" style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#64748B'
          }}>
            © {new Date().getFullYear()} FreshCart Grocery Platform by Ozeonix. All rights reserved.
          </div>
        </footer>

        {/* Modals & Drawers */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onCheckout={handleProceedToCheckout}
        />

        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          orderId={currentOrder.id}
          orderNumber={currentOrder.orderNumber}
          totalAmount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <OrderTrackingModal
          isOpen={orderTrackingOpen}
          onClose={() => setOrderTrackingOpen(false)}
          orderNumber={currentOrder.orderNumber}
          deliveryOtp={currentOrder.deliveryOtp}
        />
      </div>
    </AuthProvider>
  );
};
