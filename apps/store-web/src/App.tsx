import React from 'react';

export const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#064e3b', color: 'white', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>🏪 Merchant Hub</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a href="#orders" style={{ color: '#6ee7b7', textDecoration: 'none', fontWeight: 600 }}>📦 Live Orders (3)</a>
          <a href="#catalog" style={{ color: '#a7f3d0', textDecoration: 'none' }}>🏷️ Catalog & Products</a>
          <a href="#inventory" style={{ color: '#a7f3d0', textDecoration: 'none' }}>📊 Stock & Inventory</a>
          <a href="#settings" style={{ color: '#a7f3d0', textDecoration: 'none' }}>⚙️ Store Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Fresh Harvest Market</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Store ID: f0000000-0000-0000-0000-000000000001</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              ● ACCEPTING ORDERS
            </span>
          </div>
        </header>

        {/* Inventory Overview */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Inventory Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card">
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Total SKUs</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>3</h3>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Units in Stock</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>270</h3>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Reserved in Active Orders</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>2</h3>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8125rem', color: '#ef4444' }}>Low Stock Alerts</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: '#ef4444' }}>0</h3>
            </div>
          </div>
        </section>

        {/* Live Orders & Dispatch */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Live Orders & Dispatch</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Auto-refreshed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Order #ORD-1712-4912</h4>
                  <span style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    ASSIGNED TO RIDER
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  2 items • $17.26 • Rider: Alex Mercer (Motorbike)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block' }}>Store Pickup OTP</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '0.1em', color: '#047857' }}>482910</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>
                  Handover to Rider
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
