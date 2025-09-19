// Comprehensive demo data for Chronos
export const demoTransactions = [
  {
    id: 'tx_001',
    merchant: 'Whole Foods Market',
    category: 'groceries',
    amount: 156.78,
    date: '2024-08-15',
    card: 'Visa Rewards',
    missed_usd: 15.68,
    best_card: 'American Express Gold Card',
    reason: '4x points on groceries vs 1x on current card'
  },
  {
    id: 'tx_002',
    merchant: 'Starbucks',
    category: 'dining',
    amount: 24.50,
    date: '2024-08-14',
    card: 'Mastercard Cash',
    missed_usd: 4.90,
    best_card: 'Chase Sapphire Preferred',
    reason: '2x points on dining vs 1% cash back'
  },
  {
    id: 'tx_003',
    merchant: 'Shell Gas Station',
    category: 'gas',
    amount: 67.20,
    date: '2024-08-13',
    card: 'Visa Rewards',
    missed_usd: 3.36,
    best_card: 'Citi Double Cash',
    reason: '2% cash back vs 1% on current card'
  },
  {
    id: 'tx_004',
    merchant: 'Amazon',
    category: 'shopping',
    amount: 89.99,
    date: '2024-08-12',
    card: 'Mastercard Cash',
    missed_usd: 1.80,
    best_card: 'Capital One Venture',
    reason: '2x points on all purchases vs 1% cash back'
  },
  {
    id: 'tx_005',
    merchant: 'Uber',
    category: 'transportation',
    amount: 18.75,
    date: '2024-08-11',
    card: 'Visa Rewards',
    missed_usd: 3.75,
    best_card: 'Chase Sapphire Preferred',
    reason: '2x points on travel vs 1x on current card'
  },
  {
    id: 'tx_006',
    merchant: 'Target',
    category: 'shopping',
    amount: 134.25,
    date: '2024-08-10',
    card: 'Mastercard Cash',
    missed_usd: 2.68,
    best_card: 'Capital One Venture',
    reason: '2x points on all purchases vs 1% cash back'
  },
  {
    id: 'tx_007',
    merchant: 'Chipotle',
    category: 'dining',
    amount: 12.45,
    date: '2024-08-09',
    card: 'Visa Rewards',
    missed_usd: 2.49,
    best_card: 'American Express Gold Card',
    reason: '4x points on dining vs 1x on current card'
  },
  {
    id: 'tx_008',
    merchant: 'Costco',
    category: 'groceries',
    amount: 245.80,
    date: '2024-08-08',
    card: 'Mastercard Cash',
    missed_usd: 24.58,
    best_card: 'American Express Gold Card',
    reason: '4x points on groceries vs 1% cash back'
  },
  {
    id: 'tx_009',
    merchant: 'Netflix',
    category: 'entertainment',
    amount: 15.99,
    date: '2024-08-07',
    card: 'Visa Rewards',
    missed_usd: 0.32,
    best_card: 'Citi Double Cash',
    reason: '2% cash back vs 1% on current card'
  },
  {
    id: 'tx_010',
    merchant: 'Chevron',
    category: 'gas',
    amount: 52.30,
    date: '2024-08-06',
    card: 'Visa Rewards',
    missed_usd: 2.62,
    best_card: 'Citi Double Cash',
    reason: '2% cash back vs 1% on current card'
  },
  {
    id: 'tx_011',
    merchant: 'Panera Bread',
    category: 'dining',
    amount: 28.90,
    date: '2024-08-05',
    card: 'Mastercard Cash',
    missed_usd: 5.78,
    best_card: 'Chase Sapphire Preferred',
    reason: '2x points on dining vs 1% cash back'
  },
  {
    id: 'tx_012',
    merchant: 'Walmart',
    category: 'groceries',
    amount: 78.45,
    date: '2024-08-04',
    card: 'Visa Rewards',
    missed_usd: 7.85,
    best_card: 'American Express Gold Card',
    reason: '4x points on groceries vs 1x on current card'
  },
  {
    id: 'tx_013',
    merchant: 'Spotify',
    category: 'entertainment',
    amount: 9.99,
    date: '2024-08-03',
    card: 'Mastercard Cash',
    missed_usd: 0.20,
    best_card: 'Citi Double Cash',
    reason: '2% cash back vs 1% cash back'
  },
  {
    id: 'tx_014',
    merchant: 'McDonald\'s',
    category: 'dining',
    amount: 8.75,
    date: '2024-08-02',
    card: 'Visa Rewards',
    missed_usd: 1.75,
    best_card: 'American Express Gold Card',
    reason: '4x points on dining vs 1x on current card'
  },
  {
    id: 'tx_015',
    merchant: 'Exxon',
    category: 'gas',
    amount: 45.60,
    date: '2024-08-01',
    card: 'Mastercard Cash',
    missed_usd: 2.28,
    best_card: 'Citi Double Cash',
    reason: '2% cash back vs 1% cash back'
  }
]

export const demoGoals = [
  {
    goal_id: 'goal_1',
    title: 'Trip to Paris',
    target_date: '2025-05-15',
    est_cost_usd: 2500,
    status: 'active',
    description: 'Romantic anniversary trip to Paris',
    category: 'travel'
  },
  {
    goal_id: 'goal_2',
    title: 'New Laptop',
    target_date: '2025-03-01',
    est_cost_usd: 1200,
    status: 'active',
    description: 'MacBook Pro for work',
    category: 'technology'
  },
  {
    goal_id: 'goal_3',
    title: 'Wedding Expenses',
    target_date: '2025-08-20',
    est_cost_usd: 5000,
    status: 'active',
    description: 'Wedding venue and catering',
    category: 'events'
  }
]

export const demoCardOffers = [
  {
    card_id: 'chase_sapphire_preferred',
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
    card_id: 'amex_gold',
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
  },
  {
    card_id: 'capital_one_venture',
    issuer: 'Capital One',
    name: 'Capital One Venture Rewards',
    signup_bonus_points: 75000,
    bonus_min_spend: 4000,
    bonus_period_days: 90,
    category_multipliers: {
      travel: 2,
      dining: 2,
      groceries: 2,
      gas: 2,
      other: 2
    },
    annual_fee: 95,
    point_value_usd: 0.01,
    link: 'https://www.capitalone.com/credit-cards/venture/',
    last_updated: new Date().toISOString()
  }
]

export const demoMissedRewards = {
  missed_usd_total: 1250.75,
  lookback_months: 12,
  total_transactions: 15,
  evidence: demoTransactions.map(tx => ({
    transaction: {
      merchant: tx.merchant,
      category: tx.category,
      amount: tx.amount,
      date: tx.date,
      card: tx.card
    },
    missed_usd: tx.missed_usd,
    best_card: { name: tx.best_card },
    reason: tx.reason
  })),
  recommendations: [
    {
      card: 'American Express Gold Card',
      potential_savings: 450.25,
      reason: 'Best for your high grocery and dining spend'
    },
    {
      card: 'Chase Sapphire Preferred',
      potential_savings: 320.50,
      reason: 'Great for travel and dining with transfer partners'
    },
    {
      card: 'Capital One Venture',
      potential_savings: 480.00,
      reason: 'Simple 2x points on everything'
    }
  ]
}

export const demoPlans = {
  'paris_trip': {
    goal: 'Trip to Paris',
    timeline: [
      {
        month: 'October 2024',
        action: 'Apply for Chase Sapphire Preferred',
        reason: '80,000 point signup bonus worth $1,000+',
        requirements: 'Spend $4,000 in 90 days',
        estimated_points: 80000
      },
      {
        month: 'January 2025',
        action: 'Hit signup spend target',
        reason: 'Your consistent spending will easily meet requirement',
        requirements: 'Continue normal spending patterns',
        estimated_points: 0
      },
      {
        month: 'February 2025',
        action: 'Book flights to Paris',
        reason: 'Use 80,000 points for flights (worth $1,000+)',
        requirements: 'Transfer points to airline partners',
        estimated_points: -80000
      }
    ],
    total_value: 1000,
    coverage_percentage: 100,
    upgrade_possibility: 'Business class upgrade possible'
  },
  'laptop_purchase': {
    goal: 'New Laptop',
    timeline: [
      {
        month: 'November 2024',
        action: 'Apply for Capital One Venture',
        reason: '75,000 point signup bonus worth $750',
        requirements: 'Spend $4,000 in 90 days',
        estimated_points: 75000
      },
      {
        month: 'December 2024',
        action: 'Use laptop purchase for signup bonus',
        reason: 'Large purchase helps meet spending requirement',
        requirements: 'Purchase laptop with new card',
        estimated_points: 0
      },
      {
        month: 'March 2025',
        action: 'Redeem points for statement credit',
        reason: 'Cover laptop cost with earned points',
        requirements: 'Redeem 60,000 points for $600 credit',
        estimated_points: -60000
      }
    ],
    total_value: 750,
    coverage_percentage: 62.5,
    upgrade_possibility: 'Could upgrade to higher-end model'
  }
}
