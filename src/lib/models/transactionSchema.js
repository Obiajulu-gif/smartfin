/**
 * Schema definition for transaction model
 * This represents the structure of the transactions collection in MongoDB
 */

// Transaction schema for MongoDB
const transactionSchema = {
  user_id: String,               // User ID who owns this transaction
  amount: Number,                // Transaction amount (positive for income, negative for expense)
  category: String,              // Transaction category (e.g., 'groceries', 'utilities', 'salary')
  subcategory: String,           // Optional subcategory for more detailed categorization
  description: String,           // Transaction description/note
  date: Date,                    // Date of the transaction
  created_at: Date,              // When the transaction was recorded in the system
  updated_at: Date,              // When the transaction was last updated
  payment_method: String,        // Payment method used (e.g., 'credit_card', 'cash', 'bank_transfer')
  account_id: String,            // ID of the account used for the transaction
  account_name: String,          // Name of the account (e.g., 'Chase Checking', 'Capital One Credit Card')
  currency: String,              // Currency of the transaction (e.g., 'USD', 'EUR')
  status: String,                // Status of the transaction (e.g., 'completed', 'pending', 'failed')
  location: {                    // Location information
    name: String,                // Name of the location/merchant
    address: String,             // Address
    city: String,                // City
    country: String,             // Country
    coordinates: {               // Geographical coordinates
      latitude: Number,          // Latitude
      longitude: Number          // Longitude
    }
  },
  tags: [String],                // Array of tags for the transaction
  attachments: [{                // Array of attachments (e.g., receipts)
    name: String,                // Attachment name
    url: String,                 // URL to the attachment
    mime_type: String,           // MIME type of the attachment
    size: Number,                // Size of the attachment in bytes
    upload_date: Date            // When the attachment was uploaded
  }],
  recurring: {                   // Information for recurring transactions
    is_recurring: Boolean,       // Whether this is a recurring transaction
    frequency: String,           // Frequency of recurrence (e.g., 'monthly', 'weekly')
    start_date: Date,            // Start date of the recurring transaction
    end_date: Date,              // End date of the recurring transaction (null if ongoing)
    interval: Number,            // Interval value (e.g., 1 for monthly, 2 for bi-monthly)
    day_of_month: Number,        // Day of month for monthly transactions
    day_of_week: Number          // Day of week for weekly transactions (0 = Sunday, 6 = Saturday)
  },
  metadata: {                    // Additional metadata
    source: String,              // Source of the transaction (e.g., 'manual', 'import', 'recurring')
    external_id: String,         // ID from external system (if imported)
    import_batch_id: String      // Batch ID if part of an import
  }
};

export default transactionSchema; 