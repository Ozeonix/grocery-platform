import React from 'react';

const CATEGORIES = [
  { id: '1', name: 'Fresh Produce', icon: '🥦', items: '45+ items' },
  { id: '2', name: 'Dairy & Eggs', icon: '🥛', items: '28+ items' },
  { id: '3', name: 'Bakery', icon: '🍞', items: '19+ items' },
  { id: '4', name: 'Beverages', icon: '🧃', items: '32+ items' },
  { id: '5', name: 'Snacks & Sweets', icon: '🍪', items: '50+ items' },
  { id: '6', name: 'Organic Pantry', icon: '🌾', items: '40+ items' }
];

const FEATURED_PRODUCTS = [
  { id: 'p1', name: 'Organic Cavendish Bananas', unit: 'bunch (~1.2 kg)', price: 1.99, compare: 2.49, badge: 'Popular' },
  { id: 'p2', name: 'Farm Fresh Whole Milk', unit: '1 Gallon', price: 4.29, compare: 4.89, badge: 'Fresh' },
  { id: 'p3', name: 'Artisan Rustic Sourdough', unit: '1 loaf (500g)', price: 5.49, compare: 5.99, badge: 'Daily Bake' },
  { id: 'p4', name: 'Crisp Honeycrisp Apples', unit: '1 kg bag', price: 3.99, compare: 4.50, badge: 'In Season' }
];

interface HomePageProps {
  onAddToCart?: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  return (
    <main className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2.5rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          width: 'fit-content'
        }}>
          ⚡ Lightning Delivery in Under 30 Mins
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, maxWidth: '600px' }}>
          Farm-fresh groceries delivered right to your doorstep.
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '520px' }}>
          Directly sourced from trusted local merchants and neighbourhood farmers.
        </p>
      </section>

      {/* Categories Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Shop by Category
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem'
        }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{cat.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{cat.items}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>
            Featured Fresh Picks
          </h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
            View all →
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {FEATURED_PRODUCTS.map((prod) => (
            <div key={prod.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-hover)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {prod.badge}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  {prod.unit}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>${prod.price.toFixed(2)}</span>
                  {prod.compare && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--muted)', textDecoration: 'line-through', marginLeft: '0.375rem' }}>
                      ${prod.compare.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onAddToCart?.(prod)}
                  className="btn btn-primary"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
