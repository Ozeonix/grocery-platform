-- ============================================================================
-- 01_initial_seed.sql
-- Development / Demo Seed Data for Grocery Online Delivery Platform
-- Default test password for all seed users: "password123"
-- BCrypt: $2a$10$VjQ863j8f1i8i61QG3/aXe1O9e5Ww9L.8gK3kZq6qG0V4l6Vw/Fvy
-- ============================================================================

-- 1. SEED USERS
-- Admin User
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, is_active, is_verified)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@grocery.local',
    '+15550000001',
    '$2a$10$VjQ863j8f1i8i61QG3/aXe1O9e5Ww9L.8gK3kZq6qG0V4l6Vw/Fvy',
    'Platform',
    'Admin',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Store Owner User
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, is_active, is_verified)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'owner@freshmarket.local',
    '+15550000002',
    '$2a$10$VjQ863j8f1i8i61QG3/aXe1O9e5Ww9L.8gK3kZq6qG0V4l6Vw/Fvy',
    'Sarah',
    'Merchant',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Delivery Partner User
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, is_active, is_verified)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'rider@grocery.local',
    '+15550000003',
    '$2a$10$VjQ863j8f1i8i61QG3/aXe1O9e5Ww9L.8gK3kZq6qG0V4l6Vw/Fvy',
    'David',
    'Rider',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Customer User
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, is_active, is_verified)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'customer@grocery.local',
    '+15550000004',
    '$2a$10$VjQ863j8f1i8i61QG3/aXe1O9e5Ww9L.8gK3kZq6qG0V4l6Vw/Fvy',
    'Alice',
    'Shopper',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- 2. USER ROLE ASSIGNMENTS
INSERT INTO user_roles (user_id, role_id) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'ROLE_ADMIN'),
    ('b0000000-0000-0000-0000-000000000001', 'ROLE_STORE_OWNER'),
    ('c0000000-0000-0000-0000-000000000001', 'ROLE_DELIVERY_PARTNER'),
    ('d0000000-0000-0000-0000-000000000001', 'ROLE_CUSTOMER')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 3. CUSTOMER ADDRESS
INSERT INTO addresses (id, user_id, label, address_line1, city, state, postal_code, country, latitude, longitude, is_default)
VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'HOME',
    '742 Evergreen Terrace',
    'Springfield',
    'IL',
    '62704',
    'USA',
    39.7817210,
    -89.6501480,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 4. STORE SEED
INSERT INTO stores (
    id, name, slug, description, phone, email,
    address_line1, city, state, postal_code, latitude, longitude,
    status, is_accepting_orders, opening_time, closing_time
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'Fresh Harvest Market',
    'fresh-harvest-market',
    'Organic fruits, vegetables, dairy, and daily essentials.',
    '+15551234567',
    'contact@freshharvest.local',
    '100 Market Street',
    'Springfield',
    'IL',
    '62701',
    39.7990000,
    -89.6440000,
    'ACTIVE',
    TRUE,
    '07:00:00',
    '22:00:00'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO store_users (store_id, user_id, role)
VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'OWNER'
) ON CONFLICT (store_id, user_id) DO NOTHING;

-- 5. CATEGORIES
INSERT INTO categories (id, name, slug, description, sort_order, is_active) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Fresh Produce', 'fresh-produce', 'Fruits and Vegetables', 1, TRUE),
    ('10000000-0000-0000-0000-000000000002', 'Dairy & Eggs', 'dairy-eggs', 'Milk, Cheese, Butter, and Eggs', 2, TRUE),
    ('10000000-0000-0000-0000-000000000003', 'Bakery', 'bakery', 'Freshly baked bread, rolls, and pastries', 3, TRUE),
    ('10000000-0000-0000-0000-000000000004', 'Beverages', 'beverages', 'Juices, Sodas, Water, and Teas', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 6. PRODUCTS
INSERT INTO products (
    id, store_id, category_id, name, slug, description,
    sku, price, compare_at_price, cost_price, unit, status, is_available
) VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        'f0000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'Organic Bananas',
        'organic-bananas',
        'Fresh sweet organic bananas bunch',
        'FRUIT-BAN-001',
        1.99,
        2.49,
        0.99,
        'bunch',
        'ACTIVE',
        TRUE
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'f0000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000002',
        'Whole Milk 1 Gallon',
        'whole-milk-1-gallon',
        'Grade A pasteurized vitamin D whole milk',
        'DAIRY-MILK-001',
        4.29,
        4.89,
        2.50,
        'gallon',
        'ACTIVE',
        TRUE
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'f0000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000003',
        'Artisan Sourdough Loaf',
        'artisan-sourdough-loaf',
        'Naturally leavened sourdough bread',
        'BAKE-SOUR-001',
        5.49,
        5.99,
        2.80,
        'loaf',
        'ACTIVE',
        TRUE
    )
ON CONFLICT (store_id, sku) DO NOTHING;

-- 7. INVENTORY SEED
INSERT INTO inventory (store_id, product_id, quantity, reserved_quantity, low_stock_threshold) VALUES
    ('f0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 150, 0, 10),
    ('f0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 80, 0, 8),
    ('f0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 40, 0, 5)
ON CONFLICT (store_id, product_id) DO NOTHING;

-- 8. DELIVERY PARTNER PROFILE
INSERT INTO delivery_partners (id, user_id, vehicle_type, vehicle_number, license_number, is_online, is_busy, rating)
VALUES (
    '30000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'MOTORBIKE',
    'IL-MOTO-9821',
    'DL-IL-554433',
    TRUE,
    FALSE,
    4.95
) ON CONFLICT (user_id) DO NOTHING;
