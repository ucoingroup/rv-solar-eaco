/**
 * 数据库迁移脚本
 */
const { pgPool } = require('../config/database');

async function migrate() {
  console.log('🔄 开始数据库迁移...');

  const client = await pgPool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. 创建UUID扩展
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // 2. 用户表
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_code VARCHAR(6) NOT NULL DEFAULT '+86',
        phone_number VARCHAR(20) NOT NULL UNIQUE,
        nickname VARCHAR(50),
        avatar_url VARCHAR(500),
        wallet_address VARCHAR(64) NOT NULL,
        user_level INTEGER DEFAULT 1,
        credit_score INTEGER DEFAULT 100 CHECK (credit_score >= 0 AND credit_score <= 1000),
        language VARCHAR(10) DEFAULT 'zh',
        kyc_status VARCHAR(20) DEFAULT 'none',
        kyc_level INTEGER DEFAULT 0,
        total_energy_kwh BIGINT DEFAULT 0,
        total_reward_eaco BIGINT DEFAULT 0,
        referrer_id UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        last_active_at TIMESTAMPTZ
      );
    `);
    console.log('✅ users表创建成功');

    // 3. 口岸表
    await client.query(`
      CREATE TABLE IF NOT EXISTS port_crossings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        name_local VARCHAR(200),
        name_en VARCHAR(200),
        country_code VARCHAR(3) NOT NULL,
        country_name VARCHAR(100) NOT NULL,
        border_type VARCHAR(20),
        lat_side VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        timezone VARCHAR(50),
        currency_code VARCHAR(3),
        crypto_friendly INTEGER DEFAULT 3 CHECK (crypto_friendly >= 1 AND crypto_friendly <= 5),
        solar_potential INTEGER DEFAULT 3 CHECK (solar_potential >= 1 AND solar_potential <= 5),
        rv_friendly INTEGER DEFAULT 3 CHECK (rv_friendly >= 1 AND rv_friendly <= 5),
        language_codes TEXT[] DEFAULT '{"zh","en"}',
        regulatory_note TEXT,
        onboarding_status VARCHAR(20) DEFAULT 'planned',
        priority INTEGER DEFAULT 3,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ port_crossings表创建成功');

    // 4. 营地表
    await client.query(`
      CREATE TABLE IF NOT EXISTS campsites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        name_local VARCHAR(200),
        name_en VARCHAR(200),
        country_code VARCHAR(3) NOT NULL,
        port_id UUID REFERENCES port_crossings(id),
        address VARCHAR(500),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        description TEXT,
        description_en TEXT,
        check_in_time TIME DEFAULT '14:00',
        check_out_time TIME DEFAULT '12:00',
        total_spots INTEGER DEFAULT 0,
        available_spots INTEGER DEFAULT 0,
        price_usd_cents INTEGER,
        solar_capacity_kw DECIMAL(8, 2) DEFAULT 0,
        charging_spots INTEGER DEFAULT 0,
        max_charging_power_w INTEGER DEFAULT 0,
        images JSONB DEFAULT '[]',
        amenities TEXT[] DEFAULT '{}',
        contact_phone VARCHAR(30),
        contact_wechat VARCHAR(50),
        operator_wallet VARCHAR(64),
        operator_name VARCHAR(200),
        rating DECIMAL(3, 2) DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ campsites表创建成功');

    // 5. 订单表
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_no VARCHAR(32) NOT NULL UNIQUE,
        user_id UUID NOT NULL REFERENCES users(id),
        campsite_id UUID NOT NULL REFERENCES campsites(id),
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        spot_type VARCHAR(30),
        nights INTEGER NOT NULL CHECK (nights > 0),
        amount_usd_cents INTEGER NOT NULL,
        payment_token VARCHAR(20),
        payment_status VARCHAR(20) DEFAULT 'pending',
        payment_tx_hash VARCHAR(100),
        discount_applied BOOLEAN DEFAULT FALSE,
        discount_reason VARCHAR(200),
        paid_at TIMESTAMPTZ,
        cancelled_at TIMESTAMPTZ,
        refund_tx_hash VARCHAR(100),
        user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
        user_comment TEXT,
        operator_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ orders表创建成功');

    // 6. 充电记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS charging_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        campsite_id UUID NOT NULL REFERENCES campsites(id),
        charger_id VARCHAR(100) NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ,
        energy_kwh DECIMAL(10, 4) NOT NULL,
        max_power_w INTEGER,
        avg_power_w INTEGER,
        price_token VARCHAR(20),
        price_per_kwh DECIMAL(12, 6),
        total_amount BIGINT,
        payment_status VARCHAR(20) DEFAULT 'pending',
        payment_tx_hash VARCHAR(100),
        on_chain BOOLEAN DEFAULT FALSE,
        chain_tx_hash VARCHAR(100),
        chain_record_id VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ charging_records表创建成功');

    // 7. 绿电记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS green_energy_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        charging_id UUID REFERENCES charging_records(id),
        energy_kwh BIGINT NOT NULL,
        location VARCHAR(200),
        oracle_address VARCHAR(64),
        oracle_signature VARCHAR(500),
        verified BOOLEAN DEFAULT FALSE,
        verified_at TIMESTAMPTZ,
        reward_eaco BIGINT DEFAULT 0,
        reward_tx_hash VARCHAR(100),
        nft_mint VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ green_energy_records表创建成功');

    // 8. 碳积分表
    await client.query(`
      CREATE TABLE IF NOT EXISTS carbon_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
        total_co2_kg DECIMAL(12, 4) DEFAULT 0,
        available_co2_kg DECIMAL(12, 4) DEFAULT 0,
        redeemed_co2_kg DECIMAL(12, 4) DEFAULT 0,
        last_updated TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ carbon_accounts表创建成功');

    // 9. 碳积分交易表
    await client.query(`
      CREATE TABLE IF NOT EXISTS carbon_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        carbon_account_id UUID NOT NULL REFERENCES carbon_accounts(id),
        change_kg DECIMAL(12, 4) NOT NULL,
        balance_after DECIMAL(12, 4) NOT NULL,
        source VARCHAR(30),
        ref_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ carbon_transactions表创建成功');

    // 10. 社区贡献表
    await client.query(`
      CREATE TABLE IF NOT EXISTS contributions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        type VARCHAR(30) NOT NULL,
        content TEXT NOT NULL,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        location_text VARCHAR(200),
        images JSONB DEFAULT '[]',
        port_id UUID REFERENCES port_crossings(id),
        status VARCHAR(20) DEFAULT 'pending',
        reviewer_id UUID REFERENCES users(id),
        reviewed_at TIMESTAMPTZ,
        reject_reason TEXT,
        reward_eaco BIGINT DEFAULT 0,
        reward_tx_hash VARCHAR(100),
        upvote_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ contributions表创建成功');

    // 11. P2P挂牌表
    await client.query(`
      CREATE TABLE IF NOT EXISTS energy_listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_no VARCHAR(50) NOT NULL UNIQUE,
        user_id UUID NOT NULL REFERENCES users(id),
        energy_kwh BIGINT NOT NULL,
        remaining_kwh BIGINT NOT NULL,
        price_eaco_per_kwh BIGINT NOT NULL,
        location_text VARCHAR(200),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status VARCHAR(20) DEFAULT 'active',
        sold_kwh BIGINT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ energy_listings表创建成功');

    // 12. 大使表
    await client.query(`
      CREATE TABLE IF NOT EXISTS ambassadors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        port_id UUID NOT NULL REFERENCES port_crossings(id),
        level INTEGER DEFAULT 1,
        status VARCHAR(20) DEFAULT 'pending',
        applied_at TIMESTAMPTZ DEFAULT NOW(),
        approved_at TIMESTAMPTZ,
        monthly_quota INTEGER DEFAULT 10,
        total_referrals INTEGER DEFAULT 0,
        total_rewards_eaco BIGINT DEFAULT 0,
        notes TEXT
      );
    `);
    console.log('✅ ambassadors表创建成功');

    // 创建索引
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_code, phone_number);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_charging_user ON charging_records(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_charging_onchain ON charging_records(on_chain);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_energy_user ON green_energy_records(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_energy_verified ON green_energy_records(verified);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campsites_port ON campsites(port_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campsites_location ON campsites(latitude, longitude);`);
    console.log('✅ 索引创建成功');

    await client.query('COMMIT');
    console.log('🎉 数据库迁移完成!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 迁移失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));