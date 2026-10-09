import React, { useState } from 'react';

type AdminTab = 'overview' | 'stores' | 'orders' | 'riders' | 'users';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [stores, setStores] = useState([
    { id: 's1', name: 'Fresh Harvest Market', owner: 'John Doe', city: 'Downtown', status: 'ACTIVE', orders: 48, rating: 4.8 },
    { id: 's2', name: 'Green Valley Organics', owner: 'Maria Garcia', city: 'Westside', status: 'ACTIVE', orders: 32, rating: 4.9 },
    { id: 's3', name: 'Artisan Bakery & Dairy', owner: 'Liam Smith', city: 'East Bay', status: 'PENDING_APPROVAL', orders: 0, rating: 5.0 },
  ]);

  const [riders, setRiders] = useState([
    { id: 'r1', name: 'Alex Mercer', phone: '+1 555-0192', vehicle: 'Motorbike', isOnline: true, isBusy: true, activeOrder: 'ORD-1712-4912', rating: 4.9 },
    { id: 'r2', name: 'Carlos Ramos', phone: '+1 555-0143', vehicle: 'Scooter', isOnline: true, isBusy: false, activeOrder: 'None', rating: 4.8 },
    { id: 'r3', name: 'James Wilson', phone: '+1 555-0178', vehicle: 'Bicycle', isOnline: false, isBusy: false, activeOrder: 'None', rating: 4.7 },
  ]);

  const approveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status: 'ACTIVE' } : s))
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚙️</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Admin Portal</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'overview' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            📊 Operations Overview
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'stores' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'stores' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            🏪 Merchant Stores ({stores.length})
          </button>

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
              color: activeTab === 'orders' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            📦 Global Orders & Dispatch
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'riders' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: activeTab === 'riders' ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            🛵 Delivery Partners ({riders.length})
          </button>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          Platform Environment: Production Ready
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Platform Operations</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Central administration for merchants, deliveries, and catalog.</p>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <section>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Active Stores</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{stores.filter(s => s.status === 'ACTIVE').length}</h3>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Live Orders Today</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>148</h3>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Online Delivery Riders</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>
                  {riders.filter(r => r.isOnline).length} / {riders.length}
                </h3>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Gross Order Volume</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>$4,280</h3>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Platform System Health</h3>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
                <div>● Core API: <strong style={{ color: '#16a34a' }}>UP (Port 8080)</strong></div>
                <div>● Realtime WebSockets: <strong style={{ color: '#16a34a' }}>UP (Port 3001)</strong></div>
                <div>● Notification Service: <strong style={{ color: '#16a34a' }}>UP (Port 3002)</strong></div>
                <div>● Redis Pub/Sub: <strong style={{ color: '#16a34a' }}>CONNECTED</strong></div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Stores */}
        {activeTab === 'stores' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Registered Merchant Stores</h2>
              <button className="btn btn-primary">+ Onboard Merchant</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Store Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Owner</th>
                    <th style={{ padding: '0.75rem 1rem' }}>City</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Orders</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)' }}>{s.owner}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{s.city}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{s.orders}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>⭐ {s.rating}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          backgroundColor: s.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                          color: s.status === 'ACTIVE' ? '#15803d' : '#b45309',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                        }}>
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        {s.status === 'PENDING_APPROVAL' ? (
                          <button
                            onClick={() => approveStore(s.id)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}
                          >
                            Approve Store
                          </button>
                        ) : (
                          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}>
                            Manage
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 3: Global Orders */}
        {activeTab === 'orders' && (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Global Orders & Dispatch Stream</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Order Number</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Store</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Delivery Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>ORD-1712-4912</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Fresh Harvest Market</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>$17.26</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>PAID</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>ASSIGNED (Alex Mercer)</span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>ORD-1712-5034</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Fresh Harvest Market</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>$14.96</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>PAID</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>PREPARING</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 4: Riders */}
        {activeTab === 'riders' && (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Delivery Fleet Status</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem' }}>Rider Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Vehicle</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Availability</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Active Task</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)' }}>{r.phone}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{r.vehicle}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          backgroundColor: r.isOnline ? (r.isBusy ? '#fed7aa' : '#dcfce7') : '#f1f5f9',
                          color: r.isOnline ? (r.isBusy ? '#c2410c' : '#15803d') : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                        }}>
                          {r.isOnline ? (r.isBusy ? '● BUSY (ON DELIVERY)' : '● ONLINE (IDLE)') : '○ OFFLINE'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{r.activeOrder}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>⭐ {r.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
