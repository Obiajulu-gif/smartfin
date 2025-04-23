import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { calculateTransactionSummary, calculateMonthlyTrends, groupTransactionsByCategory } from '../../../lib/financialCalculations';

// Constants for notification thresholds and types
const NOTIFICATION_TYPES = {
  ALERT: 'alert',
  INSIGHT: 'insight',
  INFO: 'info'
};

const THRESHOLDS = {
  LOW_BALANCE: 0,
  TAX_REMINDER_DAYS: 3
};

/**
 * Generates notifications based on user's financial data
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<NextResponse>} - JSON response containing notifications
 */
export async function GET(req) {
  try {
    // Input validation
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing userId parameter' },
        { status: 400 }
      );
    }

    // Database connection and data fetching
    const { db } = await connectToDatabase();
    
    // Get user profile to check when they joined
    const userProfile = await db.collection('users').findOne({ localId: userId });
    
    // Get transactions
    const transactions = await db
      .collection('transactions')
      .find({ userId })
      .sort({ date: -1 }) // Sort by date descending
      .limit(100) // Limit to recent transactions for performance
      .toArray();
      
    // Get expenses
    const expenses = await db
      .collection('expenses')
      .find({ userId })
      .sort({ date: -1 })
      .limit(50)
      .toArray();

    // Generate notifications based on available data
    let notifications = [];

    // If user has transactions, generate insights based on those
    if (transactions.length) {
      // Calculate financial metrics
      const summary = calculateTransactionSummary(transactions);
      
      // Try to calculate monthly trends if we have enough data
      let monthlyTrends = [];
      try {
        monthlyTrends = calculateMonthlyTrends(transactions, 2);
      } catch (error) {
        console.error("Error calculating monthly trends:", error);
      }

      // Low balance notification
      if (parseFloat(summary.balance) < THRESHOLDS.LOW_BALANCE) {
        notifications.push({
          id: 'low-balance',
          message: `Alert: Your balance is negative (₦${parseFloat(summary.balance).toLocaleString()}). Please review your expenses.`,
          type: NOTIFICATION_TYPES.ALERT,
          priority: 'high',
          timestamp: new Date().toISOString()
        });
      }

      // Monthly expense trend notification
      if (monthlyTrends.length >= 2) {
        const [prev, current] = monthlyTrends;
        const expenseIncrease = parseFloat(current.expenses) - parseFloat(prev.expenses);
        const percentageIncrease = prev.expenses > 0 ? (expenseIncrease / parseFloat(prev.expenses)) * 100 : 0;

        if (expenseIncrease > 0 && !isNaN(percentageIncrease)) {
          notifications.push({
            id: 'expense-trend',
            message: `Insight: Your expenses have increased by ${percentageIncrease.toFixed(1)}% (₦${expenseIncrease.toLocaleString()}) this month.`,
            type: NOTIFICATION_TYPES.INSIGHT,
            priority: 'medium',
            timestamp: new Date().toISOString()
          });
        } else if (expenseIncrease < 0 && !isNaN(percentageIncrease)) {
          const decrease = Math.abs(percentageIncrease);
          notifications.push({
            id: 'expense-decrease',
            message: `Insight: Great job! Your expenses have decreased by ${decrease.toFixed(1)}% (₦${Math.abs(expenseIncrease).toLocaleString()}) this month.`,
            type: NOTIFICATION_TYPES.INFO,
            priority: 'medium',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Category spending insights
      try {
        const categories = groupTransactionsByCategory(transactions);
        let highestCategory = { name: '', total: 0 };
        
        Object.entries(categories).forEach(([name, data]) => {
          if (name.toLowerCase().includes('expense') || !name.toLowerCase().includes('income')) {
            const total = parseFloat(data.total);
            if (total > highestCategory.total) {
              highestCategory = { name, total };
            }
          }
        });
        
        if (highestCategory.name && highestCategory.total > 0) {
          notifications.push({
            id: 'category-insight',
            message: `Your highest spending category is ${highestCategory.name} (₦${highestCategory.total.toLocaleString()}).`,
            type: NOTIFICATION_TYPES.INSIGHT,
            priority: 'low',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error calculating category insights:", error);
      }
    } else if (expenses.length) {
      // User has expenses but no transactions
      notifications.push({
        id: 'expenses-only',
        message: `You have recorded ${expenses.length} expenses. Consider tracking your income to get a complete financial picture.`,
        type: NOTIFICATION_TYPES.INFO,
        priority: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Tax reminder notification - show this regardless of transaction data
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysUntilEndOfMonth = lastDay - now.getDate();

    if (daysUntilEndOfMonth <= THRESHOLDS.TAX_REMINDER_DAYS) {
      notifications.push({
        id: 'tax-reminder',
        message: `Reminder: Monthly tax filing due in ${daysUntilEndOfMonth} day${daysUntilEndOfMonth === 1 ? '' : 's'}.`,
        type: NOTIFICATION_TYPES.INFO,
        priority: 'low',
        timestamp: new Date().toISOString()
      });
    }
    
    // New user welcome notification
    if (userProfile && userProfile.createdAt) {
      const userCreatedDate = new Date(userProfile.createdAt);
      const daysSinceCreation = Math.floor((now - userCreatedDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCreation < 7) {
        notifications.push({
          id: 'welcome',
          message: `Welcome to SmartFin! Start by recording your transactions to get personalized financial insights.`,
          type: NOTIFICATION_TYPES.INFO,
          priority: 'high',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // If no notifications were generated, add some default ones
    if (notifications.length === 0) {
      notifications = [
        {
          id: 'get-started',
          message: `Start tracking your financial activity to receive personalized insights and notifications.`,
          type: NOTIFICATION_TYPES.INFO,
          priority: 'medium',
          timestamp: new Date().toISOString()
        },
        {
          id: 'tip-1',
          message: `Tip: Regular expense tracking can help identify areas where you can save money.`,
          type: NOTIFICATION_TYPES.INSIGHT,
          priority: 'low',
          timestamp: new Date().toISOString()
        },
        {
          id: 'smart-assistant',
          message: `Try asking our SmartFin AI assistant for financial tips and insights.`,
          type: NOTIFICATION_TYPES.INFO,
          priority: 'low',
          timestamp: new Date().toISOString()
        }
      ];
    }

    // Sort notifications by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    notifications.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Cache headers for performance
    const headers = {
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Expires': '-1',
      'Pragma': 'no-cache'
    };

    return NextResponse.json(notifications, { headers });

  } catch (error) {
    console.error('Error generating notifications:', error);
    
    // On error, return default notifications instead of an error
    const defaultNotifications = [
      {
        id: 'get-started',
        message: `Start tracking your financial activity to receive personalized insights and notifications.`,
        type: NOTIFICATION_TYPES.INFO,
        priority: 'medium',
        timestamp: new Date().toISOString()
      },
      {
        id: 'tip-general',
        message: `Tip: Set up a budget to help manage your expenses more effectively.`,
        type: NOTIFICATION_TYPES.INSIGHT,
        priority: 'low',
        timestamp: new Date().toISOString()
      }
    ];
    
    return NextResponse.json(defaultNotifications);
  }
}