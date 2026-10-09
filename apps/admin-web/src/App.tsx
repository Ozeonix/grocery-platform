import React, { useState } from 'react';
import {
  OverviewIcon,
  StoreIcon,
  OrderIcon,
  RiderIcon,
  UsersIcon,
  CheckIcon,
  SearchIcon,
  PlusIcon,
  TrendingUpIcon,
  ActivityIcon,
  StarIcon,
  RefreshIcon
} from './shared/components/Icons';

type AdminTab = 'overview' | 'stores' | 'orders' | 'riders' | 'users';

interface Store {
  id: string;
  name: string;
  owner: string;
  city: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  orders: number;
  rating: number;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: 'Motorbike' | 'Scooter' | 'Bicycle';
  isOnline: boolean;
  isBusy: boolean;
  activeOrder: string;
  rating: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  store: string;
  amount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  deliveryStatus: 'PREPARING' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  riderName?: string;
  timestamp: string;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreOwner, setNewStoreOwner] = useState('');
  const [newStoreCity, setNewStoreCity] = useState('');

  const [stores, setStores] = useState<Store[]>([
    { id: 's1', name: 'Fresh Harvest Market', owner: 'John Doe', city: 'Downtown Kathmandu', status: 'ACTIVE', orders: 148, rating: 4.8 },
    { id: 's2', name: 'Green Valley Organics', owner: 'Maria Garcia', city: 'Lalitpur Hub', status: 'ACTIVE', orders: 92, rating: 4.9 },
    { id: 's3', name: 'Artisan Bakery & Dairy', owner: 'Liam Smith', city: 'Bhaktapur Gate', status: 'PENDING_APPROVAL', orders: 0, rating: 5.0 },
    { id: 's4', name: 'Himalayan Mountain Staples', owner: 'Rajesh Shrestha', city: 'New Baneshwor', status: 'ACTIVE', orders: 64, rating: 4.7 },
  ]);

  const [riders] = useState<Rider[]>([
    { id: 'r1', name: 'Alex Mercer', phone: '+977 980-1122334', vehicle: 'Motorbike', isOnline: true, isBusy: true, activeOrder: 'ORD-1712-4912', rating: 4.9 },
    { id: 'r2', name: 'Carlos Ramos', phone: '+977 980-2233445', vehicle: 'Scooter', isOnline: true, isBusy: false, activeOrder: 'Standby at Hub', rating: 4.8 },
    { id: 'r3', name: 'James Wilson', phone: '+977 980-3344556', vehicle: 'Bicycle', isOnline: false, isBusy: false, activeOrder: 'Offline', rating: 4.7 },
    { id: 'r4', name: 'Aayush Adhikari', phone: '+977 980-4455667', vehicle: 'Motorbike', isOnline: true, isBusy: true, activeOrder: 'ORD-1712-5034', rating: 4.95 },
  ]);

  const [orders] = useState<OrderRecord[]>([
    { id: 'o1', orderNumber: 'ORD-1712-4912', store: 'Fresh Harvest Market', amount: 17.26, paymentStatus: 'PAID', deliveryStatus: 'ASSIGNED', riderName: 'Alex Mercer', timestamp: '12m ago' },
    { id: 'o2', orderNumber: 'ORD-1712-5034', store: 'Green Valley Organics', amount: 14.96, paymentStatus: 'PAID', deliveryStatus: 'OUT_FOR_DELIVERY', riderName: 'Aayush Adhikari', timestamp: '24m ago' },
    { id: 'o3', orderNumber: 'ORD-1712-5110', store: 'Fresh Harvest Market', amount: 32.50, paymentStatus: 'PAID', deliveryStatus: 'PREPARING', timestamp: '5m ago' },
    { id: 'o4', orderNumber: 'ORD-1712-5201', store: 'Himalayan Mountain Staples', amount: 8.90, paymentStatus: 'PAID', deliveryStatus: 'DELIVERED', riderName: 'Carlos Ramos', timestamp: '1h ago' },
  ]);

  const approveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status: 'ACTIVE' } : s))
    );
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    const newStore: Store = {
      id: `s-${Date.now()}`,
      name: newStoreName,
      owner: newStoreOwner || 'Authorized Partner',
      city: newStoreCity || 'Central Region',
      status: 'ACTIVE',
      orders: 0,
      rating: 5.0,
    };
    setStores((prev) => [newStore, ...prev]);
    setNewStoreName('');
    setNewStoreOwner('');
    setNewStoreCity('');
    setShowOnboardModal(false);
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-ivory)' }} className="admin-layout">
      {/* Ozeonix Deep Navy Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: 'var(--color-navy)',
          color: 'var(--color-white)',
          padding: '1.75rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        className="admin-sidebar"
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--color-white)',
              boxShadow: '0 4px 10px rgba(255, 107, 0, 0.4)',
            }}
          >
            O
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--color-white)' }}>OZEONIX</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-emerald)' }}></span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-slate-light)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Ops Commander
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'overview' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'overview' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <OverviewIcon size={18} color="var(--color-white)" />
            <span>Operations Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'stores' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'stores' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <StoreIcon size={18} color="var(--color-white)" />
              <span>Merchant Stores</span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'stores' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                fontWeight: 700,
              }}
            >
              {stores.length}
            </span>
          </button>

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
              <OrderIcon size={18} color="var(--color-white)" />
              <span>Global Orders</span>
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
            onClick={() => setActiveTab('riders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'riders' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'riders' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <RiderIcon size={18} color="var(--color-white)" />
              <span>Delivery Fleet</span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'riders' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                fontWeight: 700,
              }}
            >
              {riders.filter((r) => r.isOnline).length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'users' ? 'var(--color-primary)' : 'transparent',
              color: 'var(--color-white)',
              fontWeight: activeTab === 'users' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background-color 0.15s ease',
            }}
          >
            <UsersIcon size={18} color="var(--color-white)" />
            <span>Platform Customers</span>
          </button>
        </nav>

        {/* System Health Pill Box */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.25rem',
            fontSize: '0.75rem',
            color: 'var(--color-slate-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-emerald)' }}></span>
            <span style={{ fontWeight: 600, color: 'var(--color-white)' }}>Cluster: All Microservices UP</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '1rem', color: '#94A3B8' }}>
            <div>Core API: Port 8080 (JVM 21)</div>
            <div>Realtime: Port 3001 (Node)</div>
            <div>Redis: Cache & BullMQ</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        {/* Top Operational Bar */}
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
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
              {activeTab === 'overview' && 'Platform Operations Commander'}
              {activeTab === 'stores' && 'Merchant Partners & Hubs'}
              {activeTab === 'orders' && 'Realtime Orders & Dispatch'}
              {activeTab === 'riders' && 'Delivery Partner Fleet'}
              {activeTab === 'users' && 'Customer Accounts & Roles'}
            </h1>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Ozeonix Distributed Grocery Platform • Zero-trust verified operations
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-cool-gray)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-navy)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <ActivityIcon size={16} color="var(--color-emerald)" />
              <span>Realtime Telemetry Active</span>
            </span>

            <button
              onClick={() => setShowOnboardModal(true)}
              className="btn btn-primary"
              style={{ boxShadow: '0 4px 12px rgba(255, 107, 0, 0.25)' }}
            >
              <PlusIcon size={16} color="var(--color-white)" />
              <span>Onboard Partner</span>
            </button>
          </div>
        </header>

        {/* Tab 1: Operations Overview */}
        {activeTab === 'overview' && (
          <section>
            {/* KPI Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Active Merchant Stores</span>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--color-emerald-soft)' }}>
                    <StoreIcon size={18} color="var(--color-emerald)" />
                  </div>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-navy)' }}>
                  {stores.filter((s) => s.status === 'ACTIVE').length}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-emerald)' }}>
                  <TrendingUpIcon size={14} color="var(--color-emerald)" />
                  <span>+2 onboarded this week</span>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Live Dispatch Volume</span>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--color-primary-soft)' }}>
                    <OrderIcon size={18} color="var(--color-primary)" />
                  </div>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-navy)' }}>304</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-primary)' }}>
                  <TrendingUpIcon size={14} color="var(--color-primary)" />
                  <span>+18.4% peak evening surge</span>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Delivery Fleet Ready</span>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'var(--color-emerald-soft)' }}>
                    <RiderIcon size={18} color="var(--color-emerald)" />
                  </div>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-navy)' }}>
                  {riders.filter((r) => r.isOnline).length} / {riders.length}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-emerald)' }}>
                  <span>Avg delivery ETA: 14 mins</span>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', fontWeight: 600 }}>Gross Order Value (Today)</span>
                  <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: 'rgba(4, 40, 74, 0.08)' }}>
                    <TrendingUpIcon size={18} color="var(--color-navy)" />
                  </div>
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-navy)' }}>$6,420</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                  <span>Settlement SLA: Daily T+1</span>
                </div>
              </div>
            </div>

            {/* Health & Architecture Topology */}
            <div className="admin-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                    Microservice Health & Resilience Grid
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                    Active continuous verification of distributed backend clusters
                  </p>
                </div>
                <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                  <RefreshIcon size={14} /> Refresh Probes
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--color-cool-gray-light)', border: '1px solid var(--color-cool-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Core API (Spring Boot)</span>
                    <span className="badge badge-emerald">HEALTHY</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Port 8080 • PostgreSQL 5432</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600, marginTop: '0.25rem' }}>Flyway V1..V6 Applied</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--color-cool-gray-light)', border: '1px solid var(--color-cool-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Realtime API (Socket.IO)</span>
                    <span className="badge badge-emerald">HEALTHY</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Port 3001 • JWT Guarded</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600, marginTop: '0.25rem' }}>Sub: rider-locations</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--color-cool-gray-light)', border: '1px solid var(--color-cool-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notification API (Node)</span>
                    <span className="badge badge-emerald">HEALTHY</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Port 3002 • Multi-channel</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600, marginTop: '0.25rem' }}>SMS / Push / In-App</div>
                </div>

                <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--color-cool-gray-light)', border: '1px solid var(--color-cool-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Redis (Alpine 7.4)</span>
                    <span className="badge badge-emerald">CONNECTED</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Port 6379 • BullMQ Worker</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600, marginTop: '0.25rem' }}>TTL Cache Active</div>
                </div>
              </div>
            </div>

            {/* Quick Live Orders Snapshot */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-cool-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)' }}>Recent Platform Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                  View All Orders →
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Merchant</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Fulfillment</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 3).map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 700 }}>{o.orderNumber}</td>
                        <td>{o.store}</td>
                        <td style={{ fontWeight: 700 }}>${o.amount.toFixed(2)}</td>
                        <td><span className="badge badge-emerald">{o.paymentStatus}</span></td>
                        <td>
                          <span className={`badge ${o.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'badge-orange' : 'badge-navy'}`}>
                            {o.deliveryStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-slate)' }}>{o.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Merchant Stores */}
        {activeTab === 'stores' && (
          <section>
            <div className="admin-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <input
                  type="text"
                  placeholder="Filter by store name, city, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-control"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate)' }}>
                  <SearchIcon size={16} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)', fontWeight: 600 }}>
                  Showing {filteredStores.length} stores
                </span>
                <button onClick={() => setShowOnboardModal(true)} className="btn btn-primary">
                  <PlusIcon size={16} color="var(--color-white)" />
                  <span>Add Merchant</span>
                </button>
              </div>
            </div>

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Store Name</th>
                      <th>Owner / Contact</th>
                      <th>City Hub</th>
                      <th>Lifetime Orders</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map((s) => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{s.name}</td>
                        <td style={{ color: 'var(--color-slate)' }}>{s.owner}</td>
                        <td>{s.city}</td>
                        <td style={{ fontWeight: 600 }}>{s.orders}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <StarIcon size={14} />
                            <span style={{ fontWeight: 700 }}>{s.rating}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${s.status === 'ACTIVE' ? 'badge-emerald' : 'badge-orange'}`}>
                            {s.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {s.status === 'PENDING_APPROVAL' ? (
                            <button
                              onClick={() => approveStore(s.id)}
                              className="btn btn-emerald"
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                            >
                              <CheckIcon size={14} color="var(--color-white)" />
                              <span>Approve Store</span>
                            </button>
                          ) : (
                            <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                              Manage Catalog
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Global Orders */}
        {activeTab === 'orders' && (
          <section>
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-cool-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                    Live Customer Orders & Fleet Routing
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                    Continuous event stream synchronized via core-api & realtime WebSockets
                  </p>
                </div>
                <span className="badge badge-emerald">Socket Connected</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order Tracking #</th>
                      <th>Origin Store</th>
                      <th>Customer Amount</th>
                      <th>Payment State</th>
                      <th>Fulfillment Pipeline</th>
                      <th>Assigned Rider</th>
                      <th>Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{o.orderNumber}</td>
                        <td style={{ fontWeight: 600 }}>{o.store}</td>
                        <td style={{ fontWeight: 700 }}>${o.amount.toFixed(2)}</td>
                        <td>
                          <span className="badge badge-emerald">{o.paymentStatus}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              o.deliveryStatus === 'OUT_FOR_DELIVERY'
                                ? 'badge-orange'
                                : o.deliveryStatus === 'DELIVERED'
                                ? 'badge-emerald'
                                : 'badge-navy'
                            }`}
                          >
                            {o.deliveryStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          {o.riderName ? (
                            <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{o.riderName}</span>
                          ) : (
                            <span style={{ color: 'var(--color-slate-light)', fontStyle: 'italic' }}>Auto-dispatching...</span>
                          )}
                        </td>
                        <td style={{ color: 'var(--color-slate)' }}>{o.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: Delivery Fleet Riders */}
        {activeTab === 'riders' && (
          <section>
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-cool-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                    Delivery Partners & Courier Fleet
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)' }}>
                    Real-time GPS telemetry and availability monitoring
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-emerald">
                    {riders.filter((r) => r.isOnline).length} Online
                  </span>
                  <span className="badge badge-orange">
                    {riders.filter((r) => r.isBusy).length} In Transit
                  </span>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Partner Name</th>
                      <th>Direct Contact</th>
                      <th>Vehicle Profile</th>
                      <th>Availability Status</th>
                      <th>Active Delivery Task</th>
                      <th>Partner Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{r.name}</td>
                        <td style={{ color: 'var(--color-slate)', fontFamily: 'monospace' }}>{r.phone}</td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{r.vehicle}</span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              r.isOnline ? (r.isBusy ? 'badge-orange' : 'badge-emerald') : 'badge-navy'
                            }`}
                          >
                            {r.isOnline ? (r.isBusy ? 'In Transit' : 'Available') : 'Offline'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.activeOrder}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <StarIcon size={14} />
                            <span style={{ fontWeight: 700 }}>{r.rating}</span>
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

        {/* Tab 5: Users */}
        {activeTab === 'users' && (
          <section className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
              Registered Platform Customers
            </h3>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Customer accounts authenticated through JWT Bearer tokens and PostgreSQL core identity schema.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Full Name</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>bhola@ozeonix.com</td>
                    <td>Bhola Dev</td>
                    <td style={{ color: 'var(--color-slate)' }}>+977 9800000000</td>
                    <td><span className="badge badge-emerald">ROLE_CUSTOMER</span></td>
                    <td><span className="badge badge-emerald">VERIFIED</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>sarah.j@example.com</td>
                    <td>Sarah Jenkins</td>
                    <td style={{ color: 'var(--color-slate)' }}>+977 9811223344</td>
                    <td><span className="badge badge-emerald">ROLE_CUSTOMER</span></td>
                    <td><span className="badge badge-emerald">VERIFIED</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>david.chen@example.com</td>
                    <td>David Chen</td>
                    <td style={{ color: 'var(--color-slate)' }}>+977 9822334455</td>
                    <td><span className="badge badge-emerald">ROLE_CUSTOMER</span></td>
                    <td><span className="badge badge-emerald">VERIFIED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Onboard Merchant Modal */}
      {showOnboardModal && (
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
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Onboard New Merchant
              </h3>
              <button
                onClick={() => setShowOnboardModal(false)}
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

            <form onSubmit={handleCreateStore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kathmandu Fresh Supermarket"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  Merchant Owner Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Karki"
                  value={newStoreOwner}
                  onChange={(e) => setNewStoreOwner(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-navy)' }}>
                  City / Operational District
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thamel, Kathmandu"
                  value={newStoreCity}
                  onChange={(e) => setNewStoreCity(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Activate Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
