// User Activity Logger for SmartFin
// This utility logs user authentication and usage activities to MongoDB

import prisma from './prisma';  // Import the singleton Prisma instance

/**
 * Log user activity to MongoDB
 * @param {string} userId - User ID from Firebase authentication
 * @param {string} activityType - Type of activity (login, signup, logout, page_visited)
 * @param {Object} requestInfo - Request information including headers
 * @param {Object} details - Additional details about the activity
 * @returns {Promise<Object>} - The created activity log object
 */
export async function logUserActivity(userId, activityType, requestInfo = {}, details = {}) {
  try {
    // Extract device info from request headers
    const userAgent = requestInfo.userAgent || 'Unknown';
    const ipAddress = requestInfo.ipAddress || 'Unknown';
    
    // Create activity log in MongoDB via Prisma
    const activity = await prisma.userActivity.create({
      data: {
        userId,
        activityType,
        deviceInfo: requestInfo.deviceInfo || null,
        ipAddress,
        userAgent,
        details: details || {},
      },
    });
    
    console.log(`Activity logged: ${activityType} for user ${userId}`);
    return activity;
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw the error - we don't want app functionality to break 
    // if logging fails
    return null;
  }
}

/**
 * Log user signup
 * @param {string} userId - User ID from Firebase
 * @param {string} email - User email
 * @param {Object} requestInfo - Request information
 * @param {string} method - Signup method (email, google, etc.)
 */
export async function logSignup(userId, email, requestInfo = {}, method = 'email') {
  return logUserActivity(userId, 'signup', requestInfo, { 
    email, 
    method,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log user login
 * @param {string} userId - User ID from Firebase
 * @param {string} email - User email
 * @param {Object} requestInfo - Request information
 * @param {string} method - Login method (email, google, etc.)
 */
export async function logLogin(userId, email, requestInfo = {}, method = 'email') {
  return logUserActivity(userId, 'login', requestInfo, { 
    email, 
    method,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log user logout
 * @param {string} userId - User ID from Firebase
 * @param {Object} requestInfo - Request information
 */
export async function logLogout(userId, requestInfo = {}) {
  return logUserActivity(userId, 'logout', requestInfo, {
    timestamp: new Date().toISOString()
  });
}

/**
 * Log page visited
 * @param {string} userId - User ID from Firebase
 * @param {string} page - Page path visited
 * @param {Object} requestInfo - Request information
 */
export async function logPageVisit(userId, page, requestInfo = {}) {
  return logUserActivity(userId, 'page_visited', requestInfo, { 
    page,
    timestamp: new Date().toISOString() 
  });
}