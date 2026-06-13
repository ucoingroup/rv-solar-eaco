/**
 * 数据库初始化数据
 */
const { pgPool } = require('../config/database');

async function seed() {
  console.log('🌱 开始初始化数据...');
  const client = await pgPool.connect();

  try {
    await client.query('BEGIN');

    // 1. 口岸数据
    const ports = [
      {
        name: '霍尔果斯-东大门',
        name_local: 'Khorgos Gateway',
        name_en: 'Khorgos (Dostyk)',
        country_code: 'KZ',
        country_name: 'Kazakhstan',
        border_type: 'land',
        lat_side: 'foreign',
        latitude: 43.4264,
        longitude: 82.5127,
        timezone: 'Asia/Almaty',
        currency_code: 'KZT',
        crypto_friendly: 4,
        solar_potential: 4,
        rv_friendly: 4,
        language_codes: ['zh', 'en', 'ru'],
        regulatory_note: '哈萨克斯坦2023年出台数字资产法，需在AIX注册',
        onboarding_status: 'pilot',
        priority: 1
      },
      {
        name: '磨丁',
        name_local: 'Boten',
        name_en: 'Mohan/Boten',
        country_code: 'LK',
        country_name: 'Laos',
        border_type: 'land',
        lat_side: 'foreign',
        latitude: 21.2019,
        longitude: 101.7898,
        timezone: 'Asia/Vientiane',
        currency_code: 'LAK',
        crypto_friendly: 2,
        solar_potential: 4,
        rv_friendly: 3,
        language_codes: ['zh', 'en', 'lo'],
        regulatory_note: '老挝2026年计划停止加密挖矿供电，需强调清洁能源支付定位',
        onboarding_status: 'planned',
        priority: 2
      },
      {
        name: '红其拉甫',
        name_local: 'Khunjrab Pass',
        name_en: 'Khunjrab Pass',
        country_code: 'PK',
        country_name: 'Pakistan',
        border_type: 'land',
        lat_side: 'foreign',
        latitude: 36.8200,
        longitude: 75.4350,
        timezone: 'Asia/Karachi',
        currency_code: 'PKR',
        crypto_friendly: 5,
        solar_potential: 5,
        rv_friendly: 3,
        language_codes: ['zh', 'en', 'ur'],
        regulatory_note: '巴基斯坦2026年VAA法案通过，PVARA牌照可合法运营',
        onboarding_status: 'planned',
        priority: 3
      },
      {
        name: '外贝加尔斯克',
        name_local: 'Забайкальск',
        name_en: 'Zabaykalsk',
        country_code: 'RU',
        country_name: 'Russia',
        border_type: 'land',
        lat_side: 'foreign',
        latitude: 49.6400,
        longitude: 117.3300,
        timezone: 'Asia/Yakutsk',
        currency_code: 'RUB',
        crypto_friendly: 3,
        solar_potential: 3,
        rv_friendly: 3,
        language_codes: ['zh', 'en', 'ru'],
        regulatory_note: '俄罗斯境内消费支付可行，规避跨境汇款以防制裁',
        onboarding_status: 'planned',
        priority: 4
      },
      {
        name: '扎门乌德',
        name_local: 'Замын-Уудэн',
        name_en: 'Zamin Ud',
        country_code: 'MN',
        country_name: 'Mongolia',
        border_type: 'land',
        lat_side: 'foreign',
        latitude: 47.5500,
        longitude: 106.1500,
        timezone: 'Asia/Ulaanbaatar',
        currency_code: 'MNT',
        crypto_friendly: 3,
        solar_potential: 5,
        rv_friendly: 4,
        language_codes: ['zh', 'en', 'mn'],
        regulatory_note: '蒙古央行2026年研究稳定币作为支付手段，处于政策红利期',
        onboarding_status: 'planned',
        priority: 5
      }
    ];

    for (const port of ports) {
      await client.query(`
        INSERT INTO port_crossings (name, name_local, name_en, country_code, country_name, border_type, lat_side, latitude, longitude, timezone, currency_code, crypto_friendly, solar_potential, rv_friendly, language_codes, regulatory_note, onboarding_status, priority)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
        ON CONFLICT DO NOTHING
      `, [port.name, port.name_local, port.name_en, port.country_code, port.country_name, port.border_type, port.lat_side, port.latitude, port.longitude, port.timezone, port.currency_code, port.crypto_friendly, port.solar_potential, port.rv_friendly, port.language_codes, port.regulatory_note, port.onboarding_status, port.priority]);
    }
    console.log('✅ 口岸数据插入成功');

    // 2. 霍尔果斯营地数据
    const campsites = [
      {
        name: '霍尔果斯国际房车驿站',
        name_en: 'Khorgos International RV Hub',
        country_code: 'KZ',
        port_id: null, // 稍后通过查询获取
        address: 'Khorgos Gateway, Almaty Region, Kazakhstan',
        latitude: 43.4290,
        longitude: 82.5150,
        description: '中欧班列起点首个国际房车驿站，提供光伏充电设施，支持EACO支付',
        price_usd_cents: 3000,
        solar_capacity_kw: 15.0,
        charging_spots: 4,
        max_charging_power_w: 22000,
        amenities: ['wifi', 'shower', 'toilet', 'solar_charging', 'restaurant', 'parking'],
        operator_name: 'Khorgos Gateway Management',
        rating: 4.7,
        rating_count: 89
      },
      {
        name: '阿拉木图营地',
        name_en: 'Almaty RV Camp',
        country_code: 'KZ',
        port_id: null,
        address: 'Medeu District, Almaty, Kazakhstan',
        latitude: 43.2175,
        longitude: 77.0325,
        description: '阿拉木图市区最大的房车营地，位于山区景区，光伏设施完善',
        price_usd_cents: 2500,
        solar_capacity_kw: 10.0,
        charging_spots: 3,
        max_charging_power_w: 15000,
        amenities: ['wifi', 'shower', 'toilet', 'solar_charging', 'hiking'],
        operator_name: 'Almaty Camping Union',
        rating: 4.5,
        rating_count: 56
      }
    ];

    // 先获取霍尔果斯口岸ID
    const portResult = await client.query(`SELECT id FROM port_crossings WHERE country_code = 'KZ' LIMIT 1`);
    const portId = portResult.rows[0]?.id;

    for (const camp of campsites) {
      await client.query(`
        INSERT INTO campsites (name, name_en, country_code, port_id, address, latitude, longitude, description, price_usd_cents, solar_capacity_kw, charging_spots, max_charging_power_w, amenities, operator_name, rating, rating_count, total_spots, available_spots)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,10,10)
        ON CONFLICT DO NOTHING
      `, [camp.name, camp.name_en, camp.country_code, portId, camp.address, camp.latitude, camp.longitude, camp.description, camp.price_usd_cents, camp.solar_capacity_kw, camp.charging_spots, camp.max_charging_power_w, camp.amenities, camp.operator_name, camp.rating, camp.rating_count]);
    }
    console.log('✅ 营地数据插入成功');

    await client.query('COMMIT');
    console.log('🎉 数据初始化完成!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 初始化失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));