import React, { useState } from 'react';

type Tab = 'orders' | 'catalog' | 'inventory' | 'settings';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  items: string;
  total: number;
  status: 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'ASSIGNED' | 'OUT_FOR_DELIVERY';
  pickupOtp: string;
  riderName?: string;
  placedTime: string;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [acceptingOrders, setAcceptingOrders] = useState(true);

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ord-1',
      orderNumber: 'ORD-1712-4912',
      customerName: 'Sarah Jenkins',
      items: 'Organic Bananas (2x), Whole Milk (1x)',
      total: 17.26,
      status: 'ASSIGNED',
      pickupOtp: '482910',
      riderName: 'Alex Mercer (Motorbike)',
      placedTime: '12 mins ago',
    },
    {
      id: 'ord-2',
      orderNumber: 'ORD-1712-5034',
      customerName: 'David Chen',
      items: 'Honeycrisp Apples (1x), Rustic Sourdough (1x)',
      total: 14.96,
      status: 'PREPARING',
      pickupOtp: '619384',
      placedTime: '5 mins ago',
    },
    {
      id: 'ord-3',
      orderNumber: 'ORD-1712-5110',
      customerName: 'Emma Watson',
      items: 'Farm Fresh Milk (2x)',
      total: 12.57,
      status: 'CONFIRMED',
      pickupOtp: '903125',
      placedTime: 'Just now',
    },
  ]);

  const [products, setProducts] = useState([
    { id: 'p1', name: 'Organic Cavendish Bananas', category: 'Fresh Produce', price: 1.99, stock: 120, reserved: 4, active: true },
    { id: 'p2', name: 'Farm Fresh Whole Milk', category: 'Dairy & Eggs', price: 4.29, stock: 85, reserved: 3, active: true },
    { id: 'p3', name: 'Artisan Rustic Sourdough', category: 'Bakery', price: 5.49, stock: 65, reserved: 1, active: true },
  ]);

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === 'CONFIRMED') return { ...o, status: 'PREPARING' };
        if (o.status === 'PREPARING') return { ...o, status: 'READY_FOR_PICKUP' };
        if (o.status === 'READY_FOR_PICKUP') return { ...o, status: 'ASSIGNED', riderName: 'Alex Mercer (Motorbike)' };
        if (o.status === 'ASSIGNED') return { ...o, status: 'OUT_FOR_DELIVERY' };
        return o;
      })
    );
  };

  const handleAdjustStock = (prodId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalReserved = products.reduce((acc, p) => acc + p.reserved, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#064e3b', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏪</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Merchant Hub</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'orders' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'orders' ? '#6ee7b7' : '#a7f3d0',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            📦 Live Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'catalog' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'catalog' ? '#6ee7b7' : '#a7f3d0',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            🏷️ Catalog & Products
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'inventory' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'inventory' ? '#6ee7b7' : '#a7f3d0',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            📊 Stock & Inventory
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'settings' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'settings' ? '#6ee7b7' : '#a7f3d0',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            ⚙️ Store Settings
          </button>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.75rem', color: '#a7f3d0' }}>
          Store ID: f0000000-0000-0000-0000-000000000001
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Fresh Harvest Market</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>124 Market Street, Downtown • Contact: (555) 234-5678</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setAcceptingOrders(!acceptingOrders)}
              className="btn"
              style={{
                backgroundColor: acceptingOrders ? '#d1fae5' : '#fee2e2',
                color: acceptingOrders ? '#065f46' : '#991b1b',
                padding: '0.375rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ● {acceptingOrders ? 'ACCEPTING ORDERS' : 'PAUSED'}
            </button>
          </div>
        </header>

        {/* Tab 1: Live Orders & Dispatch */}
        {activeTab === 'orders' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Dispatch Queue</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Realtime orders ready for packing and rider pickup</p>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Auto-refreshed (WebSocket)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => (
                <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{order.orderNumber}</h4>
                      <span style={{
                        backgroundColor: order.status === 'OUT_FOR_DELIVERY' ? '#dcfce7' : '#e0f2fe',
                        color: order.status === 'OUT_FOR_DELIVERY' ? '#15803d' : '#0369a1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                      }}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>• {order.placedTime}</span>
                    </div>

                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.25rem' }}>Customer: {order.customerName}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{order.items}</p>
                    {order.riderName && (
                      <p style={{ fontSize: '0.8125rem', color: '#047857', fontWeight: 600, marginTop: '0.25rem' }}>
                        🛵 Rider: {order.riderName}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Store Pickup OTP</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.1em', color: '#047857' }}>
                        {order.pickupOtp}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>${order.total.toFixed(2)}</span>
                      <button
                        onClick={() => advanceOrderStatus(order.id)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8125rem', padding: '0.375rem 0.875rem' }}
                      >
                        {order.status === 'CONFIRMED' && 'Start Preparing →'}
                        {order.status === 'PREPARING' && 'Mark Ready →'}
                        {order.status === 'READY_FOR_PICKUP' && 'Assign Rider →'}
                        {order.status === 'ASSIGNED' && 'Handover (Verify OTP) →'}
                        {order.status === 'OUT_FOR_DELIVERY' && 'In Transit'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 2: Catalog & Products */}
        {activeTab === 'catalog' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Store Catalog</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Manage active catalog items and customer pricing</p>
              </div>
              <button className="btn btn-primary">+ Add New Product</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Product Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Current Stock</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)' }}>{p.category}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.stock} units</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          backgroundColor: p.active ? '#dcfce7' : '#fee2e2',
                          color: p.active ? '#15803d' : '#991b1b',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                        }}>
                          {p.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 3: Stock & Inventory */}
        {activeTab === 'inventory' && (
          <section>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Total SKUs</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{products.length}</h3>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Units in Stock</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{totalStock}</h3>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Reserved in Active Orders</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{totalReserved}</h3>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: '#ef4444' }}>Low Stock Alerts</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: '#ef4444' }}>0</h3>
              </div>
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Stock Adjustment</h3>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Available Stock</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Reserved</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Adjust Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{p.stock}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)' }}>{p.reserved}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleAdjustStock(p.id, -10)}
                            className="btn btn-outline"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, 10)}
                            className="btn btn-outline"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 4: Store Settings */}
        {activeTab === 'settings' && (
          <section className="card" style={{ maxWidth: '600px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Store Profile & Operating Hours</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Store Name</label>
                <input
                  type="text"
                  defaultValue="Fresh Harvest Market"
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Business Hours</label>
                <input
                  type="text"
                  defaultValue="08:00 AM - 10:00 PM (Daily)"
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Operating Address</label>
                <input
                  type="text"
                  defaultValue="124 Market Street, Downtown"
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
              </div>
              <button className="btn btn-primary" style={{ width: 'fit-content', marginTop: '1rem' }}>Save Changes</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
