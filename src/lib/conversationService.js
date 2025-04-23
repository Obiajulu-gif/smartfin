import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Service for managing conversation history
 * Provides functions to save, retrieve, and update conversations
 */
const COLLECTION_NAME = 'conversation_history';

/**
 * Saves a new message to the conversation history
 * @param {string} userId - The user ID
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 * @param {string} source - Source of the conversation (e.g., 'web', 'mobile')
 * @returns {Promise<Object>} - The updated conversation
 */
export async function saveMessage(userId, role, content, source = 'web') {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const timestamp = new Date();
    
    // Find the most recent conversation for this user
    let conversation = await collection.findOne(
      { user_id: userId },
      { sort: { updated_at: -1 } }
    );
    
    // If no conversation exists or the last one is older than 24 hours, create a new one
    if (!conversation || (timestamp - new Date(conversation.updated_at) > 24 * 60 * 60 * 1000)) {
      // Create a new conversation
      const newConversation = {
        user_id: userId,
        messages: [{
          role,
          content,
          timestamp
        }],
        created_at: timestamp,
        updated_at: timestamp,
        metadata: {
          source,
          session_id: new ObjectId().toString(),
          context_version: '1.0'
        }
      };
      
      const result = await collection.insertOne(newConversation);
      return { ...newConversation, _id: result.insertedId };
    }
    
    // Otherwise, add to the existing conversation
    const updatedConversation = await collection.findOneAndUpdate(
      { _id: conversation._id },
      { 
        $push: { 
          messages: { 
            role, 
            content, 
            timestamp 
          } 
        },
        $set: { updated_at: timestamp }
      },
      { returnDocument: 'after' }
    );
    
    return updatedConversation;
  } catch (error) {
    console.error('Error saving message:', error);
    throw new Error('Failed to save message to conversation history');
  }
}

/**
 * Retrieves conversation history for a user
 * @param {string} userId - The user ID
 * @param {number} limit - Maximum number of conversations to return
 * @returns {Promise<Array>} - Array of conversation objects
 */
export async function getConversationHistory(userId, limit = 1) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    // Get the most recent conversations for this user
    const conversations = await collection
      .find({ user_id: userId })
      .sort({ updated_at: -1 })
      .limit(limit)
      .toArray();
    
    return conversations;
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    throw new Error('Failed to retrieve conversation history');
  }
}

/**
 * Retrieves the most recent conversation for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - The most recent conversation or null
 */
export async function getRecentConversation(userId) {
  try {
    const conversations = await getConversationHistory(userId, 1);
    return conversations.length > 0 ? conversations[0] : null;
  } catch (error) {
    console.error('Error retrieving recent conversation:', error);
    throw new Error('Failed to retrieve recent conversation');
  }
}

/**
 * Deletes a conversation by ID
 * @param {string} conversationId - The conversation ID to delete
 * @param {string} userId - The user ID (for verification)
 * @returns {Promise<boolean>} - True if deleted successfully
 */
export async function deleteConversation(conversationId, userId) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    // Delete the conversation (ensuring it belongs to the user)
    const result = await collection.deleteOne({
      _id: new ObjectId(conversationId),
      user_id: userId
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw new Error('Failed to delete conversation');
  }
}

/**
 * Clears all conversation history for a user
 * @param {string} userId - The user ID
 * @returns {Promise<number>} - Number of conversations deleted
 */
export async function clearConversationHistory(userId) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    
    // Delete all conversations for this user
    const result = await collection.deleteMany({ user_id: userId });
    
    return result.deletedCount;
  } catch (error) {
    console.error('Error clearing conversation history:', error);
    throw new Error('Failed to clear conversation history');
  }
} 