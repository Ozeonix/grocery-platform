import React, { useState } from 'react';
import { AuthProvider } from './app/providers/AuthContext';
import { Navbar } from './shared/components/Navbar';
import { HomePage } from './features/home/HomePage';
import { AuthModal } from './features/auth/AuthModal';
import { CartDrawer } from './features/cart/CartDrawer';
import { PaymentModal } from './features/payment/PaymentModal';
import { OrderTrackingModal } from './features/tracking/OrderTrackingModal';

interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItemData[]>([
    { id: 'p1', name: 'Organic Cavendish Bananas', price: 1.99, quantity: 2 },
    { id: 'p2', name: 'Farm Fresh Whole Milk', price: 4.29, quantity: 1 },
  ]);

  const [currentOrder, setCurrentOrder] = useState({
    id: 'ord_' + Date.now(),
    orderNumber: 'ORD-1712-4912',
    deliveryOtp: '749102',
  });

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setCartDrawerOpen(true);
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
  const deliveryFee = cartItems.length > 0 ? 3.99 : 0;
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCart={() => setCartDrawerOpen(true)}
          cartCount={cartCount}
        />

        <div style={{ flex: 1 }}>
          <HomePage onAddToCart={handleAddToCart} />
        </div>

        <footer style={{
          backgroundColor: 'white',
          borderTop: '1px solid var(--border)',
          padding: '2rem 0',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.875rem',
        }}>
          <div className="container">
            © {new Date().getFullYear()} FreshCart Grocery Platform. All rights reserved.
          </div>
        </footer>

        {/* Modals & Drawers */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

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
