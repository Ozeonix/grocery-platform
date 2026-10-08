import React from 'react';

export const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>⚙️ Admin Portal</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a href="#overview" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>📊 Operations Overview</a>
          <a href="#stores" style={{ color: '#94a3b8', textDecoration: 'none' }}>🏪 Merchant Stores</a>
          <a href="#orders" style={{ color: '#94a3b8', textDecoration: 'none' }}>📦 Orders & Dispatch</a>
          <a href="#riders" style={{ color: '#94a3b8', textDecoration: 'none' }}>🛵 Delivery Partners</a>
          <a href="#users" style={{ color: '#94a3b8', textDecoration: 'none' }}>👥 Users & Roles</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Platform Operations</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Central administration for merchants, deliveries, and catalog.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Active Stores</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>12</h3>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Live Orders Today</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>148</h3>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Online Delivery Riders</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>34</h3>
          </div>
          <div className="card">
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Gross Order Volume</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>$4,280</h3>
          </div>
        </div>
      </main>
    </div>
  );
};
