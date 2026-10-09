import React, { useState } from 'react';
import {
  StoreIcon,
  OrdersIcon,
  CatalogIcon,
  InventoryIcon,
  SettingsIcon,
  RiderIcon,
  KeyIcon,
  PlusIcon,
  ClockIcon,
  SearchIcon,
  RefreshIcon
} from './shared/components/Icons';

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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reserved: number;
  active: boolean;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [searchCatalog, setSearchCatalog] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Fresh Produce');
  const [newProdPrice, setNewProdPrice] = useState('2.99');
  const [newProdStock, setNewProdStock] = useState('50');

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
      items: 'Farm Fresh Milk (2x), Organic Spinach (1x)',
      total: 12.57,
      status: 'CONFIRMED',
      pickupOtp: '903125',
      placedTime: 'Just now',
    },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'Organic Cavendish Bananas', category: 'Fresh Produce', price: 1.99, stock: 120, reserved: 4, active: true },
    { id: 'p2', name: 'Farm Fresh Whole Milk', category: 'Dairy & Eggs', price: 4.29, stock: 85, reserved: 3, active: true },
    { id: 'p3', name: 'Artisan Rustic Sourdough', category: 'Bakery', price: 5.49, stock: 65, reserved: 1, active: true },
    { id: 'p4', name: 'Himalayan Organic Honey', category: 'Pantry', price: 8.99, stock: 40, reserved: 0, active: true },
    { id: 'p5', name: 'Cold-Pressed Mustard Oil', category: 'Oils & Ghee', price: 6.49, stock: 25, reserved: 0, active: true },
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

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 1.99,
      stock: parseInt(newProdStock, 10) || 50,
      reserved: 0,
      active: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
    setNewProdName('');
    setShowAddModal(false);
  };

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalReserved = products.reduce((acc, p) => acc + p.reserved, 0);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      p.category.toLowerCase().includes(searchCatalog.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-ivory)' }} className="store-layout">
      {/* Ozeonix Merchant Deep Navy Sidebar */}
      <aside
        style={{
          width: '270px',
          backgroundColor: 'var(--color-navy)',
          color: 'var(--color-white)',
          padding: '1.75rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        className="store-sidebar"
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--color-white)',
              boxShadow: '0 4px 10px rgba(0, 168, 107, 0.35)',
            }}
          >
            M
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--color-white)' }}>OZEONIX</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Merchant Terminal
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <OrdersIcon size={18} color="var(--color-white)" />
              <span>Live Orders Queue</span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'orders' ? 'rgba(255,255,255,0.25)' : 'var(--color-emerald)',
                fontWeight: 700,
              }}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'catalog' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'catalog' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <CatalogIcon size={18} color="var(--color-white)" />
            <span>Catalog & SKUs</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'inventory' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'inventory' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <InventoryIcon size={18} color="var(--color-white)" />
            <span>Stock & Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'settings' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'settings' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <SettingsIcon size={18} color="var(--color-white)" />
            <span>Store Profile & Hours</span>
          </button>
        </nav>

        {/* Store Identifier Pill */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--color-slate-light)',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--color-white)', marginBottom: '0.2rem' }}>Fresh Harvest Market</div>
          <div>Store ID: #SH-4819-KTM</div>
          <div style={{ color: 'var(--color-emerald)', marginTop: '0.25rem', fontWeight: 600 }}>Direct Integration: Live</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        {/* Top Store Status Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'var(--color-emerald-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StoreIcon size={22} color="var(--color-emerald)" />
              </div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
                Fresh Harvest Market
              </h1>
              <span className="badge badge-emerald">Ozeonix Verified Store</span>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              124 Market Street, Downtown Hub • Direct Dispatch Desk: +977 1-4567890
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setAcceptingOrders(!acceptingOrders)}
              className="btn"
              style={{
                backgroundColor: acceptingOrders ? 'var(--color-emerald-soft)' : 'var(--color-danger-soft)',
                color: acceptingOrders ? 'var(--color-emerald)' : 'var(--color-danger)',
                border: `1px solid ${acceptingOrders ? 'rgba(0,168,107,0.3)' : 'rgba(239,68,68,0.3)'}`,
                padding: '0.5rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: acceptingOrders ? 'var(--color-emerald)' : 'var(--color-danger)' }}></span>
              <span>{acceptingOrders ? 'ACCEPTING NEW ORDERS' : 'STORE PAUSED (OFFLINE)'}</span>
            </button>
          </div>
        </header>

        {/* Tab 1: Live Dispatch Queue */}
        {activeTab === 'orders' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  Active Dispatch & Packing Queue
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
                  Realtime customer orders for immediate picking, packing, and courier handover
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                <RefreshIcon size={14} color="var(--color-emerald)" />
                <span>Socket.IO Sync Active</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="store-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                  }}
                >
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {order.orderNumber}
                      </span>
                      <span
                        className={`badge ${
                          order.status === 'OUT_FOR_DELIVERY'
                            ? 'badge-emerald'
                            : order.status === 'PREPARING'
                            ? 'badge-orange'
                            : 'badge-navy'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ClockIcon size={13} />
                        {order.placedTime}
                      </span>
                    </div>

                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-navy)' }}>
                      Customer: {order.customerName}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', marginTop: '0.2rem' }}>
                      {order.items}
                    </p>

                    {order.riderName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                        <RiderIcon size={15} color="var(--color-emerald)" />
                        <span>Assigned Rider: {order.riderName}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Action Panel */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* OTP Box */}
                    <div
                      style={{
                        padding: '0.625rem 1rem',
                        backgroundColor: 'var(--color-emerald-soft)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(0, 168, 107, 0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-emerald)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <KeyIcon size={12} color="var(--color-emerald)" />
                        <span>Pickup OTP</span>
                      </div>
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                          color: 'var(--color-emerald)',
                          fontFamily: 'monospace',
                          marginTop: '0.15rem',
                        }}
                      >
                        {order.pickupOtp}
                      </div>
                    </div>

                    {/* Order Total & CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.625rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                        ${order.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => advanceOrderStatus(order.id)}
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.85rem',
                          padding: '0.5rem 1rem',
                          boxShadow: '0 4px 10px rgba(255, 107, 0, 0.2)',
                        }}
                      >
                        {order.status === 'CONFIRMED' && 'Start Preparing →'}
                        {order.status === 'PREPARING' && 'Mark Packed & Ready →'}
                        {order.status === 'READY_FOR_PICKUP' && 'Assign Partner →'}
                        {order.status === 'ASSIGNED' && 'Verify OTP & Handover →'}
                        {order.status === 'OUT_FOR_DELIVERY' && 'In Transit with Rider'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 2: Catalog & SKUs */}
        {activeTab === 'catalog' && (
          <section>
            <div className="store-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <input
                  type="text"
                  placeholder="Search products or categories..."
                  value={searchCatalog}
                  onChange={(e) => setSearchCatalog(e.target.value)}
                  className="input-control"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate)' }}>
                  <SearchIcon size={16} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)', fontWeight: 600 }}>
                  Showing {filteredProducts.length} items
                </span>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                  <PlusIcon size={16} color="var(--color-white)" />
                  <span>Add New SKU</span>
                </button>
              </div>
            </div>

            <div className="store-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="store-table">
                  <thead>
                    <tr>
                      <th>Product Title</th>
                      <th>Category</th>
                      <th>Unit Price</th>
                      <th>On-Hand Stock</th>
                      <th>Listing Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{p.name}</td>
                        <td style={{ color: 'var(--color-slate)' }}>{p.category}</td>
                        <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>${p.price.toFixed(2)}</td>
                        <td style={{ fontWeight: 600 }}>{p.stock} units</td>
                        <td>
                          <span className={`badge ${p.active ? 'badge-emerald' : 'badge-danger'}`}>
                            {p.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Stock & Inventory Management */}
        {activeTab === 'inventory' && (
          <section>
            {/* Inventory KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div className="store-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Catalog SKUs</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-navy)' }}>{products.length}</h3>
              </div>
              <div className="store-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Units in Stock</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-emerald)' }}>{totalStock}</h3>
              </div>
              <div className="store-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Reserved in Active Orders</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-primary)' }}>{totalReserved}</h3>
              </div>
              <div className="store-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Low Stock Alerts</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-navy)' }}>0</h3>
              </div>
            </div>

            <div className="store-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-cool-gray)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy)' }}>Quick Stock Adjustments</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>Instantly update physical shelf inventory</p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="store-table">
                  <thead>
                    <tr>
                      <th>Product Title</th>
                      <th>Available Stock</th>
                      <th>Reserved</th>
                      <th style={{ textAlign: 'right' }}>Quick Increment / Decrement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700 }}>{p.name}</td>
                        <td style={{ fontWeight: 800, color: 'var(--color-emerald)' }}>{p.stock}</td>
                        <td style={{ color: 'var(--color-slate)' }}>{p.reserved}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleAdjustStock(p.id, -10)}
                              className="btn btn-outline"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              -10
                            </button>
                            <button
                              onClick={() => handleAdjustStock(p.id, 10)}
                              className="btn btn-primary"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 }}
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
            </div>
          </section>
        )}

        {/* Tab 4: Store Profile Settings */}
        {activeTab === 'settings' && (
          <section className="store-card" style={{ maxWidth: '640px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
              Store Profile & Dispatch SLA
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Maintain operational compliance with Ozeonix delivery speed standards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Registered Merchant Name
                </label>
                <input
                  type="text"
                  defaultValue="Fresh Harvest Market"
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Operating Delivery Schedule
                </label>
                <input
                  type="text"
                  defaultValue="07:00 AM - 11:00 PM (Everyday)"
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Physical Warehouse / Storefront Location
                </label>
                <input
                  type="text"
                  defaultValue="124 Market Street, Downtown Hub, Kathmandu"
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Target Picking & Packing SLA
                </label>
                <select className="input-control" style={{ width: '100%' }} defaultValue="5">
                  <option value="5">Under 5 minutes (Express Grocery Tier)</option>
                  <option value="10">Under 10 minutes (Standard Tier)</option>
                  <option value="15">Under 15 minutes (Bulk Pack Tier)</option>
                </select>
              </div>

              <button className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                Save Profile Changes
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 40, 74, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
        >
          <div
            className="store-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Add New Catalog Product
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: 'var(--color-slate)',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Avocados (2 pack)"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Category
                </label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                >
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Snacks & Beverages">Snacks & Beverages</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="input-control"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="input-control"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Store Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
