/**
 * Client for communicating with the SmartFin-AI API
 * Sends user data, message, and context to the AI endpoint and returns the response
 */
import { getRecentConversation } from './conversationService';

// Base URL for the SmartFin AI API
const SMARTFIN_BASE = process.env.SMARTFIN_BASE || 'https://smartfin-ai-api.onrender.com';

/**
 * Sends user data to the SmartFin-AI API and returns the response
 * @param {string} userId - The user's ID
 * @param {string} userMessage - The message from the user
 * @param {Object} context - The full user context data from MongoDB
 * @returns {Promise<string>} The AI response
 */
export async function sendToSmartFin(userId, userMessage, context) {
  try {
    // Construct the API endpoint URL
    const url = `${SMARTFIN_BASE}/api/v1/conversation/${userId}`;
    
    // Get recent conversation history
    let conversationHistory = [];
    try {
      const recentConversation = await getRecentConversation(userId);
      if (recentConversation && recentConversation.messages) {
        // Extract just the messages, removing any metadata
        conversationHistory = recentConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      }
    } catch (error) {
      console.warn('Could not retrieve conversation history:', error);
      // Continue without conversation history
    }
    
    // Prepare the payload to send to the API, including conversation history
    const payload = {
      user_id: userId,
      message: userMessage,
      context: {
        ...context,
        conversation_history: conversationHistory
      }
    };
    
    // Make the request to the SmartFin-AI API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SmartFin API error: ${response.status} ${errorText}`);
    }
    
    // Extract and return the AI response
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling SmartFin-AI:', error);
    throw new Error('Failed to get response from financial assistant');
  }
} 