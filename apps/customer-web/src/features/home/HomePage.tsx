import React, { useState, useMemo } from 'react';
import {
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  LeafIcon,
  StarIcon,
  PlusIcon,
  MinusIcon,
  CloseIcon
} from '../../shared/components/Icons';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  comparePrice?: number;
  badge?: string;
  badgeType?: 'fresh' | 'promo' | 'organic';
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  description: string;
}

const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'p1',
    name: 'Organic Cavendish Bananas',
    category: 'Fresh Produce',
    unit: '1 bunch (~1.2 kg)',
    price: 1.99,
    comparePrice: 2.49,
    badge: 'Farm Fresh',
    badgeType: 'fresh',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    description: 'Freshly harvested ripe organic bananas rich in potassium and dietary fiber. Sourced directly from local cooperative orchards.'
  },
  {
    id: 'p2',
    name: 'Pure Farm Whole Milk (A2)',
    category: 'Dairy & Eggs',
    unit: '1 Liter Glass Bottle',
    price: 3.49,
    comparePrice: 3.99,
    badge: '100% Organic',
    badgeType: 'organic',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    description: 'Unprocessed whole A2 farm milk from pasture-raised cows. Chilled within 1 hour of milking for ultimate sweetness and freshness.'
  },
  {
    id: 'p3',
    name: 'Artisan Rustic Sourdough Loaf',
    category: 'Bakery',
    unit: '500g Boule',
    price: 4.89,
    comparePrice: 5.50,
    badge: 'Daily Bake',
    badgeType: 'promo',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 64,
    inStock: true,
    description: 'Slow-fermented 36-hour sourdough with a caramelized crisp crust and open, airy crumb. Baked fresh every morning.'
  },
  {
    id: 'p4',
    name: 'Honeycrisp Apples',
    category: 'Fresh Produce',
    unit: '1 kg Box',
    price: 3.79,
    comparePrice: 4.49,
    badge: 'Top Pick',
    badgeType: 'fresh',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 110,
    inStock: true,
    description: 'Extra crispy, sweet, and juicy handpicked Honeycrisp apples with natural blush and vibrant aroma.'
  },
  {
    id: 'p5',
    name: 'Free-Range Brown Eggs',
    category: 'Dairy & Eggs',
    unit: 'Carton of 12 eggs',
    price: 3.99,
    comparePrice: 4.60,
    badge: 'Pasture-Raised',
    badgeType: 'organic',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 95,
    inStock: true,
    description: 'High-protein, golden-yolk eggs from hens raised outdoors on natural grains and seeds.'
  },
  {
    id: 'p6',
    name: 'Cold-Pressed Orange Juice',
    category: 'Beverages',
    unit: '500 ml Bottle',
    price: 2.99,
    comparePrice: 3.49,
    badge: 'No Added Sugar',
    badgeType: 'fresh',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 52,
    inStock: true,
    description: 'Pure Valencia oranges gently cold-pressed without concentrates, artificial preservatives, or added sweeteners.'
  },
  {
    id: 'p7',
    name: 'Himalayan Mixed Raw Nuts & Berries',
    category: 'Snacks',
    unit: '250g Pouch',
    price: 5.99,
    comparePrice: 6.99,
    badge: 'Superfood',
    badgeType: 'promo',
    image: 'https://images.unsplash.com/photo-1505253758473-96b3d5ebcd9a?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 73,
    inStock: true,
    description: 'Wholesome mix of California almonds, walnuts, pumpkin seeds, cranberries, and golden raisins.'
  },
  {
    id: 'p8',
    name: 'Organic Basmati Rice (Aged)',
    category: 'Pantry & Staples',
    unit: '2 kg Bag',
    price: 6.49,
    comparePrice: 7.20,
    badge: '2-Year Aged',
    badgeType: 'organic',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 119,
    inStock: true,
    description: 'Long-grain fragrant basmati rice naturally aged for 24 months for fluffy non-sticky grains after cooking.'
  }
];

const CATEGORIES_SHOWCASE = [
  { name: 'Fresh Produce', count: '65+ Items', icon: 'LeafIcon', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dairy & Eggs', count: '34+ Items', icon: 'ShieldCheckIcon', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80' },
  { name: 'Bakery', count: '28+ Items', icon: 'ClockIcon', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pantry & Staples', count: '52+ Items', icon: 'LeafIcon', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Beverages', count: '41+ Items', icon: 'TruckIcon', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
  { name: 'Snacks', count: '39+ Items', icon: 'StarIcon', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80' }
];

interface HomePageProps {
  onAddToCart?: (product: any) => void;
  cartItemsMap?: Record<string, number>;
  searchQuery?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  cartItemsMap = {},
  searchQuery = '',
  selectedCategory = 'All Groceries',
  onSelectCategory
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((item) => {
      const matchCategory =
        selectedCategory === 'All Groceries' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Hero Banner with Ozeonix Brand Colors */}
      <section style={{
        backgroundColor: 'var(--color-navy)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2.5rem',
        color: 'var(--color-white)',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1.4fr) 1fr',
        gap: '2.5rem',
        alignItems: 'center',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient decorative brand glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.22) 0%, rgba(4, 40, 74, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(0, 168, 107, 0.2)',
            border: '1px solid rgba(0, 168, 107, 0.35)',
            color: '#2FE09B',
            padding: '0.35rem 0.875rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <ClockIcon size={16} color="#2FE09B" />
            <span>Guaranteed 20-Minute Delivery to Your Door</span>
          </div>

          <h1 style={{
            fontSize: '2.625rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: 'var(--color-white)'
          }}>
            Farm-fresh produce & groceries, delivered in minutes.
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: '#CBD5E1',
            lineHeight: 1.6,
            maxWidth: '520px',
            marginBottom: '1.75rem'
          }}>
            Directly partnered with local valley farmers and premier neighborhood grocers. 100% cold-chain protected and hand-picked for peak freshness.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectCategory?.('Fresh Produce')}
              className="btn btn-primary btn-lg"
              style={{ fontWeight: 700 }}
            >
              <span>Explore Fresh Catalog</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.8125rem' }}>
              <ShieldCheckIcon size={18} color="var(--color-emerald)" />
              <span>Certified 100% Quality Guarantee</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 1
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Today's Fresh Harvest Metrics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>18 Mins</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Avg. Valley Delivery</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-emerald)' }}>48+ Stores</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verified Local Merchants</div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(0, 168, 107, 0.12)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0, 168, 107, 0.25)'
          }}>
            <TruckIcon size={20} color="var(--color-emerald)" />
            <div style={{ fontSize: '0.8125rem', color: '#E2E8F0' }}>
              Free delivery on all orders above <strong>$15.00</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Proposition Bar */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3.5rem'
      }}>
        {[
          { title: 'Farmer Sourced Direct', desc: 'Harvested under 12 hours ago', icon: LeafIcon, color: 'var(--color-emerald)' },
          { title: 'Cold-Chain Stored', desc: 'Temperature-controlled logistics', icon: ShieldCheckIcon, color: 'var(--color-navy)' },
          { title: 'Live Route Tracking', desc: 'Instant GPS delivery alerts', icon: TruckIcon, color: 'var(--color-primary)' },
          { title: 'Hassle-Free Returns', desc: 'Zero questions asked refund', icon: ClockIcon, color: 'var(--color-emerald)' },
        ].map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'var(--color-white)'
              }}
            >
              <div style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <IconComponent size={22} color={feat.color} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '0.125rem' }}>
                  {feat.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-slate)' }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Shop By Category Showcase */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
              Explore Grocery Departments
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)' }}>
              Curated everyday essentials organized for effortless weekly shopping
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem'
        }}>
          {CATEGORIES_SHOWCASE.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.name}
                onClick={() => onSelectCategory?.(cat.name)}
                className="card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-cool)',
                  backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'var(--color-white)',
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                  backgroundColor: 'var(--color-ivory)'
                }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-navy)',
                  marginBottom: '0.125rem'
                }}>
                  {cat.name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-slate)' }}>
                  {cat.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products Catalog Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-fresh">In-Stock Catalog</span>
              {selectedCategory !== 'All Groceries' && (
                <span className="badge badge-promo">{selectedCategory}</span>
              )}
            </div>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.25rem', letterSpacing: '-0.02em' }}>
              {selectedCategory === 'All Groceries' ? 'Featured Fresh Picks & Staples' : selectedCategory}
            </h2>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)' }}>
            Showing <strong>{filteredProducts.length}</strong> items
          </div>
        </div>

        {/* Empty state when query produces zero results */}
        {filteredProducts.length === 0 ? (
          <div className="card" style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'var(--color-white)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-ivory)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LeafIcon size={32} color="var(--color-gray-slate)" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              No matching groceries found
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)', maxWidth: '400px' }}>
              We couldn't find items matching "{searchQuery}". Try browsing all categories or check spelling.
            </p>
            <button
              onClick={() => onSelectCategory?.('All Groceries')}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProducts.map((prod) => {
              const currentQty = cartItemsMap[prod.id] || 0;
              const hasDiscount = prod.comparePrice && prod.comparePrice > prod.price;
              const discountPct = hasDiscount
                ? Math.round(((prod.comparePrice! - prod.price) / prod.comparePrice!) * 100)
                : 0;

              return (
                <div
                  key={prod.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.125rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Product Image & Badges */}
                  <div>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '180px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-ivory)',
                      marginBottom: '1rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedProduct(prod)}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      />

                      {/* Fresh/Promo Badge */}
                      {prod.badge && (
                        <div style={{ position: 'absolute', top: '0.625rem', left: '0.625rem' }}>
                          <span className={`badge ${prod.badgeType === 'organic' || prod.badgeType === 'fresh' ? 'badge-fresh' : 'badge-promo'}`}>
                            {prod.badge}
                          </span>
                        </div>
                      )}

                      {/* Discount Sticker */}
                      {hasDiscount && (
                        <div style={{
                          position: 'absolute',
                          top: '0.625rem',
                          right: '0.625rem',
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-white)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.6875rem',
                          fontWeight: 800
                        }}>
                          {discountPct}% OFF
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-slate)' }}>
                        {prod.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-cool)' }}>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        <StarIcon size={12} color="#F59E0B" />
                        <span>{prod.rating}</span>
                        <span style={{ color: 'var(--color-gray-slate)', fontWeight: 400 }}>({prod.reviewsCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => setSelectedProduct(prod)}
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-navy)',
                        lineHeight: 1.35,
                        marginBottom: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      {prod.name}
                    </h3>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-slate)', marginBottom: '1rem' }}>
                      {prod.unit}
                    </div>
                  </div>

                  {/* Pricing and Action Control */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--color-gray-cool)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                          ${prod.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-muted)', textDecoration: 'line-through' }}>
                            ${prod.comparePrice!.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                        In Stock • Express
                      </span>
                    </div>

                    {/* Primary Orange Add Button or Counter */}
                    {currentQty > 0 ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--color-primary-soft)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.25rem 0.5rem',
                        border: '1px solid var(--color-primary)'
                      }}>
                        <button
                          onClick={() => onAddToCart?.({ ...prod, quantityDelta: -1 })}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-primary)',
                            fontWeight: 800
                          }}
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-primary)', minWidth: '1.25rem', textAlign: 'center' }}>
                          {currentQty}
                        </span>
                        <button
                          onClick={() => onAddToCart?.({ ...prod, quantityDelta: 1 })}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-white)',
                            fontWeight: 800
                          }}
                        >
                          <PlusIcon size={14} color="#FFFFFF" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart?.(prod)}
                        className="btn btn-primary btn-sm"
                        style={{
                          borderRadius: 'var(--radius-full)',
                          padding: '0.5rem 1rem',
                          fontWeight: 700
                        }}
                      >
                        <PlusIcon size={14} color="#FFFFFF" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(4, 40, 74, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 80,
          padding: '1.25rem'
        }}>
          <div className="card" style={{
            maxWidth: '640px',
            width: '100%',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'var(--color-gray-light)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <CloseIcon size={16} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'center' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-ivory)',
                height: '240px'
              }}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <span className="badge badge-fresh" style={{ marginBottom: '0.5rem' }}>
                  {selectedProduct.category}
                </span>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.25 }}>
                  {selectedProduct.name}
                </h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)', margin: '0.25rem 0 1rem' }}>
                  Pack Size: <strong>{selectedProduct.unit}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.comparePrice && (
                    <span style={{ fontSize: '1rem', color: 'var(--color-gray-muted)', textDecoration: 'line-through' }}>
                      ${selectedProduct.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-slate)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {selectedProduct.description}
                </p>

                <button
                  onClick={() => {
                    onAddToCart?.(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
                >
                  <PlusIcon size={16} color="#FFFFFF" />
                  <span>Add to Grocery Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
