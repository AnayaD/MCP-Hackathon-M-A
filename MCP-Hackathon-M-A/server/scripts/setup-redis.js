const redis = require('redis');

async function setupRedis() {
  console.log('🔧 Setting up Redis for Chronos...');
  
  try {
    // Connect to Redis
    const client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || undefined
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await client.connect();
    console.log('✅ Connected to Redis successfully');

    // Test basic operations
    await client.set('chronos:test', 'Hello Chronos!');
    const testValue = await client.get('chronos:test');
    console.log('✅ Redis test successful:', testValue);

    // Clean up test key
    await client.del('chronos:test');

    // Set up initial data structures
    console.log('📊 Setting up initial data structures...');

    // Sample card offers
    const sampleOffers = [
      {
        card_id: 'chase_sapphire_24',
        issuer: 'Chase',
        name: 'Chase Sapphire Preferred',
        signup_bonus_points: 80000,
        bonus_min_spend: 4000,
        bonus_period_days: 90,
        category_multipliers: {
          travel: 2,
          dining: 2,
          groceries: 1,
          gas: 1,
          other: 1
        },
        annual_fee: 95,
        point_value_usd: 0.0125,
        link: 'https://www.chase.com/personal/credit-cards/sapphire-preferred',
        last_updated: new Date().toISOString()
      },
      {
        card_id: 'amex_gold_24',
        issuer: 'American Express',
        name: 'American Express Gold Card',
        signup_bonus_points: 60000,
        bonus_min_spend: 4000,
        bonus_period_days: 180,
        category_multipliers: {
          dining: 4,
          groceries: 4,
          travel: 3,
          gas: 1,
          other: 1
        },
        annual_fee: 250,
        point_value_usd: 0.02,
        link: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
        last_updated: new Date().toISOString()
      }
    ];

    await client.set('card_offers:latest', JSON.stringify(sampleOffers));
    await client.expire('card_offers:latest', 86400); // 24 hours TTL
    console.log('✅ Sample card offers stored');

    // Sample travel prices
    const sampleTravelPrices = [
      {
        destination: 'Paris',
        prices: [
          {
            airline: 'American Airlines',
            price: 850,
            departure_time: '08:00',
            arrival_time: '14:30',
            duration: '6h 30m',
            stops: 0,
            class: 'Economy'
          },
          {
            airline: 'Delta',
            price: 920,
            departure_time: '12:15',
            arrival_time: '18:45',
            duration: '6h 30m',
            stops: 0,
            class: 'Economy'
          }
        ],
        scraped_at: new Date().toISOString()
      }
    ];

    await client.set('travel_prices:paris', JSON.stringify(sampleTravelPrices));
    await client.expire('travel_prices:paris', 86400); // 24 hours TTL
    console.log('✅ Sample travel prices stored');

    // Sample merchant categories
    const merchantCategories = {
      'Whole Foods': 'groceries',
      'Safeway': 'groceries',
      'Costco': 'groceries',
      'Starbucks': 'dining',
      'Chipotle': 'dining',
      'McDonald\'s': 'dining',
      'Shell': 'gas',
      'Chevron': 'gas',
      'BP': 'gas',
      'Amazon': 'shopping',
      'Target': 'shopping',
      'Walmart': 'shopping',
      'Uber': 'transportation',
      'Lyft': 'transportation',
      'Netflix': 'entertainment',
      'Spotify': 'entertainment'
    };

    await client.set('merchant_categories', JSON.stringify(merchantCategories));
    console.log('✅ Merchant categories stored');

    // Test vector operations (mock)
    const sampleVector = {
      id: 'vector_1',
      embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
      metadata: {
        type: 'card_offer',
        card_id: 'chase_sapphire_24'
      }
    };

    await client.hSet('vector:chase_sapphire_24', {
      embedding: JSON.stringify(sampleVector.embedding),
      metadata: JSON.stringify(sampleVector.metadata),
      timestamp: new Date().toISOString()
    });
    await client.expire('vector:chase_sapphire_24', 86400);
    console.log('✅ Sample vector stored');

    await client.quit();
    console.log('🎉 Redis setup completed successfully!');
    console.log('📊 Data structures created:');
    console.log('   - card_offers:latest');
    console.log('   - travel_prices:paris');
    console.log('   - merchant_categories');
    console.log('   - vector:chase_sapphire_24');

  } catch (error) {
    console.error('❌ Redis setup failed:', error.message);
    console.log('💡 Make sure Redis is running:');
    console.log('   - Local: redis-server');
    console.log('   - Docker: docker run -d -p 6379:6379 redis');
    console.log('   - Redis Cloud: Sign up at redis.com/try-free/');
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupRedis();
}

module.exports = setupRedis;
