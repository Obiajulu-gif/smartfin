/**
 * User Service
 * This service handles user-related operations using MongoDB models
 */

import { ObjectId } from 'mongodb';
import {
  createDocumentInCollection,
  updateDocumentInCollection,
  deleteDocumentFromCollection,
  findDocumentsInCollection,
  findDocumentById,
  documentExists
} from '../lib/mongodb-utils';
import { userSchema } from '../lib/models';

// Collection name for users
const COLLECTION_NAME = 'users';

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user
 */
export async function createUser(userData) {
  try {
    // Validate required fields
    if (!userData.user_id) {
      throw new Error('User ID is required');
    }
    if (!userData.email) {
      throw new Error('Email is required');
    }
    
    // Check if user already exists
    const exists = await documentExists(COLLECTION_NAME, { 
      user_id: userData.user_id 
    });
    
    if (exists) {
      throw new Error('User already exists');
    }
    
    // Create the user
    return await createDocumentInCollection(COLLECTION_NAME, userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User or null if not found
 */
export async function getUserById(userId) {
  try {
    // Find user by user_id (not MongoDB _id)
    const result = await findDocumentsInCollection(COLLECTION_NAME, {
      user_id: userId
    });
    
    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - Updated user
 */
export async function updateUser(userId, userData) {
  try {
    // First find the user to get the MongoDB _id
    const user = await getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update the user using MongoDB _id
    return await updateDocumentInCollection(
      COLLECTION_NAME, 
      user._id.toString(), 
      userData
    );
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - True if user was deleted
 */
export async function deleteUser(userId) {
  try {
    // First find the user to get the MongoDB _id
    const user = await getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Delete the user using MongoDB _id
    return await deleteDocumentFromCollection(
      COLLECTION_NAME, 
      user._id.toString()
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get user's financial profile
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - Financial profile or null if not found
 */
export async function getUserFinancialProfile(userId) {
  try {
    const user = await getUserById(userId);
    
    if (!user || !user.financial_profile) {
      return null;
    }
    
    return user.financial_profile;
  } catch (error) {
    console.error('Error getting user financial profile:', error);
    throw error;
  }
}

/**
 * Update user's financial profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Financial profile data
 * @returns {Promise<Object>} - Updated user
 */
export async function updateUserFinancialProfile(userId, profileData) {
  try {
    // Get current user
    const user = await getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Prepare update data
    const updateData = {
      financial_profile: {
        ...(user.financial_profile || {}),
        ...profileData
      }
    };
    
    // Update the user
    return await updateUser(userId, updateData);
  } catch (error) {
    console.error('Error updating user financial profile:', error);
    throw error;
  }
}

/**
 * Add financial goal to user
 * @param {string} userId - User ID
 * @param {Object} goalData - Goal data
 * @returns {Promise<Object>} - Updated user
 */
export async function addFinancialGoal(userId, goalData) {
  try {
    // Get current user
    const user = await getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Initialize financial profile if not exists
    if (!user.financial_profile) {
      user.financial_profile = {};
    }
    
    // Initialize goals array if not exists
    if (!user.financial_profile.financial_goals) {
      user.financial_profile.financial_goals = [];
    }
    
    // Add new goal with internal ID
    const newGoal = {
      ...goalData,
      id: new ObjectId().toString(),
      created_at: new Date()
    };
    
    // Prepare update data
    const financialGoals = [...user.financial_profile.financial_goals, newGoal];
    const updateData = {
      financial_profile: {
        ...user.financial_profile,
        financial_goals: financialGoals
      }
    };
    
    // Update the user
    return await updateUser(userId, updateData);
  } catch (error) {
    console.error('Error adding financial goal:', error);
    throw error;
  }
}

/**
 * Update user preferences
 * @param {string} userId - User ID
 * @param {Object} preferencesData - Preferences data
 * @returns {Promise<Object>} - Updated user
 */
export async function updateUserPreferences(userId, preferencesData) {
  try {
    // Get current user
    const user = await getUserById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Prepare update data
    const updateData = {
      preferences: {
        ...(user.preferences || {}),
        ...preferencesData
      }
    };
    
    // Update the user
    return await updateUser(userId, updateData);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

export default {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserFinancialProfile,
  updateUserFinancialProfile,
  addFinancialGoal,
  updateUserPreferences
}; 