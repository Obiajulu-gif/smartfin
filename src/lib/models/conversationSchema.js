/**
 * Schema definition for conversation history
 * This represents the structure of the conversation_history collection in MongoDB
 */

// Conversation schema for MongoDB
const conversationSchema = {
  user_id: String,        // User ID who owns this conversation
  messages: [             // Array of message objects
    {
      role: String,       // 'user' or 'assistant'
      content: String,    // Message content
      timestamp: Date     // When the message was sent/received
    }
  ],
  created_at: Date,       // When the conversation started
  updated_at: Date,       // When the conversation was last updated
  metadata: {             // Additional metadata
    source: String,       // Where the conversation originated (e.g., 'web', 'mobile')
    session_id: String,   // Unique session identifier
    context_version: String // Version of context data used
  }
};

export default conversationSchema; 