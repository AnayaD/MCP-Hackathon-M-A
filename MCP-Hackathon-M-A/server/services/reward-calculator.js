// Deterministic reward calculation service
class RewardCalculator {
  constructor() {
    // Card multipliers and point values
    this.cardMultipliers = {
      'Chase Sapphire Preferred': {
        travel: 2,
        dining: 2,
        groceries: 1,
        gas: 1,
        shopping: 1,
        other: 1
      },
      'American Express Gold Card': {
        travel: 3,
        dining: 4,
        groceries: 4,
        gas: 1,
        shopping: 1,
        other: 1
      },
      'Capital One Venture': {
        travel: 2,
        dining: 2,
        groceries: 2,
        gas: 2,
        shopping: 2,
        other: 2
      },
      'Citi Double Cash': {
        travel: 2,
        dining: 2,
        groceries: 2,
        gas: 2,
        shopping: 2,
        other: 2
      },
      'Visa Rewards': {
        travel: 1,
        dining: 1,
        groceries: 1,
        gas: 1,
        shopping: 1,
        other: 1
      },
      'Mastercard Cash': {
        travel: 1,
        dining: 1,
        groceries: 1,
        gas: 1,
        shopping: 1,
        other: 1
      }
    };

    this.pointValues = {
      'Chase Sapphire Preferred': 0.0125, // 1.25 cents per point
      'American Express Gold Card': 0.02, // 2 cents per point
      'Capital One Venture': 0.01, // 1 cent per point
      'Citi Double Cash': 0.01, // 1 cent per point
      'Visa Rewards': 0.01, // 1 cent per point
      'Mastercard Cash': 0.01 // 1 cent per point
    };
  }

  // Calculate missed rewards for a single transaction
  calculateMissedRewards(transaction, currentCard, bestCard) {
    const currentMultiplier = this.cardMultipliers[currentCard]?.[transaction.category] || 1;
    const bestMultiplier = this.cardMultipliers[bestCard]?.[transaction.category] || 1;
    
    const currentPointValue = this.pointValues[currentCard] || 0.01;
    const bestPointValue = this.pointValues[bestCard] || 0.01;

    const currentReward = transaction.amount * currentMultiplier * currentPointValue;
    const bestReward = transaction.amount * bestMultiplier * bestPointValue;
    
    const missedReward = bestReward - currentReward;

    return {
      transaction: transaction,
      current_card: currentCard,
      best_card: bestCard,
      current_reward: currentReward,
      best_reward: bestReward,
      missed_usd: missedReward,
      reason: `${bestMultiplier}x points on ${transaction.category} vs ${currentMultiplier}x on current card`
    };
  }

  // Calculate missed rewards for all transactions
  calculateTotalMissedRewards(transactions) {
    const results = [];
    let totalMissed = 0;

    for (const transaction of transactions) {
      // Find the best card for this transaction category
      const bestCard = this.findBestCardForCategory(transaction.category);
      
      if (bestCard && bestCard !== transaction.card) {
        const calculation = this.calculateMissedRewards(
          transaction,
          transaction.card,
          bestCard
        );
        
        if (calculation.missed_usd > 0) {
          results.push(calculation);
          totalMissed += calculation.missed_usd;
        }
      }
    }

    return {
      missed_usd_total: totalMissed,
      total_transactions: transactions.length,
      evidence: results,
      recommendations: this.generateRecommendations(results)
    };
  }

  // Find the best card for a specific category
  findBestCardForCategory(category) {
    let bestCard = null;
    let bestValue = 0;

    for (const [cardName, multipliers] of Object.entries(this.cardMultipliers)) {
      const multiplier = multipliers[category] || 1;
      const pointValue = this.pointValues[cardName] || 0.01;
      const totalValue = multiplier * pointValue;

      if (totalValue > bestValue) {
        bestValue = totalValue;
        bestCard = cardName;
      }
    }

    return bestCard;
  }

  // Generate recommendations based on missed rewards
  generateRecommendations(evidence) {
    const categoryTotals = {};
    const cardTotals = {};

    // Calculate totals by category and card
    for (const item of evidence) {
      const category = item.transaction.category;
      const card = item.best_card;

      categoryTotals[category] = (categoryTotals[category] || 0) + item.missed_usd;
      cardTotals[card] = (cardTotals[card] || 0) + item.missed_usd;
    }

    // Find top categories and cards
    const topCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const topCards = Object.entries(cardTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const recommendations = [];

    // Generate category-based recommendations
    for (const [category, amount] of topCategories) {
      const bestCard = this.findBestCardForCategory(category);
      if (bestCard) {
        recommendations.push({
          card: bestCard,
          potential_savings: amount,
          reason: `Best for your high ${category} spend ($${amount.toFixed(2)} missed)`,
          category: category
        });
      }
    }

    // Generate overall recommendations
    for (const [card, amount] of topCards) {
      recommendations.push({
        card: card,
        potential_savings: amount,
        reason: `Overall best card for your spending patterns ($${amount.toFixed(2)} potential savings)`,
        category: 'overall'
      });
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  // Generate credit card timeline based on goals and spending patterns
  generateTimeline(userProfile, goals, spendingPatterns, cardOffers) {
    const timelines = [];

    for (const goal of goals) {
      const timeline = this.generateGoalTimeline(goal, spendingPatterns, cardOffers);
      timelines.push(timeline);
    }

    return timelines;
  }

  // Generate timeline for a specific goal
  generateGoalTimeline(goal, spendingPatterns, cardOffers) {
    const monthsUntilGoal = this.calculateMonthsUntilGoal(goal.target_date);
    const bestCard = this.findBestCardForGoal(goal, spendingPatterns, cardOffers);
    
    const timeline = {
      goal_id: goal.goal_id,
      goal_title: goal.title,
      target_date: goal.target_date,
      est_cost_usd: goal.est_cost_usd,
      months_until_goal: monthsUntilGoal,
      recommended_card: bestCard,
      timeline_steps: []
    };

    if (bestCard && monthsUntilGoal >= 3) {
      // Add application step
      timeline.timeline_steps.push({
        month: this.getMonthName(new Date().getMonth() + 1),
        action: `Apply for ${bestCard.name}`,
        reason: `${bestCard.signup_bonus_points.toLocaleString()} point signup bonus worth $${(bestCard.signup_bonus_points * bestCard.point_value_usd).toFixed(0)}`,
        requirements: `Spend $${bestCard.bonus_min_spend.toLocaleString()} in ${bestCard.bonus_period_days} days`,
        estimated_points: bestCard.signup_bonus_points
      });

      // Add spending step
      timeline.timeline_steps.push({
        month: this.getMonthName(new Date().getMonth() + 2),
        action: 'Meet signup bonus requirements',
        reason: 'Your spending patterns will easily meet the requirement',
        requirements: 'Continue normal spending with new card',
        estimated_points: 0
      });

      // Add redemption step
      timeline.timeline_steps.push({
        month: this.getMonthName(new Date().getMonth() + 3),
        action: `Use points for ${goal.title}`,
        reason: `Redeem ${bestCard.signup_bonus_points.toLocaleString()} points worth $${(bestCard.signup_bonus_points * bestCard.point_value_usd).toFixed(0)}`,
        requirements: 'Transfer points to travel partners or redeem for statement credit',
        estimated_points: -bestCard.signup_bonus_points
      });
    }

    return timeline;
  }

  // Find best card for a specific goal
  findBestCardForGoal(goal, spendingPatterns, cardOffers) {
    let bestCard = null;
    let bestValue = 0;

    for (const card of cardOffers) {
      // Calculate value based on signup bonus and category multipliers
      const signupValue = card.signup_bonus_points * card.point_value_usd;
      
      // Calculate ongoing value based on spending patterns
      let ongoingValue = 0;
      for (const [category, amount] of Object.entries(spendingPatterns)) {
        const multiplier = card.category_multipliers[category] || 1;
        ongoingValue += amount * multiplier * card.point_value_usd;
      }

      const totalValue = signupValue + ongoingValue;

      if (totalValue > bestValue) {
        bestValue = totalValue;
        bestCard = card;
      }
    }

    return bestCard;
  }

  // Calculate months until goal
  calculateMonthsUntilGoal(targetDate) {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target - now;
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  }

  // Get month name
  getMonthName(monthIndex) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex % 12];
  }
}

module.exports = new RewardCalculator();
